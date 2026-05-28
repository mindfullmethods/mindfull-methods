import { createAdminClient } from "@/lib/supabase/admin";

export { COURSE_PROGRESS_TABLE_SQL } from "@/lib/course-progress-schema-sql";

export async function isCourseProgressTableReady() {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("course_progress").select("id").limit(1);
    return !error;
  } catch {
    return false;
  }
}

export type ProgressRow = {
  course_slug: string;
  week_index: number;
  completed_at: string;
};

export type CourseProgressSummary = {
  courseSlug: string;
  completedWeeks: number[];
  totalWeeks: number;
  percent: number;
};

export function buildProgressSummary(
  courseSlug: string,
  totalWeeks: number,
  rows: ProgressRow[]
): CourseProgressSummary {
  const completedWeeks = rows
    .filter((row) => row.course_slug === courseSlug)
    .map((row) => row.week_index)
    .sort((a, b) => a - b);

  const percent = totalWeeks > 0 ? Math.round((completedWeeks.length / totalWeeks) * 100) : 0;

  return { courseSlug, completedWeeks, totalWeeks, percent };
}
