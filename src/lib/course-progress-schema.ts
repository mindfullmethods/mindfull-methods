import { cache } from "react";

import { createAdminClient } from "@/lib/supabase/admin";

export { COURSE_PROGRESS_TABLE_SQL } from "@/lib/course-progress-schema-sql";

export const isCourseProgressTableReady = cache(async () => {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("course_progress").select("id").limit(1);
    return !error;
  } catch {
    return false;
  }
});

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
  lastActivityAt: string | null;
  completedAt: string | null;
};

function latestTimestamp(rows: ProgressRow[]) {
  if (rows.length === 0) return null;
  return rows.reduce(
    (latest, row) => (row.completed_at > latest ? row.completed_at : latest),
    rows[0].completed_at,
  );
}

export function buildProgressSummary(
  courseSlug: string,
  totalWeeks: number,
  rows: ProgressRow[]
): CourseProgressSummary {
  const courseRows = rows.filter((row) => row.course_slug === courseSlug);
  const completedWeeks = courseRows.map((row) => row.week_index).sort((a, b) => a - b);
  const percent = totalWeeks > 0 ? Math.round((completedWeeks.length / totalWeeks) * 100) : 0;
  const lastActivityAt = latestTimestamp(courseRows);
  const completedAt = percent >= 100 ? lastActivityAt : null;

  return { courseSlug, completedWeeks, totalWeeks, percent, lastActivityAt, completedAt };
}
