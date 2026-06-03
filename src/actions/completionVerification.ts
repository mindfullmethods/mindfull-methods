"use server";

import { revalidatePath } from "next/cache";

import { adminActorEmail, recordAdminAudit } from "@/lib/audit-log";
import { requireAdmin } from "@/lib/auth";
import { formatCertificateId } from "@/lib/certificates";
import { getCourseBySlug } from "@/lib/courses";
import { notifyCertificateRejected, notifyCourseCompleted } from "@/lib/email";
import { absoluteUrl } from "@/lib/seo";
import { issueCertificateIfComplete } from "@/Services/certificates";
import {
  getCompletionVerification,
  updateCompletionVerification,
} from "@/Services/completion-verifications";
import { createAdminClient } from "@/lib/supabase/admin";

async function getStudentContact(userId: string) {
  try {
    const admin = createAdminClient();
    const { data: profile } = await admin.from("profiles").select("full_name, email").eq("id", userId).maybeSingle();
    if (profile?.email) {
      return {
        name: (profile.full_name as string | undefined) ?? profile.email.split("@")[0] ?? "Student",
        email: profile.email as string,
      };
    }

    const { data: authUser } = await admin.auth.admin.getUserById(userId);
    const meta = authUser.user?.user_metadata ?? {};
    const email = authUser.user?.email ?? null;
    const name =
      (meta.full_name as string | undefined) ??
      (meta.name as string | undefined) ??
      email?.split("@")[0] ??
      "Student";

    return { name, email };
  } catch {
    return { name: "Student", email: null };
  }
}

export async function approveCompletionVerification(userId: string, courseSlug: string, notes?: string) {
  const adminUser = await requireAdmin();

  const verification = await getCompletionVerification(userId, courseSlug);
  if (!verification || verification.status !== "pending") {
    return { ok: false as const, error: "No pending verification found for this course." };
  }

  const course = getCourseBySlug(courseSlug);
  if (!course) {
    return { ok: false as const, error: "Course not found." };
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Admin client not configured.";
    return { ok: false as const, error: message };
  }

  const { data: rows } = await supabase
    .from("course_progress")
    .select("course_slug, week_index, completed_at")
    .eq("user_id", userId)
    .eq("course_slug", courseSlug);

  if ((rows?.length ?? 0) < course.curriculum.length) {
    return { ok: false as const, error: "Student has not completed all weeks yet." };
  }

  await updateCompletionVerification({
    userId,
    courseSlug,
    status: "approved",
    reviewerNotes: notes?.trim() || null,
  });

  const { name: studentName, email: studentEmail } = await getStudentContact(userId);

  const certificate = await issueCertificateIfComplete({
    userId,
    courseSlug,
    studentName,
    progressRows: rows ?? [],
    requireApproval: false,
  });

  const certificateId = certificate?.id ?? formatCertificateId(userId, courseSlug);
  const verifyUrl = absoluteUrl(`/certificates/verify/${certificateId}`);

  if (studentEmail) {
    void notifyCourseCompleted({
      studentName,
      studentEmail,
      courseTitle: course.title,
      courseSlug,
      certificateId,
      verifyUrl,
    }).catch((err) => console.error("[approveCompletionVerification] email", err));
  }

  void recordAdminAudit({
    actorEmail: adminActorEmail(adminUser),
    action: "certificate.approved",
    entityType: "completion_verification",
    entityId: `${userId}:${courseSlug}`,
  });

  revalidatePath("/dashboard/analytics");
  revalidatePath("/dashboard/admin-home");
  revalidatePath("/dashboard/users");
  revalidatePath(`/dashboard/users/${userId}`);
  revalidatePath("/dashboard/my-courses");
  revalidatePath(`/dashboard/my-courses/${courseSlug}`);
  revalidatePath(`/dashboard/my-courses/${courseSlug}/certificate`);
  revalidatePath("/dashboard/certificates");

  return { ok: true as const, certificateId };
}

export async function rejectCompletionVerification(userId: string, courseSlug: string, notes?: string) {
  const adminUser = await requireAdmin();

  const verification = await getCompletionVerification(userId, courseSlug);
  if (!verification || verification.status !== "pending") {
    return { ok: false as const, error: "No pending verification found for this course." };
  }

  await updateCompletionVerification({
    userId,
    courseSlug,
    status: "rejected",
    reviewerNotes: notes?.trim() || null,
  });

  const course = getCourseBySlug(courseSlug);
  const { name: studentName, email: studentEmail } = await getStudentContact(userId);

  if (studentEmail && course) {
    void notifyCertificateRejected({
      studentName,
      studentEmail,
      courseTitle: course.title,
      courseSlug,
      notes: notes?.trim() || null,
    }).catch((err) => console.error("[rejectCompletionVerification] email", err));
  }

  void recordAdminAudit({
    actorEmail: adminActorEmail(adminUser),
    action: "certificate.rejected",
    entityType: "completion_verification",
    entityId: `${userId}:${courseSlug}`,
  });

  revalidatePath("/dashboard/analytics");
  revalidatePath("/dashboard/admin-home");
  revalidatePath(`/dashboard/users/${userId}`);
  revalidatePath(`/dashboard/my-courses/${courseSlug}`);

  return { ok: true as const };
}
