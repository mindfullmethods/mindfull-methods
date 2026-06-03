import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Award, BookOpen } from "lucide-react";

import CourseProgressTracker from "@/components/components/dashboard/CourseProgressTracker";
import CourseProgressSchemaBanner from "@/components/components/dashboard/CourseProgressSchemaBanner";
import DashboardPageHeader from "@/components/components/dashboard/DashboardPageHeader";
import { getCompletionVerification } from "@/Services/completion-verifications";
import { getCourseProgress, isEnrolledInCourse } from "@/Services/course-progress";
import { getWeekResources } from "@/lib/course-resources";
import { getCourseBySlug } from "@/lib/courses";
import { getSessionUser, requireUser } from "@/lib/auth";
import { isCourseProgressTableReady } from "@/lib/course-progress-schema";

export default async function CourseProgressPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireUser("/dashboard/my-courses");
  const user = await getSessionUser();
  const { slug } = await params;

  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const enrolled = await isEnrolledInCourse(slug);
  if (!enrolled) {
    redirect("/dashboard/my-courses");
  }

  const tableReady = await isCourseProgressTableReady();
  const progress = tableReady ? await getCourseProgress(slug) : null;
  const verification =
    user?.id && tableReady ? await getCompletionVerification(user.id, slug) : null;
  const verificationStatus = verification?.status ?? null;

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
        className="inline-flex items-center gap-2 text-sm font-semibold mm-subtle transition hover:text-zinc-950 dark:hover:text-white"
      >
        ← Back to my courses
      </Link>

      <div className="mt-6">
        <DashboardPageHeader
          eyebrow="Course progress"
          title={course.title}
          description={`${course.duration} · ${course.level}. Check off each week as you complete milestones — progress saves automatically.`}
        >
          {isComplete ? (
            <Link
              href={`/dashboard/my-courses/${slug}/certificate`}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              <Award size={16} />
              View completion certificate
            </Link>
          ) : null}
        </DashboardPageHeader>
      </div>

      {!tableReady ? (
        <div className="mt-8">
          <CourseProgressSchemaBanner />
        </div>
      ) : (
        <section className="mt-8 mm-section-panel">
          <div className="relative mb-6 flex items-center gap-2">
            <BookOpen size={18} className="text-violet-600" />
            <p className="text-sm font-bold mm-heading">Weekly milestones</p>
          </div>
          <CourseProgressTracker
            courseSlug={slug}
            weeks={weeks}
            completedWeeks={progress?.completedWeeks ?? []}
            lastActivityAt={progress?.lastActivityAt}
            verificationStatus={verificationStatus}
          />
        </section>
      )}
    </main>
  );
}
