import Link from "next/link";
import { ArrowRight, BookOpen, BriefcaseBusiness, ClipboardList, GraduationCap, TrendingUp } from "lucide-react";

import SectionHeader from "@/components/marketing/SectionHeader";
import AnalyticsChart from "@/components/components/dashboard/AnalyticsChart";
import DashboardCourseCard from "@/components/components/dashboard/DashboardCourseCard";
import DashboardOverviewHero from "@/components/components/dashboard/DashboardOverviewHero";
import DashboardOnboardingChecklist from "@/components/components/dashboard/DashboardOnboardingChecklist";
import InternshipList from "@/components/components/dashboard/InternshipList";
import ResumeLearningBanner, { findResumeCourse } from "@/components/components/dashboard/ResumeLearningBanner";
import { getInternships } from "@/Services/Internships";
import { getMyApplications } from "@/Services/applications";
import { getStudentApplicationChart, getOverallCourseProgressPercent } from "@/Services/admin-analytics";
import { getProgressSummariesForSlugs } from "@/Services/course-progress";
import { getMyEnrollments } from "@/Services/enrollments";
import { getSessionUser, isAdminUser } from "@/lib/auth";
import { getCoursesWithOverrides } from "@/lib/platform-content";
import { isCourseProgressTableReady } from "@/lib/course-progress-schema";
import { hasSyllabusPdf, syllabusPdfPublicUrl } from "@/lib/syllabus-files";

export default async function DashboardPage() {
  const user = await getSessionUser();
  const isAdmin = isAdminUser(user);
  const internships = await getInternships();
  const featuredCourses = (await getCoursesWithOverrides()).filter((c) => c.featured);
  const [applications, enrollments, applicationChart] = await Promise.all([
    getMyApplications(),
    getMyEnrollments(),
    user ? getStudentApplicationChart(user.id) : Promise.resolve([]),
  ]);
  const enrolledSlugs = new Set(enrollments.map((e) => e.course_slug));

  const progressReady = await isCourseProgressTableReady();
  const progressMap =
    progressReady && enrollments.length > 0
      ? await getProgressSummariesForSlugs(enrollments.map((e) => e.course_slug))
      : new Map();

  const overallProgress = getOverallCourseProgressPercent([...progressMap.values()]);
  const resumeCourse =
    progressReady && enrollments.length > 0 ? findResumeCourse(enrollments, progressMap) : null;

  const profileName =
    (user?.user_metadata?.full_name as string | undefined) ??
    (user?.user_metadata?.name as string | undefined) ??
    "";

  const firstEnrollment = enrollments[0];
  const firstProgress = firstEnrollment ? progressMap.get(firstEnrollment.course_slug) : undefined;
  const onboardingSteps = firstEnrollment
    ? [
        {
          id: "profile",
          label: "Set your display name in Settings",
          href: "/dashboard/settings",
          done: profileName.trim().length > 1,
        },
        {
          id: "week1",
          label: `Start week 1 — ${firstEnrollment.course?.title ?? firstEnrollment.course_title}`,
          href: `/dashboard/my-courses/${firstEnrollment.course_slug}`,
          done: (firstProgress?.completedWeeks.length ?? 0) > 0,
        },
        {
          id: "syllabus",
          label: "Download your course syllabus",
          href: hasSyllabusPdf(firstEnrollment.course_slug)
            ? syllabusPdfPublicUrl(firstEnrollment.course_slug)
            : `/courses/${firstEnrollment.course_slug}/syllabus`,
          done: false,
        },
      ]
    : [];

  const metrics = [
    {
      label: "Browse courses",
      value: featuredCourses.length,
      helper: "Featured mentorship programs",
      icon: BookOpen,
      href: "/dashboard/courses",
    },
    {
      label: "My courses",
      value: enrollments.length,
      helper: enrollments.length ? `${overallProgress}% avg progress` : "Paid enrollments",
      icon: GraduationCap,
      href: "/dashboard/my-courses",
    },
    {
      label: "My applications",
      value: applications.length,
      helper: "Internship submissions",
      icon: ClipboardList,
      href: "/dashboard/my-applications",
    },
    {
      label: "Open internships",
      value: internships.length,
      helper: "Published opportunities",
      icon: BriefcaseBusiness,
      href: "/dashboard/internships",
    },
  ];

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <DashboardOverviewHero isAdmin={isAdmin} firstName={profileName} />

      {resumeCourse ? <ResumeLearningBanner course={resumeCourse} /> : null}

      {enrollments.length > 0 ? <DashboardOnboardingChecklist steps={onboardingSteps} /> : null}

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <Link key={metric.label} href={metric.href} className="mm-metric-glow group block p-5">
              <div className="relative flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] mm-subtle">{metric.label}</p>
                  <h2 className="mt-3 text-4xl font-bold mm-heading">{metric.value}</h2>
                </div>
                <div className="mm-icon-well transition group-hover:scale-105">
                  <Icon size={21} />
                </div>
              </div>
              <p className="relative mt-4 text-sm font-semibold text-zinc-500">{metric.helper}</p>
            </Link>
          );
        })}
      </section>

      {enrollments.length > 0 && progressReady ? (
        <section className="mm-section-panel mt-8">
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <SectionHeader eyebrow="Learning progress" title="Your course milestones" />
            <span className="rounded-xl bg-gradient-to-r from-violet-600/15 to-teal-400/15 px-4 py-2 text-sm font-bold text-violet-800 ring-1 ring-violet-300/40 dark:text-violet-200 dark:ring-violet-400/25">
              {overallProgress}% overall
            </span>
          </div>
          <div className="relative mt-6 grid gap-4 md:grid-cols-2">
            {enrollments.map((enrollment) => {
              const progress = progressMap.get(enrollment.course_slug);
              const percent = progress?.percent ?? 0;

              return (
                <Link
                  key={enrollment.id}
                  href={`/dashboard/my-courses/${enrollment.course_slug}`}
                  className="rounded-2xl border border-zinc-200/80 bg-white/50 p-4 transition hover:border-violet-300/60 hover:shadow-md dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-violet-400/30"
                >
                  <p className="font-bold mm-heading">{enrollment.course?.title ?? enrollment.course_title}</p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                    <div className="mm-progress-glow" style={{ width: `${percent}%` }} />
                  </div>
                  <p className="mt-2 text-xs font-bold text-zinc-500">
                    {progress?.completedWeeks.length ?? 0} of {progress?.totalWeeks ?? 0} weeks · {percent}%
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="mm-section-panel mt-8">
        <div className="relative mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <SectionHeader
          eyebrow="Featured courses"
          title="Same programs from the landing page"
          description="Browse, compare, and enroll in mentorship tracks without leaving the dashboard."
          className="relative mb-6 flex-1"
        />
          <Link href="/dashboard/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-violet-300">
            View all courses
            <ArrowRight size={17} />
          </Link>
        </div>
        <div className="relative grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredCourses.map((course) => (
            <DashboardCourseCard key={course.slug} course={course} enrolled={enrolledSlugs.has(course.slug)} />
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="mm-section-panel">
          <div className="relative mb-6 flex items-center justify-between gap-4">
            <SectionHeader
              eyebrow="Analytics"
              title={isAdmin ? "Your activity" : "Applications — last 7 days"}
            />
            <TrendingUp className="text-emerald-500" />
          </div>
          <AnalyticsChart data={applicationChart} emptyLabel="No applications in the last 7 days" />
          {isAdmin ? (
            <Link href="/dashboard/analytics" className="relative mt-4 inline-flex text-sm font-semibold text-violet-600 hover:underline dark:text-violet-300">
              View full platform analytics →
            </Link>
          ) : null}
        </div>

        <div className="mm-section-panel">
          <div className="relative flex items-center justify-between gap-4">
            <SectionHeader eyebrow="Recent activity" title="Latest applications" />
            <span className="rounded-xl bg-gradient-to-br from-violet-600 to-violet-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/25">
              {applications.length}
            </span>
          </div>

          <div className="relative mt-6 space-y-3">
            {applications.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-zinc-300 p-6 text-sm font-semibold leading-6 text-zinc-500 dark:border-white/10">
                No application activity yet. Submitted applications will show here.
              </p>
            ) : (
              applications.slice(0, 5).map((application, index: number) => (
                <div
                  key={application.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-200/60 bg-white/50 p-4 dark:border-white/10 dark:bg-white/[0.02]"
                >
                  <div>
                    <p className="font-bold mm-heading">Application #{index + 1}</p>
                    <p className="mt-1 text-sm text-zinc-500">{application.email || "Student application submitted"}</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                    {application.status || "Pending"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="mm-section-panel mt-8">
        <div className="relative mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <SectionHeader eyebrow="Featured internships" title="Explore active opportunities" className="relative mb-6 flex-1" />
          <Link href="/dashboard/internships" className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-violet-300">
            View catalog
            <ArrowRight size={17} />
          </Link>
        </div>
        <InternshipList internships={internships} />
      </section>
    </main>
  );
}
