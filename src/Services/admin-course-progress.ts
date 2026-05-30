import { createAdminClient } from "@/lib/supabase/admin";
import { getCourseBySlug } from "@/lib/courses";
import { buildProgressSummary, type CourseProgressSummary, type ProgressRow } from "@/lib/course-progress-schema";
import type { AdminEnrollment } from "@/Services/admin-enrollments";

export type EnrollmentProgressKey = `${string}:${string}`;

export function enrollmentProgressKey(userId: string, courseSlug: string): EnrollmentProgressKey {
  return `${userId}:${courseSlug}`;
}

export async function getAdminProgressForEnrollments(
  enrollments: AdminEnrollment[],
): Promise<Map<EnrollmentProgressKey, CourseProgressSummary>> {
  const map = new Map<EnrollmentProgressKey, CourseProgressSummary>();
  const pairs = enrollments.filter((e) => e.user_id && e.status === "paid");

  if (pairs.length === 0) return map;

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return map;
  }

  const userIds = [...new Set(pairs.map((e) => e.user_id).filter(Boolean))] as string[];
  const { data, error } = await admin
    .from("course_progress")
    .select("user_id, course_slug, week_index, completed_at")
    .in("user_id", userIds);

  if (error) {
    console.error("[getAdminProgressForEnrollments]", error.message);
    return map;
  }

  const rowsByKey = new Map<EnrollmentProgressKey, ProgressRow[]>();

  for (const row of data ?? []) {
    const key = enrollmentProgressKey(row.user_id, row.course_slug);
    const list = rowsByKey.get(key) ?? [];
    list.push({
      course_slug: row.course_slug,
      week_index: row.week_index,
      completed_at: row.completed_at,
    });
    rowsByKey.set(key, list);
  }

  for (const enrollment of pairs) {
    if (!enrollment.user_id) continue;
    const course = getCourseBySlug(enrollment.course_slug);
    if (!course) continue;

    const key = enrollmentProgressKey(enrollment.user_id, enrollment.course_slug);
    const rows = rowsByKey.get(key) ?? [];
    map.set(key, buildProgressSummary(enrollment.course_slug, course.curriculum.length, rows));
  }

  return map;
}
