import { createClient } from "@/lib/supabase/server";
import { getCourseBySlug } from "@/lib/courses";
import {
  buildProgressSummary,
  type CourseProgressSummary,
  type ProgressRow,
} from "@/lib/course-progress-schema";

export async function getMyProgressRows(): Promise<ProgressRow[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("course_progress")
    .select("course_slug, week_index, completed_at")
    .eq("user_id", user.id);

  if (error) {
    if (!error.message.includes("schema cache")) {
      console.error("[getMyProgressRows]", error.message);
    }
    return [];
  }

  return (data ?? []) as ProgressRow[];
}

export async function getCourseProgress(courseSlug: string): Promise<CourseProgressSummary | null> {
  const course = getCourseBySlug(courseSlug);
  if (!course) return null;

  const rows = await getMyProgressRows();
  return buildProgressSummary(courseSlug, course.curriculum.length, rows);
}

export async function getProgressSummariesForSlugs(
  slugs: string[]
): Promise<Map<string, CourseProgressSummary>> {
  const rows = await getMyProgressRows();
  const map = new Map<string, CourseProgressSummary>();

  for (const slug of slugs) {
    const course = getCourseBySlug(slug);
    if (!course) continue;
    map.set(slug, buildProgressSummary(slug, course.curriculum.length, rows));
  }

  return map;
}

export async function isEnrolledInCourse(courseSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_slug", courseSlug)
    .eq("status", "paid")
    .limit(1);

  return Boolean(data?.length);
}
