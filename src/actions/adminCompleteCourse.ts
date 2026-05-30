"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { formatCertificateId } from "@/lib/certificates";
import { getCourseBySlug } from "@/lib/courses";
import { notifyCourseCompleted } from "@/lib/email";
import { isSupabaseSchemaError } from "@/lib/applications-schema-sql";
import { absoluteUrl } from "@/lib/seo";
import { issueCertificateIfComplete } from "@/Services/certificates";
import { createAdminClient } from "@/lib/supabase/admin";

async function getStudentName(userId: string, fallbackEmail?: string | null) {
  try {
    const admin = createAdminClient();
    const { data: profile } = await admin.from("profiles").select("full_name, email").eq("id", userId).maybeSingle();
    if (profile?.full_name) {
      return {
        name: profile.full_name as string,
        email: (profile.email as string | undefined) ?? fallbackEmail ?? null,
      };
    }

    const { data: authUser } = await admin.auth.admin.getUserById(userId);
    const meta = authUser.user?.user_metadata ?? {};
    const name =
      (meta.full_name as string | undefined) ??
      (meta.name as string | undefined) ??
      fallbackEmail?.split("@")[0] ??
      "Student";

    return { name, email: authUser.user?.email ?? fallbackEmail ?? null };
  } catch {
    return { name: fallbackEmail?.split("@")[0] ?? "Student", email: fallbackEmail ?? null };
  }
}

export async function adminCompleteEnrollmentCourse(enrollmentId: string) {
  await requireAdmin();

  let admin;
  try {
    admin = createAdminClient();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Admin database client is not configured.";
    return { ok: false as const, error: message };
  }

  const { data: enrollment, error: fetchError } = await admin
    .from("enrollments")
    .select("id, user_id, course_slug, course_title, email, status")
    .eq("id", enrollmentId)
    .maybeSingle();

  if (fetchError || !enrollment) {
    return { ok: false as const, error: "Enrollment not found." };
  }

  if (enrollment.status !== "paid") {
    return { ok: false as const, error: "Only paid enrollments can be marked complete." };
  }

  if (!enrollment.user_id) {
    return {
      ok: false as const,
      error: "This enrollment has no linked account. Ask the student to sign in once, or re-grant via manual enrollment.",
    };
  }

  const course = getCourseBySlug(enrollment.course_slug);
  if (!course) {
    return { ok: false as const, error: "Course not found." };
  }

  const completedAt = new Date().toISOString();
  const progressRows = course.curriculum.map((_, weekIndex) => ({
    user_id: enrollment.user_id as string,
    course_slug: enrollment.course_slug,
    week_index: weekIndex,
    completed_at: completedAt,
  }));

  const { error } = await admin.from("course_progress").upsert(progressRows, {
    onConflict: "user_id,course_slug,week_index",
  });

  if (error) {
    const message = isSupabaseSchemaError(error.message)
      ? "Run supabase/course-progress-schema.sql in Supabase SQL Editor."
      : error.message;
    return { ok: false as const, error: message };
  }

  const { name: studentName, email: studentEmail } = await getStudentName(
    enrollment.user_id,
    enrollment.email,
  );

  const certificate = await issueCertificateIfComplete({
    userId: enrollment.user_id,
    courseSlug: enrollment.course_slug,
    studentName,
    progressRows: progressRows.map((row) => ({
      course_slug: row.course_slug,
      week_index: row.week_index,
      completed_at: row.completed_at,
    })),
  });

  const certificateId = certificate?.id ?? formatCertificateId(enrollment.user_id, enrollment.course_slug);
  const verifyUrl = absoluteUrl(`/certificates/verify/${certificateId}`);

  if (studentEmail) {
    void notifyCourseCompleted({
      studentName,
      studentEmail,
      courseTitle: course.title,
      courseSlug: enrollment.course_slug,
      certificateId,
      verifyUrl,
    }).catch((err) => console.error("[adminCompleteEnrollmentCourse] email", err));
  }

  revalidatePath("/dashboard/enrollments");
  revalidatePath("/dashboard/my-courses");
  revalidatePath(`/dashboard/my-courses/${enrollment.course_slug}`);
  revalidatePath("/dashboard/certificates");
  revalidatePath("/dashboard");

  return { ok: true as const, certificateId };
}
