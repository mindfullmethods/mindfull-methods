import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap } from "lucide-react";

import DashboardCourseCard from "@/components/components/dashboard/DashboardCourseCard";
import { getMyEnrollments } from "@/Services/enrollments";
import { requireUser } from "@/lib/auth";
import { getCourses, getFeaturedCourses } from "@/lib/courses";
import { isEnrollmentsTableReady } from "@/lib/enrollments-schema";

export default async function DashboardCoursesPage() {
  await requireUser("/dashboard/courses");

  const courses = getCourses();
  const featured = getFeaturedCourses();
  const tableReady = await isEnrollmentsTableReady();
  const enrollments = tableReady ? await getMyEnrollments() : [];
  const enrolledSlugs = new Set(enrollments.map((e) => e.course_slug));

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <section className="rounded-3xl bg-zinc-950 p-6 text-white shadow-xl sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-white/50">Mentorship programs</p>
        <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
              Browse courses and enroll without leaving your workspace.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              Same programs shown on the landing page — compare tracks, review syllabi, and pay to enroll directly
              from the dashboard.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white px-6 py-4 text-zinc-950">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Available</p>
              <p className="mt-1 text-4xl font-black">{courses.length}</p>
            </div>
            <div className="rounded-2xl bg-violet-600 px-6 py-4 text-white">
              <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80">Your enrollments</p>
              <p className="mt-1 text-4xl font-black">{enrollments.length}</p>
            </div>
          </div>
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/dashboard/my-courses"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-zinc-950 transition hover:scale-[1.02]"
          >
            <GraduationCap size={16} />
            My courses
          </Link>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/15"
          >
            Public catalog
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {featured.length > 0 ? (
        <section className="mt-8">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-violet-600 dark:text-violet-300">
                <BookOpen size={14} />
                Featured on homepage
              </p>
              <h2 className="mt-2 text-3xl font-black">Programs you can finish with proof</h2>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((course) => (
              <DashboardCourseCard
                key={course.slug}
                course={course}
                enrolled={enrolledSlugs.has(course.slug)}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-10">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Full catalog</p>
            <h2 className="mt-2 text-3xl font-black">All mentorship courses</h2>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <DashboardCourseCard
              key={course.slug}
              course={course}
              enrolled={enrolledSlugs.has(course.slug)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
