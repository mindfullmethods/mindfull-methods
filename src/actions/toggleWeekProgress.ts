"use server";

import { revalidatePath } from "next/cache";

import { getCourseBySlug } from "@/lib/courses";
import { linkOrphanEnrollmentsByEmail } from "@/lib/enrollments";
import { notifyCompletionPendingReview } from "@/lib/email";
import { requestCompletionVerification } from "@/Services/completion-verifications";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseSchemaError } from "@/lib/applications-schema-sql";
import { createClient } from "@/lib/supabase/server";

async function getStudentName(user: { id: string; email?: string; user_metadata?: Record<string, unknown> }) {
  try {
    const admin = createAdminClient();
    const { data: profile } = await admin.from("profiles").select("full_name").eq("id", user.id).maybeSingle();
    if (profile?.full_name) return profile.full_name as string;
  } catch {
    // ignore
  }

  return (
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Student"
  );
}

export async function toggleWeekProgressAction(
  courseSlug: string,
  weekIndex: number,
  completed: boolean
): Promise<{ ok: true; justCompleted?: boolean } | { ok: false; error: string }> {
  const course = getCourseBySlug(courseSlug);
  if (!course) {
    return { ok: false, error: "Course not found." };
  }

  if (weekIndex < 0 || weekIndex >= course.curriculum.length) {
    return { ok: false, error: "Invalid week." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Please sign in." };
  }

  if (user.email) {
    await linkOrphanEnrollmentsByEmail(user.id, user.email);
  }

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_slug", courseSlug)
    .eq("status", "paid")
    .limit(1);

  if (!enrollment?.length) {
    return { ok: false, error: "Enroll in this course to track progress." };
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return { ok: false, error: "Server configuration error." };
  }

  if (completed) {
    const { error } = await admin.from("course_progress").upsert(
      {
        user_id: user.id,
        course_slug: courseSlug,
        week_index: weekIndex,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,course_slug,week_index" }
    );

    if (error) {
      const message = isSupabaseSchemaError(error.message)
        ? "Run supabase/course-progress-schema.sql in Supabase SQL Editor."
        : error.message;
      return { ok: false, error: message };
    }
  } else {
    const { error } = await admin
      .from("course_progress")
      .delete()
      .eq("user_id", user.id)
      .eq("course_slug", courseSlug)
      .eq("week_index", weekIndex);

    if (error) {
      return { ok: false, error: error.message };
    }
  }

  let justCompleted = false;

  if (completed) {
    const { data: rows } = await admin
      .from("course_progress")
      .select("course_slug, week_index, completed_at")
      .eq("user_id", user.id)
      .eq("course_slug", courseSlug);

    const progressRows = rows ?? [];
    if (progressRows.length >= course.curriculum.length) {
      justCompleted = true;
      const studentName = await getStudentName(user);

      try {
        await requestCompletionVerification(user.id, courseSlug);
      } catch (err) {
        console.error("[toggleWeekProgress] verification request", err);
      }

      if (user.email) {
        void notifyCompletionPendingReview({
          studentName,
          studentEmail: user.email,
          courseTitle: course.title,
          courseSlug,
          userId: user.id,
        }).catch((err) => console.error("[toggleWeekProgress] pending email", err));
      }
    }
  }

  revalidatePath("/dashboard/my-courses");
  revalidatePath(`/dashboard/my-courses/${courseSlug}`);
  revalidatePath("/dashboard/certificates");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/analytics");
  revalidatePath("/dashboard/users");

  return { ok: true, justCompleted };
}
