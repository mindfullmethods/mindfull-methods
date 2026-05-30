import Link from "next/link";
import { ArrowLeft, Award, BookOpen } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import CourseProgressTracker from "@/components/components/dashboard/CourseProgressTracker";
import CourseProgressSchemaBanner from "@/components/components/dashboard/CourseProgressSchemaBanner";
import { getCourseProgress, isEnrolledInCourse } from "@/Services/course-progress";
import { getWeekResources } from "@/lib/course-resources";
import { getCourseBySlug } from "@/lib/courses";
import { requireUser } from "@/lib/auth";
import { isCourseProgressTableReady } from "@/lib/course-progress-schema";

export default async function CourseProgressPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireUser("/dashboard/my-courses");
  const { slug } = await params;

  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const enrolled = await isEnrolledInCourse(slug);
  if (!enrolled) {
    redirect("/dashboard/my-courses");
  }

  const tableReady = await isCourseProgressTableReady();
  const progress = tableReady ? await getCourseProgress(slug) : null;

  const weeks = course.curriculum.map((item, index) => ({
    index,
    label: item.week,
    topics: item.topics,
    resources: getWeekResources(slug, index, item.week),
  }));

  const percent = progress?.percent ?? 0;
  const isComplete = percent >= 100;

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <Link
        href="/dashboard/my-courses"
        className="inline-flex items-center gap-2 text-sm font-black text-zinc-500 hover:text-zinc-950 dark:hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to my courses
      </Link>

      <section className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">
          <BookOpen size={14} />
          Course progress
        </p>
        <h1 className="mt-3 text-3xl font-black sm:text-4xl">{course.title}</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{course.duration} · {course.level}</p>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          Check off each week as you complete milestones. Your progress saves automatically.
        </p>
        {isComplete ? (
          <Link
            href={`/dashboard/my-courses/${slug}/certificate`}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
          >
            <Award size={16} />
            View completion certificate
          </Link>
        ) : null}
      </section>

      {!tableReady ? (
        <div className="mt-8">
          <CourseProgressSchemaBanner />
        </div>
      ) : (
        <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
          <CourseProgressTracker
            courseSlug={slug}
            weeks={weeks}
            completedWeeks={progress?.completedWeeks ?? []}
            lastActivityAt={progress?.lastActivityAt}
          />
        </section>
      )}
    </main>
  );
}
