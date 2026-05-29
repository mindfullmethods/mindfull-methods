"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock3, Sparkles } from "lucide-react";

import type { Course } from "@/lib/courses";

export default function DashboardCourseCard({
  course,
  enrolled = false,
}: {
  course: Course;
  enrolled?: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      whileHover={{ y: -6 }}
      className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-2xl dark:border-white/10 dark:bg-white/5"
    >
      <Link href={`/dashboard/courses/${course.slug}`} className="block">
        <div className="relative h-52 overflow-hidden">
          <img
            src={course.imageUrl}
            alt={course.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/75 via-zinc-950/10 to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {course.featured ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-600 px-3 py-1.5 text-xs font-black text-white">
                <Sparkles size={12} />
                Featured
              </span>
            ) : null}
            {enrolled ? (
              <span className="rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-black text-white">Enrolled</span>
            ) : null}
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-black text-zinc-950 backdrop-blur">
              <Clock3 size={14} />
              {course.duration}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-zinc-950/75 px-3 py-2 text-xs font-black text-white backdrop-blur">
              {course.mode}
            </span>
          </div>
        </div>
      </Link>

      <div className="p-6">
        <p className="flex items-center gap-2 text-sm font-bold text-violet-600 dark:text-violet-300">
          <BookOpen size={16} />
          {course.level}
        </p>
        <h3 className="mt-3 text-2xl font-black tracking-tight">{course.title}</h3>
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {course.shortDescription}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {course.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-600 dark:bg-white/10 dark:text-zinc-300"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <p className="text-sm font-black text-zinc-700 dark:text-zinc-200">{course.priceLabel}</p>
          <Link
            href={`/dashboard/courses/${course.slug}`}
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-3 text-sm font-black text-white transition hover:scale-[1.02] dark:bg-white dark:text-zinc-950"
          >
            {enrolled ? "Continue" : "View course"}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
