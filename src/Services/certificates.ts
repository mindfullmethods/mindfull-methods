import { createAdminClient } from "@/lib/supabase/admin";
import { formatCertificateId } from "@/lib/certificates";
import { getCourseBySlug } from "@/lib/courses";
import { buildProgressSummary } from "@/lib/course-progress-schema";
import { isCompletionApproved } from "@/Services/completion-verifications";

export type StoredCertificate = {
  id: string;
  user_id: string;
  course_slug: string;
  student_name: string;
  course_title: string;
  issued_at: string;
};

export async function getCertificateById(certificateId: string): Promise<StoredCertificate | null> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("course_certificates")
      .select("*")
      .eq("id", certificateId.toUpperCase())
      .maybeSingle();

    if (error || !data) return null;
    return data as StoredCertificate;
  } catch {
    return null;
  }
}

export async function issueCertificateIfComplete(params: {
  userId: string;
  courseSlug: string;
  studentName: string;
  progressRows: { course_slug: string; week_index: number; completed_at: string }[];
  requireApproval?: boolean;
}): Promise<StoredCertificate | null> {
  const course = getCourseBySlug(params.courseSlug);
  if (!course) return null;

  const summary = buildProgressSummary(params.courseSlug, course.curriculum.length, params.progressRows);
  if (summary.percent < 100) return null;

  const needsApproval = params.requireApproval ?? true;
  if (needsApproval) {
    const approved = await isCompletionApproved(params.userId, params.courseSlug);
    if (!approved) return null;
  }

  const certificateId = formatCertificateId(params.userId, params.courseSlug);
  const issuedAt = summary.completedAt ?? new Date().toISOString();

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("course_certificates")
      .upsert(
        {
          id: certificateId,
          user_id: params.userId,
          course_slug: params.courseSlug,
          student_name: params.studentName,
          course_title: course.title,
          issued_at: issuedAt,
        },
        { onConflict: "user_id,course_slug" }
      )
      .select("*")
      .single();

    if (error) {
      console.warn("[issueCertificateIfComplete]", error.message);
      return null;
    }

    return data as StoredCertificate;
  } catch (err) {
    console.warn("[issueCertificateIfComplete]", err);
    return null;
  }
}
