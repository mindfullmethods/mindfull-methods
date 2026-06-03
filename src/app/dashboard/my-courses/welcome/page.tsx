import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BookOpen, CheckCircle2, Download, Sparkles } from "lucide-react";

import Button from "@/components/marketing/Button";
import DashboardPageHeader from "@/components/components/dashboard/DashboardPageHeader";
import { getMyEnrollments } from "@/Services/enrollments";
import { requireUser } from "@/lib/auth";
import { getCourseBySlug } from "@/lib/courses";
import { getWeekResources } from "@/lib/course-resources";
import { hasSyllabusPdf, syllabusPdfPublicUrl } from "@/lib/syllabus-files";
import { syllabusPrintUrl, syllabusUrl } from "@/lib/site";

export default async function EnrollmentWelcomePage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  await requireUser("/dashboard/my-courses");
  const { course: courseSlug } = await searchParams;

  if (!courseSlug) {
    redirect("/dashboard/my-courses");
  }

  const course = getCourseBySlug(courseSlug);
  if (!course) {
    redirect("/dashboard/my-courses");
  }

  const enrollments = await getMyEnrollments();
  const enrolled = enrollments.some((e) => e.course_slug === courseSlug);

  if (!enrolled) {
    redirect("/dashboard/my-courses");
  }

  const firstWeek = course.curriculum[0];
  const weekResources = firstWeek ? getWeekResources(courseSlug, 0, firstWeek.week) : [];

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-teal-500 p-6 text-white shadow-xl sm:p-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">
          <Sparkles size={16} />
          Payment confirmed
        </div>
        <h1 className="mt-6 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">Welcome to {course.title}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/85 sm:text-base">
          You&apos;re enrolled. Track weekly milestones, use mentor resources, and earn your certificate when you finish
          all {course.curriculum.length} weeks.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/dashboard/my-courses/${courseSlug}`}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-bold text-violet-700 transition hover:scale-[1.02]"
          >
            Start week 1
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/dashboard/my-courses"
            className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/15"
          >
            All my courses
          </Link>
        </div>
      </section>

      <div className="mt-8">
        <DashboardPageHeader
          eyebrow="Getting started"
          title="Your first week"
          description="Skim the syllabus, open week 1 resources, and mark milestones as you go."
        />
      </div>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="mm-section-panel">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">
            <BookOpen size={14} />
            Your first milestone
          </p>
          {firstWeek ? (
            <>
              <h2 className="mt-3 text-2xl font-bold mm-heading">{firstWeek.week}</h2>
              <ul className="mt-4 space-y-2">
                {firstWeek.topics.map((topic) => (
                  <li key={topic} className="flex items-start gap-2 text-sm font-semibold mm-muted">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                    {topic}
                  </li>
                ))}
              </ul>
              {weekResources.length > 0 ? (
                <div className="mt-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] mm-subtle">Week 1 resources</p>
                  <ul className="mt-2 space-y-2">
                    {weekResources.map((resource) => (
                      <li key={resource.url}>
                        <a
                          href={resource.url}
                          target={resource.url.startsWith("http") ? "_blank" : undefined}
                          rel={resource.url.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="text-sm font-bold text-violet-600 hover:underline dark:text-violet-300"
                        >
                          {resource.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          ) : null}
        </div>

        <div className="mm-section-panel">
          <p className="text-xs font-bold uppercase tracking-[0.18em] mm-subtle">Before you begin</p>
          <h2 className="mt-3 text-2xl font-bold mm-heading">Set up for success</h2>
          <ul className="mt-5 space-y-4">
            {[
              "Open Settings and set your display name — it appears on your certificate.",
              "Download the syllabus and skim week 1 topics.",
              "Check off each week on the progress page as you complete milestones.",
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-3 text-sm leading-6 mm-muted">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                {tip}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/dashboard/settings"
              className="rounded-xl border mm-border px-4 py-2.5 text-sm font-bold mm-heading"
            >
              Profile settings
            </Link>
            {hasSyllabusPdf(courseSlug) ? (
              <a
                href={syllabusPdfPublicUrl(courseSlug)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-bold text-white dark:bg-white dark:text-zinc-950"
              >
                <Download size={14} />
                Syllabus PDF
              </a>
            ) : (
              <a
                href={syllabusPrintUrl(courseSlug)}
                className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-bold text-white dark:bg-white dark:text-zinc-950"
              >
                View syllabus
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-dashed mm-border bg-[#f7f8f5] p-6 text-center dark:bg-zinc-950 sm:p-8">
        <p className="text-sm font-semibold mm-muted">
          Questions before week 1?{" "}
          <Button href={`/contact?interest=${courseSlug}`} variant="secondary" size="md">
            Book a call
          </Button>
        </p>
        <p className="mt-3">
          <a href={syllabusUrl(courseSlug)} download className="text-xs font-bold mm-subtle hover:underline">
            Download syllabus (.txt)
          </a>
        </p>
      </section>
    </main>
  );
}
