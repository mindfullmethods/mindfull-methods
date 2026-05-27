"use client";

import { useMemo, useState } from "react";

import CourseCard from "@/components/marketing/CourseCard";
import Button from "@/components/marketing/Button";
import { getCourses } from "@/lib/courses";

type ModeFilter = "All" | "Online" | "Hybrid";

export default function CoursesPage() {
  const courses = getCourses();
  const [mode, setMode] = useState<ModeFilter>("All");

  const filtered = useMemo(() => {
    if (mode === "All") return courses;
    return courses.filter((c) => c.mode === mode);
  }, [courses, mode]);

  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
      <div className="max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-white/60">Courses</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
          Explore our mentorship tracks
        </h1>
        <p className="mt-4 text-sm leading-7 text-white/70">
          Browse programs, filter by delivery format, and open a course to see curriculum and FAQs.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {(["All", "Online", "Hybrid"] as ModeFilter[]).map((m) => {
            const active = mode === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={
                  active
                    ? "rounded-xl bg-white px-4 py-2 text-sm font-black text-zinc-950"
                    : "rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-black text-white/70 transition hover:bg-white/10"
                }
              >
                {m}
              </button>
            );
          })}

          <div className="ml-auto text-sm font-bold text-white/60">
            {filtered.length} result{filtered.length === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      <div className="mt-12 rounded-[2rem] border border-white/10 bg-zinc-950 p-5 text-white sm:p-8">
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
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
            <p className="text-sm font-bold text-white/80">No courses match that filter.</p>
            <p className="mt-3 text-sm text-white/60">Try another delivery mode.</p>
            <div className="mt-6 flex justify-center">
              <Button href="/contact" variant="secondary" size="md">
                Talk to us
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}

