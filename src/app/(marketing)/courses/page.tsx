"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import CourseCard from "@/components/marketing/CourseCard";
import Button from "@/components/marketing/Button";
import { getCourses } from "@/lib/courses";

type ModeFilter = "All" | "Online" | "Hybrid";
type LevelFilter = "All" | string;

export default function CoursesPage() {
  const courses = getCourses();
  const [mode, setMode] = useState<ModeFilter>("All");
  const [level, setLevel] = useState<LevelFilter>("All");
  const [query, setQuery] = useState("");

  const levels = useMemo(() => {
    return ["All", ...new Set(courses.map((c) => c.level))];
  }, [courses]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return courses.filter((c) => {
      const modeMatch = mode === "All" || c.mode === mode;
      const levelMatch = level === "All" || c.level === level;
      const searchMatch =
        !normalizedQuery ||
        c.title.toLowerCase().includes(normalizedQuery) ||
        c.shortDescription.toLowerCase().includes(normalizedQuery) ||
        c.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

      return modeMatch && levelMatch && searchMatch;
    });
  }, [courses, mode, level, query]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
      <div className="max-w-3xl">
        <p className="mm-eyebrow">Courses</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight mm-heading sm:text-5xl">
          Explore our mentorship tracks
        </h1>
        <p className="mt-4 text-sm leading-7 mm-muted">
          Browse programs, filter by delivery format, and open a course to see curriculum and FAQs.
        </p>

        <div className="relative mt-8">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-white/40"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses, skills, or tags…"
            className="w-full rounded-2xl border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm font-bold text-zinc-950 placeholder:text-zinc-400 outline-none ring-violet-400/40 transition focus:border-violet-400/40 focus:ring-2 dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40"
            aria-label="Search courses"
          />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {(["All", "Online", "Hybrid"] as ModeFilter[]).map((m) => {
            const active = mode === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={active ? "mm-filter-active" : "mm-filter"}
              >
                {m}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {levels.map((l) => {
            const active = level === l;
            return (
              <button
                key={l}
                type="button"
                onClick={() => setLevel(l)}
                className={active ? "mm-filter-violet-active" : "mm-filter"}
              >
                {l}
              </button>
            );
          })}

          <div className="ml-auto text-sm font-bold text-zinc-500 dark:text-white/60">
            {filtered.length} result{filtered.length === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      <div className="mt-12 mm-card p-5 sm:p-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <CourseCard
              key={c.slug}
              course={{
                slug: c.slug,
                title: c.title,
                shortDescription: c.shortDescription,
                level: c.level,
                duration: c.duration,
                mode: c.mode,
                tags: c.tags,
                priceLabel: c.priceLabel,
                imageUrl: c.imageUrl,
              }}
            />
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10 mm-card-muted p-6 text-center">
            <p className="text-sm font-bold text-zinc-800 dark:text-white/80">No courses match your filters.</p>
            <p className="mt-3 text-sm text-zinc-500 dark:text-white/60">Try another search term or delivery mode.</p>
            <div className="mt-6 flex justify-center">
              <Button href="/contact" variant="secondary" size="md">
                Talk to us
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
