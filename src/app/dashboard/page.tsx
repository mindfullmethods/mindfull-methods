import Link from "next/link";
import { ArrowRight, BookOpen, BriefcaseBusiness, ClipboardList, GraduationCap, Sparkles, TrendingUp } from "lucide-react";
import AnalyticsChart from "@/components/components/dashboard/AnalyticsChart";
import DashboardCourseCard from "@/components/components/dashboard/DashboardCourseCard";
import InternshipList from "@/components/components/dashboard/InternshipList";
import ResumeLearningBanner, { findResumeCourse } from "@/components/components/dashboard/ResumeLearningBanner";
import { getInternships } from "@/Services/Internships";
import { getMyApplications } from "@/Services/applications";
import { getStudentApplicationChart, getOverallCourseProgressPercent } from "@/Services/admin-analytics";
import { getProgressSummariesForSlugs } from "@/Services/course-progress";
import { getMyEnrollments } from "@/Services/enrollments";
import { getSessionUser, isAdminUser } from "@/lib/auth";
import { getFeaturedCourses } from "@/lib/courses";
import { isCourseProgressTableReady } from "@/lib/course-progress-schema";
import { marketingImages } from "@/lib/images";

export default async function DashboardPage() {
  const user = await getSessionUser();
  const isAdmin = isAdminUser(user);
  const internships = await getInternships();
  const featuredCourses = getFeaturedCourses();
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
      <section className="rounded-3xl bg-zinc-950 p-6 text-white shadow-xl sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold">
              <Sparkles size={16} />
              Mindfull Methods workspace
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
              Manage courses, internships, and applications from one place.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              Browse mentorship programs, track enrolled courses, apply to internships, and manage everything from one workspace.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/dashboard/courses"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-4 text-sm font-black text-zinc-950 transition hover:scale-[1.02]"
              >
                Browse courses
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/dashboard/internships"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-4 text-sm font-black text-white transition hover:bg-white/15"
              >
                Browse internships
              </Link>
              <Link
                href="/dashboard/my-courses"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-4 text-sm font-black text-white transition hover:bg-white/15"
              >
                My courses
              </Link>
              {isAdmin ? (
                <Link
                  href="/dashboard/admin-home"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-400/30 bg-violet-500/20 px-5 py-4 text-sm font-black text-white transition hover:bg-violet-500/30"
                >
                  Admin home
                </Link>
              ) : null}
              {isAdmin ? (
                <Link
                  href="/dashboard/analytics"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-400/30 bg-violet-500/20 px-5 py-4 text-sm font-black text-white transition hover:bg-violet-500/30"
                >
                  Analytics
                </Link>
              ) : null}
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-2 shadow-2xl">
            <img
              src={marketingImages.dashboardPreview}
              alt="Mindfull Methods dashboard preview"
              className="aspect-[16/10] w-full rounded-xl object-cover object-left-top"
            />
          </div>
        </div>
      </section>

      {resumeCourse ? <ResumeLearningBanner course={resumeCourse} /> : null}

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <Link
              key={metric.label}
              href={metric.href}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">{metric.label}</p>
                  <h2 className="mt-3 text-4xl font-black">{metric.value}</h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                  <Icon size={21} />
                </div>
              </div>
              <p className="mt-4 text-sm font-semibold text-zinc-500">{metric.helper}</p>
            </Link>
          );
        })}
      </section>

      {enrollments.length > 0 && progressReady ? (
        <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Learning progress</p>
              <h2 className="mt-2 text-2xl font-black">Your course milestones</h2>
            </div>
            <span className="rounded-xl bg-violet-100 px-4 py-2 text-sm font-black text-violet-800 dark:bg-violet-400/10 dark:text-violet-200">
              {overallProgress}% overall
            </span>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {enrollments.map((enrollment) => {
              const progress = progressMap.get(enrollment.course_slug);
              const percent = progress?.percent ?? 0;

              return (
                <Link
                  key={enrollment.id}
                  href={`/dashboard/my-courses/${enrollment.course_slug}`}
                  className="rounded-2xl border border-zinc-200 p-4 transition hover:border-violet-300 dark:border-white/10 dark:hover:border-violet-400/30"
                >
                  <p className="font-black">{enrollment.course?.title ?? enrollment.course_title}</p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-teal-400"
                      style={{ width: `${percent}%` }}
                    />
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

      <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Featured courses</p>
            <h2 className="mt-2 text-3xl font-black">Same programs from the landing page</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
              Browse, compare, and enroll in mentorship tracks without leaving the dashboard.
            </p>
          </div>
          <Link href="/dashboard/courses" className="inline-flex items-center gap-2 text-sm font-black">
            View all courses
            <ArrowRight size={17} />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredCourses.map((course) => (
            <DashboardCourseCard
              key={course.slug}
              course={course}
              enrolled={enrolledSlugs.has(course.slug)}
            />
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Analytics</p>
              <h2 className="mt-2 text-2xl font-black">
                {isAdmin ? "Your activity" : "Applications — last 7 days"}
              </h2>
            </div>
            <TrendingUp className="text-emerald-600" />
          </div>
          <AnalyticsChart data={applicationChart} emptyLabel="No applications in the last 7 days" />
          {isAdmin ? (
            <Link href="/dashboard/analytics" className="mt-4 inline-flex text-sm font-black text-violet-600 hover:underline">
              View full platform analytics →
            </Link>
          ) : null}
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Recent activity</p>
              <h2 className="mt-2 text-2xl font-black">Latest applications</h2>
            </div>
            <span className="rounded-xl bg-zinc-950 px-4 py-3 text-sm font-black text-white dark:bg-white dark:text-zinc-950">
              {applications.length}
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {applications.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-zinc-300 p-6 text-sm font-semibold leading-6 text-zinc-500 dark:border-white/10">
                No application activity yet. Submitted applications will show here.
              </p>
            ) : (
              applications.slice(0, 5).map((application, index: number) => (
                <div
                  key={application.id}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-[#f7f8f5] p-4 dark:bg-zinc-950"
                >
                  <div>
                    <p className="font-black">Application #{index + 1}</p>
                    <p className="mt-1 text-sm text-zinc-500">{application.email || "Student application submitted"}</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                    {application.status || "Pending"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Featured internships</p>
            <h2 className="mt-2 text-3xl font-black">Explore active opportunities</h2>
          </div>
          <Link href="/dashboard/internships" className="inline-flex items-center gap-2 text-sm font-black">
            View catalog
            <ArrowRight size={17} />
          </Link>
        </div>
        <InternshipList internships={internships} />
      </section>
    </main>
  );
}
