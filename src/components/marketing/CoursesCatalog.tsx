"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import CourseCard from "@/components/marketing/CourseCard";
import Button from "@/components/marketing/Button";
import MarketingPageHero from "@/components/marketing/MarketingPageHero";
import type { Course } from "@/lib/courses";

type ModeFilter = "All" | "Online" | "Hybrid";
type LevelFilter = "All" | string;

export default function CoursesCatalog({ courses }: { courses: Course[] }) {
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
    <>
      <MarketingPageHero
        eyebrow="Courses"
        title="Explore our mentorship tracks"
        description="Browse programs, filter by delivery format, and open a course to see curriculum and FAQs."
      >
        <div className="relative mt-8 max-w-2xl">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-white/40"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses, skills, or tags…"
            className="mm-input w-full rounded-2xl py-3 pl-11 pr-4"
            aria-label="Search courses"
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2.5">
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

        <div className="mt-3 flex flex-wrap items-center gap-2.5">
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

          <div className="ml-auto text-sm font-semibold mm-subtle">
            {filtered.length} result{filtered.length === 1 ? "" : "s"}
          </div>
        </div>
      </MarketingPageHero>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="mm-card-premium rounded-3xl p-5 sm:p-8">
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
            <div className="mt-10 rounded-2xl border border-dashed mm-border bg-zinc-50/80 p-8 text-center dark:bg-white/[0.02]">
              <p className="text-sm font-semibold mm-heading">No courses match your filters.</p>
              <p className="mt-2 text-sm mm-muted">Try another search term or delivery mode.</p>
              <div className="mt-6 flex justify-center">
                <Button href="/contact" variant="secondary" size="md">
                  Talk to us
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
