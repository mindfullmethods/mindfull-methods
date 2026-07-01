import { createClient } from "@/lib/supabase/server";
import { buildCatalogCourses, getCatalogCourseBySlug, getDemoQuiz } from "@/lib/lms/catalog";
import { isLmsSchemaReady } from "@/lib/lms/schema";
import type {
  LmsAssignment,
  LmsCourse,
  LmsDashboardStats,
  LmsQuiz,
  LmsRole,
} from "@/lib/lms/types";
import { getMyEnrollments } from "@/Services/enrollments";

async function getEnrolledSlugs() {
  const enrollments = await getMyEnrollments();
  return new Set(enrollments.map((e) => e.course_slug));
}

async function getCompletedLessonIds(userId: string) {
  const ready = await isLmsSchemaReady();
  if (!ready) return new Set<string>();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lms_lesson_progress")
    .select("lesson_id")
    .eq("user_id", userId)
    .eq("completed", true);

  if (error) return new Set<string>();
  return new Set((data ?? []).map((row) => row.lesson_id as string));
}

export async function getLmsProfileRole(userId: string): Promise<LmsRole | null> {
  const ready = await isLmsSchemaReady();
  if (!ready) return null;

  const supabase = await createClient();
  const { data } = await supabase.from("lms_profiles").select("role").eq("auth_user_id", userId).maybeSingle();

  if (!data?.role) return null;
  return data.role as LmsRole;
}

export async function getLmsCourses(): Promise<LmsCourse[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const enrolledSlugs = await getEnrolledSlugs();
  const completedLessonIds = user ? await getCompletedLessonIds(user.id) : new Set<string>();

  const ready = await isLmsSchemaReady();
  if (!ready) {
    return buildCatalogCourses(enrolledSlugs, completedLessonIds);
  }

  const { data: rows, error } = await supabase
    .from("lms_courses")
    .select("id, slug, title, description, price_inr, level, duration, thumbnail")
    .order("created_at", { ascending: true });

  if (error || !rows?.length) {
    return buildCatalogCourses(enrolledSlugs, completedLessonIds);
  }

  const courses: LmsCourse[] = [];

  for (const row of rows) {
    const catalog = getCatalogCourseBySlug(row.slug, enrolledSlugs, completedLessonIds);
    courses.push({
      id: row.id,
      slug: row.slug,
      title: row.title,
      description: row.description,
      priceInr: Number(row.price_inr),
      level: row.level,
      duration: row.duration,
      thumbnail: row.thumbnail ?? catalog?.thumbnail ?? null,
      modules: catalog?.modules ?? [],
      progressPercent: catalog?.progressPercent ?? 0,
      enrolled: enrolledSlugs.has(row.slug),
    });
  }

  return courses;
}

export async function getLmsCourseBySlug(slug: string): Promise<LmsCourse | null> {
  const enrolledSlugs = await getEnrolledSlugs();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const completedLessonIds = user ? await getCompletedLessonIds(user.id) : new Set<string>();

  const ready = await isLmsSchemaReady();
  if (!ready) {
    return getCatalogCourseBySlug(slug, enrolledSlugs, completedLessonIds);
  }

  const { data: row } = await supabase
    .from("lms_courses")
    .select("id, slug, title, description, price_inr, level, duration, thumbnail")
    .eq("slug", slug)
    .maybeSingle();

  if (!row) {
    return getCatalogCourseBySlug(slug, enrolledSlugs, completedLessonIds);
  }

  return (
    getCatalogCourseBySlug(slug, enrolledSlugs, completedLessonIds) ?? {
      id: row.id,
      slug: row.slug,
      title: row.title,
      description: row.description,
      priceInr: Number(row.price_inr),
      level: row.level,
      duration: row.duration,
      thumbnail: row.thumbnail,
      modules: [],
      progressPercent: 0,
      enrolled: enrolledSlugs.has(row.slug),
    }
  );
}

export async function getLmsDashboardStats(): Promise<LmsDashboardStats> {
  const courses = await getLmsCourses();
  const enrolled = courses.filter((c) => c.enrolled);
  const averageProgress =
    enrolled.length > 0
      ? Math.round(enrolled.reduce((sum, c) => sum + c.progressPercent, 0) / enrolled.length)
      : 0;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let certificateCount = 0;
  if (user) {
    const { count } = await supabase
      .from("course_certificates")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);
    certificateCount = count ?? 0;
  }

  const assignments = await getLmsAssignments();

  return {
    enrolledCount: enrolled.length,
    averageProgress,
    certificateCount,
    upcomingAssignments: assignments.filter((a) => a.status !== "Submitted").length,
  };
}

export async function getLmsQuiz(): Promise<LmsQuiz> {
  const ready = await isLmsSchemaReady();
  if (!ready) return getDemoQuiz();

  const supabase = await createClient();
  const { data: quiz } = await supabase
    .from("lms_quizzes")
    .select("id, lesson_id, title, timer_seconds, passing_score")
    .limit(1)
    .maybeSingle();

  if (!quiz) return getDemoQuiz();

  const { data: questions } = await supabase
    .from("lms_quiz_questions")
    .select("id, question, options, answer")
    .eq("quiz_id", quiz.id);

  return {
    id: quiz.id,
    lessonId: quiz.lesson_id,
    title: quiz.title,
    timerSeconds: quiz.timer_seconds,
    passingScore: quiz.passing_score,
    questions: (questions ?? []).map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options as string[],
      answer: q.answer,
    })),
  };
}

export async function getLmsAssignments(): Promise<LmsAssignment[]> {
  const demo: LmsAssignment[] = [
    {
      id: "demo-a1",
      lessonId: "prompt-engineering-m0-l0",
      title: "Prompt audit report",
      courseTitle: "Prompt Engineering",
      dueAt: "2026-06-12",
      status: "Due soon",
      grade: null,
    },
    {
      id: "demo-a2",
      lessonId: "generative-ai-llms-m0-l0",
      title: "RAG architecture diagram",
      courseTitle: "Generative AI & LLMs",
      dueAt: "2026-06-18",
      status: "Open",
      grade: null,
    },
  ];

  const ready = await isLmsSchemaReady();
  if (!ready) return demo;

  const supabase = await createClient();
  const { data, error } = await supabase.from("lms_assignments").select("id, lesson_id, title, due_at").limit(20);

  if (error || !data?.length) return demo;

  return data.map((row) => ({
    id: row.id,
    lessonId: row.lesson_id,
    title: row.title,
    courseTitle: "Course",
    dueAt: row.due_at,
    status: "Open",
    grade: null,
  }));
}
