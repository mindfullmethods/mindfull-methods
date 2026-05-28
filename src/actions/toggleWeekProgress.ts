"use server";

import { revalidatePath } from "next/cache";

import { getCourseBySlug } from "@/lib/courses";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseSchemaError } from "@/lib/applications-schema-sql";
import { createClient } from "@/lib/supabase/server";

export async function toggleWeekProgressAction(
  courseSlug: string,
  weekIndex: number,
  completed: boolean
): Promise<{ ok: true } | { ok: false; error: string }> {
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

  revalidatePath("/dashboard/my-courses");
  revalidatePath(`/dashboard/my-courses/${courseSlug}`);
  revalidatePath("/dashboard");

  return { ok: true };
}
