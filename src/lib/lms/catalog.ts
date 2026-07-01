import { getCourses } from "@/lib/courses";
import { getCourseImage } from "@/lib/images";
import type { LmsCourse, LmsLesson, LmsModule, LmsQuiz, LmsQuizQuestion } from "@/lib/lms/types";

function lessonId(slug: string, moduleIndex: number, lessonIndex: number) {
  return `${slug}-m${moduleIndex}-l${lessonIndex}`;
}

function moduleId(slug: string, moduleIndex: number) {
  return `${slug}-module-${moduleIndex}`;
}

/** Static catalog from marketing courses when LMS tables are empty or unavailable. */
export function buildCatalogCourses(enrolledSlugs: Set<string>, completedLessonIds: Set<string>): LmsCourse[] {
  return getCourses().map((course) => {
    const modules: LmsModule[] = course.curriculum.map((week, moduleIndex) => {
      const lessons: LmsLesson[] = week.topics.map((topic, lessonIndex) => {
        const id = lessonId(course.slug, moduleIndex, lessonIndex);
        return {
          id,
          title: topic,
          duration: "20 min",
          videoUrl: null,
          notesUrl: `/courses/${course.slug}/syllabus`,
          sortOrder: lessonIndex,
          complete: completedLessonIds.has(id),
        };
      });

      return {
        id: moduleId(course.slug, moduleIndex),
        title: week.week,
        sortOrder: moduleIndex,
        lessons,
      };
    });

    const totalLessons = modules.reduce((sum, mod) => sum + mod.lessons.length, 0);
    const completed = modules.reduce(
      (sum, mod) => sum + mod.lessons.filter((lesson) => lesson.complete).length,
      0
    );
    const progressPercent = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;

    return {
      id: course.id,
      slug: course.slug,
      title: course.title,
      description: course.longDescription,
      priceInr: Math.round(course.priceInPaise / 100),
      level: course.level,
      duration: course.duration,
      thumbnail: course.imageUrl ?? getCourseImage(course.slug),
      modules,
      progressPercent,
      enrolled: enrolledSlugs.has(course.slug),
    };
  });
}

export function getCatalogCourseBySlug(
  slug: string,
  enrolledSlugs: Set<string>,
  completedLessonIds: Set<string>
) {
  return buildCatalogCourses(enrolledSlugs, completedLessonIds).find((course) => course.slug === slug) ?? null;
}

export function getDemoQuiz(): LmsQuiz {
  const questions: LmsQuizQuestion[] = [
    {
      id: "demo-q1",
      question: "What is a prompt template?",
      options: [
        "A reusable instruction pattern",
        "A payment gateway response",
        "A database migration",
        "A video hosting endpoint",
      ],
      answer: "A reusable instruction pattern",
    },
  ];

  return {
    id: "demo-quiz-prompt-engineering",
    lessonId: "prompt-engineering-m0-l0",
    title: "Prompt Engineering Quiz",
    timerSeconds: 600,
    passingScore: 70,
    questions,
  };
}
