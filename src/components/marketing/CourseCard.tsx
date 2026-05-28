import Link from "next/link";
import * as React from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import Badge from "@/components/marketing/Badge";

export type CourseCardModel = {
  slug: string;
  title: string;
  shortDescription: string;
  level: string;
  duration: string;
  mode: string;
  tags: string[];
  priceLabel?: string;
  imageUrl?: string;
};

export default function CourseCard({
  className,
  course,
}: {
  className?: string;
  course: CourseCardModel;
}) {
  return (
    <article
      className={cn(
        "group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-sm backdrop-blur-sm transition duration-300 hover:-translate-y-1.5 hover:border-violet-400/30 hover:bg-white/[0.07] hover:shadow-xl hover:shadow-violet-950/20",
        className
      )}
    >
      <div className="relative">
        {course.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.imageUrl}
            alt={course.title}
            className="h-52 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="h-52 w-full bg-zinc-800/40" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-zinc-950/80 to-transparent" />
        <div className="absolute left-4 top-4">
          <Badge tone="neutral">{course.mode}</Badge>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-wrap gap-2">
          <Badge tone="violet">{course.level}</Badge>
          {course.duration ? <Badge tone="neutral">{course.duration}</Badge> : null}
        </div>

        <h3 className="mt-4 text-2xl font-black tracking-tight">{course.title}</h3>
        <p className="mt-3 text-sm leading-6 text-white/70">{course.shortDescription}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {course.tags.slice(0, 3).map((t) => (
            <span key={t} className="rounded-full bg-white/5 px-3 py-1 text-xs font-bold text-white/70">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          {course.priceLabel ? (
            <p className="text-sm font-bold text-white/80">{course.priceLabel}</p>
          ) : (
            <p className="text-sm font-bold text-white/60">Cohort-based</p>
          )}

          <Link
            href={`/courses/${course.slug}`}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-black text-zinc-950 transition hover:scale-[1.02]"
          >
            View details <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}

