import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

import type { CourseProgressSummary } from "@/lib/course-progress-schema";

type ResumeCourse = {
  slug: string;
  title: string;
  percent: number;
};

export default function ResumeLearningBanner({ course }: { course: ResumeCourse }) {
  return (
    <section className="mt-6 rounded-3xl border border-violet-200 bg-gradient-to-r from-violet-50 to-teal-50 p-5 dark:border-violet-400/20 dark:from-violet-400/10 dark:to-teal-400/10 sm:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-violet-700 dark:text-violet-300">
            <BookOpen size={14} />
            Pick up where you left off
          </p>
          <h2 className="mt-2 text-xl font-black sm:text-2xl">{course.title}</h2>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-2 w-40 overflow-hidden rounded-full bg-violet-200 dark:bg-violet-900/40">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-teal-400"
                style={{ width: `${course.percent}%` }}
              />
            </div>
            <span className="text-sm font-black text-violet-800 dark:text-violet-200">{course.percent}% complete</span>
          </div>
        </div>
        <Link
          href={`/dashboard/my-courses/${course.slug}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-black text-white transition hover:bg-violet-700"
        >
          Continue learning
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

export function findResumeCourse(
  enrollments: { course_slug: string; course?: { title?: string } | null; course_title?: string }[],
  progressMap: Map<string, CourseProgressSummary>,
): ResumeCourse | null {
  for (const enrollment of enrollments) {
    const progress = progressMap.get(enrollment.course_slug);
    const percent = progress?.percent ?? 0;
    if (percent >= 100) continue;

    return {
      slug: enrollment.course_slug,
      title: enrollment.course?.title ?? enrollment.course_title ?? enrollment.course_slug,
      percent,
    };
  }

  return null;
}
