"use client";

import Link from "next/link";
import Image from "next/image";

import type { LmsCourse } from "@/lib/lms/types";

function formatInr(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
    value
  );
}

export default function LmsCourseCard({ course }: { course: LmsCourse }) {
  const learnHref = course.enrolled ? `/dashboard/lms/learn/${course.slug}` : `/dashboard/courses/${course.slug}`;

  return (
    <article className="lms-card flex flex-col gap-4">
      {course.thumbnail ? (
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
          <Image src={course.thumbnail} alt="" fill className="object-cover" sizes="400px" />
        </div>
      ) : (
        <div className="lms-video-stage text-lg font-black">{course.title}</div>
      )}
      <div>
        <span className="lms-badge">
          {course.level} · {course.duration}
        </span>
        <h3 className="mt-2 text-lg font-black text-zinc-900 dark:text-white">{course.title}</h3>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">{course.description}</p>
      </div>
      <div className="lms-progress" aria-label={`${course.progressPercent}% progress`}>
        <span style={{ width: `${course.progressPercent}%` }} />
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href={learnHref} className="lms-primary text-sm">
          {course.enrolled ? "Resume" : "View course"}
        </Link>
        {!course.enrolled ? (
          <Link href={`/courses/${course.slug}`} className="lms-ghost text-sm">
            {formatInr(course.priceInr)} · Enroll
          </Link>
        ) : null}
      </div>
    </article>
  );
}
