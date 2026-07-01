import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import CourseCardImage from "@/components/marketing/CourseCardImage";
import type { Course } from "@/lib/courses";

export default function HomeCourseShowcase({ courses }: { courses: Course[] }) {
  return (
    <section className="mm-landing-section px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="mm-landing-tag">Our AI courses</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Career tracks you can <span className="text-violet-300">finish with proof</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/50">
            Four focused cohorts—each with weekly milestones, mentor review, and a portfolio-ready capstone.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {courses.map((course) => (
            <article
              key={course.slug}
              className="mm-landing-glass group flex flex-col overflow-hidden rounded-2xl"
            >
              <div className="relative h-48 overflow-hidden">
                <CourseCardImage
                  src={course.imageUrl}
                  slug={course.slug}
                  alt={course.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-violet-400/30 bg-violet-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-violet-100 backdrop-blur-sm">
                      {course.level}
                    </span>
                    <span className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[10px] font-semibold text-white/80 backdrop-blur-sm">
                      {course.duration}
                    </span>
                  </div>
                  <h3 className="mt-2 text-xl font-bold text-white">{course.title}</h3>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <ul className="space-y-2.5">
                  {course.learnOutcomes.slice(0, 4).map((o) => (
                    <li key={o} className="flex items-start gap-2.5 text-sm text-white/60">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                      {o}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <p className="text-sm font-bold text-white/80">{course.priceLabel}</p>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/40 bg-violet-500/10 px-4 py-2 text-xs font-semibold text-violet-100 transition hover:bg-violet-500/20"
                  >
                    View details <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
