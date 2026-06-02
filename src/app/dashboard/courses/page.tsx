import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap } from "lucide-react";

import SectionHeader from "@/components/marketing/SectionHeader";
import DashboardCourseCard from "@/components/components/dashboard/DashboardCourseCard";
import DashboardPageHeader from "@/components/components/dashboard/DashboardPageHeader";
import { getMyEnrollments } from "@/Services/enrollments";
import { requireUser } from "@/lib/auth";
import { getCoursesWithOverrides } from "@/lib/platform-content";
import { isEnrollmentsTableReady } from "@/lib/enrollments-schema";

export default async function DashboardCoursesPage() {
  await requireUser("/dashboard/courses");

  const allCourses = await getCoursesWithOverrides();
  const courses = allCourses;
  const featured = allCourses.filter((c) => c.featured);
  const tableReady = await isEnrollmentsTableReady();
  const enrollments = tableReady ? await getMyEnrollments() : [];
  const enrolledSlugs = new Set(enrollments.map((e) => e.course_slug));

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <DashboardPageHeader
        variant="hero"
        eyebrow="Mentorship programs"
        title="Browse courses and enroll without leaving your workspace."
        description="Same programs shown on the landing page — compare tracks, review syllabi, and pay to enroll directly from the dashboard."
      >
        <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white px-6 py-4 text-zinc-950">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Available</p>
              <p className="mt-1 text-4xl font-bold">{courses.length}</p>
            </div>
            <div className="rounded-2xl bg-violet-600 px-6 py-4 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">Your enrollments</p>
              <p className="mt-1 text-4xl font-bold">{enrollments.length}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/my-courses"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-zinc-950 transition hover:scale-[1.02]"
            >
              <GraduationCap size={16} />
              My courses
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15"
            >
              Public catalog
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </DashboardPageHeader>

      {featured.length > 0 ? (
        <section className="mt-8">
          <SectionHeader
            eyebrow="Featured on homepage"
            title="Programs you can finish with proof"
          />
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
        <SectionHeader eyebrow="Full catalog" title="All mentorship courses" />
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
