import { createAdminClient } from "@/lib/supabase/admin";
import { getCourseBySlug } from "@/lib/courses";
import { buildProgressSummary, type CourseProgressSummary } from "@/lib/course-progress-schema";
import { getApplications } from "@/Services/getApplications";
import { getAllEnrollments, type AdminEnrollment } from "@/Services/admin-enrollments";
import { enrollmentProgressKey } from "@/Services/admin-course-progress";
import type { AdminApplication } from "@/Services/getApplications";
import {
  getCompletionVerificationsForUser,
  type CompletionVerification,
} from "@/Services/completion-verifications";

export type AdminUserCertificate = {
  id: string;
  course_slug: string;
  course_title: string;
  issued_at: string;
};

export type AdminUserDetail = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  created_at: string | null;
  enrollments: (AdminEnrollment & { progress?: CourseProgressSummary })[];
  applications: AdminApplication[];
  certificates: AdminUserCertificate[];
  completionVerifications: CompletionVerification[];
};

export async function getAdminUserDetail(userId: string): Promise<AdminUserDetail | null> {
  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return null;
  }

  const { data: authResult, error: authError } = await admin.auth.admin.getUserById(userId);
  if (authError || !authResult.user) {
    return null;
  }

  const authUser = authResult.user;
  const { data: profile } = await admin
    .from("profiles")
    .select("id, full_name, email")
    .eq("id", userId)
    .maybeSingle();

  const role =
    (authUser.app_metadata?.role as string | undefined) ??
    (authUser.user_metadata?.role as string | undefined) ??
    null;

  const meta = authUser.user_metadata ?? {};
  const fullName =
    (profile?.full_name as string | undefined) ??
    (meta.full_name as string | undefined) ??
    (meta.name as string | undefined) ??
    null;
  const email = (profile?.email as string | undefined) ?? authUser.email ?? null;

  const [allEnrollments, allApplications, progressResult, certsResult, completionVerifications] =
    await Promise.all([
    getAllEnrollments(),
    getApplications(),
    admin.from("course_progress").select("course_slug, week_index, completed_at").eq("user_id", userId),
    admin.from("course_certificates").select("id, course_slug, course_title, issued_at").eq("user_id", userId),
    getCompletionVerificationsForUser(userId),
  ]);

  const enrollments = allEnrollments.filter((e) => e.user_id === userId);
  const applications = allApplications.filter((a) => a.user_id === userId);
  const progressRows = progressResult.data ?? [];

  const enrollmentsWithProgress = enrollments.map((enrollment) => {
    const course = getCourseBySlug(enrollment.course_slug);
    const totalWeeks = course?.curriculum.length ?? 0;
    const progress =
      totalWeeks > 0
        ? buildProgressSummary(enrollment.course_slug, totalWeeks, progressRows)
        : undefined;

    return { ...enrollment, progress };
  });

  return {
    id: userId,
    full_name: fullName,
    email,
    role,
    created_at: authUser.created_at ?? null,
    enrollments: enrollmentsWithProgress,
    applications,
    certificates: (certsResult.data ?? []) as AdminUserCertificate[],
    completionVerifications,
  };
}

export function getAdminUserDetailProgressKey(userId: string, courseSlug: string) {
  return enrollmentProgressKey(userId, courseSlug);
}
