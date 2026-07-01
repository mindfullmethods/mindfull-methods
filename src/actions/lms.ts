"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { isLmsSchemaReady } from "@/lib/lms/schema";
import { isEnrolledInCourse } from "@/Services/course-progress";

export async function markLmsLessonCompleteAction(courseSlug: string, lessonId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "Sign in required." };

  const enrolled = await isEnrolledInCourse(courseSlug);
  if (!enrolled) return { ok: false, error: "Enroll in this course to track lesson progress." };

  const ready = await isLmsSchemaReady();
  if (!ready) {
    return { ok: true, message: "Progress saved locally. Run supabase/lms-portal-schema.sql for cloud sync." };
  }

  const { error } = await supabase.from("lms_lesson_progress").upsert(
    {
      user_id: user.id,
      lesson_id: lessonId,
      course_slug: courseSlug,
      completed: true,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_id" }
  );

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/dashboard/lms/learn/${courseSlug}`);
  revalidatePath("/dashboard/lms");
  return { ok: true };
}

export async function submitLmsQuizAction(quizId: string, selectedAnswer: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "Sign in required." };

  const ready = await isLmsSchemaReady();
  if (!ready) {
    const passed = selectedAnswer === "A reusable instruction pattern";
    return { ok: true, scorePercent: passed ? 100 : 0, passed };
  }

  const { data: question } = await supabase
    .from("lms_quiz_questions")
    .select("answer")
    .eq("quiz_id", quizId)
    .limit(1)
    .maybeSingle();

  const correct = question?.answer ?? "A reusable instruction pattern";
  const passed = selectedAnswer === correct;
  const scorePercent = passed ? 100 : 0;

  await supabase.from("lms_quiz_attempts").insert({
    quiz_id: quizId,
    user_id: user.id,
    score_percent: scorePercent,
    passed,
  });

  revalidatePath("/dashboard/lms/quizzes");
  return { ok: true, scorePercent, passed };
}

export async function submitLmsAssignmentAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "Sign in required." };

  const assignmentId = String(formData.get("assignmentId") ?? "demo-a1");
  const githubLink = String(formData.get("githubLink") ?? "").trim() || null;
  const projectUrl = String(formData.get("projectUrl") ?? "").trim() || null;

  const ready = await isLmsSchemaReady();
  if (!ready) {
    return { ok: true, message: "Assignment recorded in demo mode. Run LMS migration for persistence." };
  }

  const { error } = await supabase.from("lms_submissions").insert({
    assignment_id: assignmentId,
    user_id: user.id,
    github_link: githubLink,
    project_url: projectUrl,
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/lms/assignments");
  return { ok: true };
}
