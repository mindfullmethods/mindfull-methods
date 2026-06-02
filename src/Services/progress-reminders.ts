import { createAdminClient } from "@/lib/supabase/admin";
import { getCourseBySlug } from "@/lib/courses";
import { buildProgressSummary } from "@/lib/course-progress-schema";
import { getAllEnrollments } from "@/Services/admin-enrollments";

export type ProgressReminderCandidate = {
  email: string;
  studentName: string;
  courseSlug: string;
  courseTitle: string;
  percent: number;
  kind: "start" | "continue";
};

const MS_PER_DAY = 86_400_000;

function daysSince(iso: string) {
  return (Date.now() - new Date(iso).getTime()) / MS_PER_DAY;
}

export async function getProgressReminderCandidates(): Promise<ProgressReminderCandidate[]> {
  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return [];
  }

  const enrollments = (await getAllEnrollments()).filter(
    (e) => e.status === "paid" && e.user_id && e.email?.includes("@"),
  );

  if (enrollments.length === 0) return [];

  const userIds = [...new Set(enrollments.map((e) => e.user_id).filter(Boolean))] as string[];
  const { data: progressRows } = await admin
    .from("course_progress")
    .select("user_id, course_slug, week_index, completed_at")
    .in("user_id", userIds);

  const { data: profiles } = await admin.from("profiles").select("id, full_name, email").in("id", userIds);
  const nameById = new Map((profiles ?? []).map((p) => [p.id, p.full_name as string | null]));

  const candidates: ProgressReminderCandidate[] = [];

  for (const enrollment of enrollments) {
    if (!enrollment.user_id || !enrollment.email) continue;

    const course = getCourseBySlug(enrollment.course_slug);
    if (!course) continue;

    const rows = (progressRows ?? []).filter(
      (r) => r.user_id === enrollment.user_id && r.course_slug === enrollment.course_slug,
    );
    const summary = buildProgressSummary(enrollment.course_slug, course.curriculum.length, rows);

    if (summary.percent >= 100) continue;

    const studentName =
      nameById.get(enrollment.user_id) ??
      enrollment.student_name ??
      enrollment.email.split("@")[0] ??
      "Student";

    if (summary.percent === 0) {
      if (daysSince(enrollment.created_at) >= 3) {
        candidates.push({
          email: enrollment.email,
          studentName,
          courseSlug: enrollment.course_slug,
          courseTitle: course.title,
          percent: 0,
          kind: "start",
        });
      }
      continue;
    }

    const inactiveDays = summary.lastActivityAt ? daysSince(summary.lastActivityAt) : 999;
    if (inactiveDays >= 7) {
      candidates.push({
        email: enrollment.email,
        studentName,
        courseSlug: enrollment.course_slug,
        courseTitle: course.title,
        percent: summary.percent,
        kind: "continue",
      });
    }
  }

  return candidates;
}
