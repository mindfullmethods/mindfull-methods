"use client";

import { useState, useTransition } from "react";
import { BookOpen, FileText, Plus, Trash2 } from "lucide-react";

import {
  createBlogPost,
  deleteBlogPost,
  hideCourse,
  saveBlogPostOverride,
  saveCourseOverrides,
  saveCustomCourse,
  saveFullCourseOverride,
} from "@/actions/adminContent";
import type { BlogPost } from "@/lib/blog-posts";
import type { Course } from "@/lib/courses";
import type { CourseOverride, CustomCourse } from "@/lib/platform-content";

const inputClass =
  "mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-zinc-950";
const labelClass = "text-xs font-bold text-zinc-500";

export default function AdminContentPanel({
  courses,
  customCourses,
  courseOverrides,
  blogPosts,
  tableReady,
}: {
  courses: Course[];
  customCourses: CustomCourse[];
  courseOverrides: Record<string, CourseOverride>;
  blogPosts: BlogPost[];
  tableReady: boolean;
}) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState<"spotlight" | "courses" | "blog" | "new-course" | "new-blog">("spotlight");
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.slug ?? customCourses[0]?.slug ?? "");
  const [selectedPost, setSelectedPost] = useState(blogPosts[0]?.slug ?? "");

  const allCourses = [...courses, ...customCourses.filter((c) => !courses.some((s) => s.slug === c.slug))];
  const course = allCourses.find((c) => c.slug === selectedCourse) ?? allCourses[0];
  const patch = course ? (courseOverrides[course.slug] ?? {}) : {};
  const mergedCourse = course ? { ...course, ...patch, featured: patch.featured ?? course.featured } : null;
  const post = blogPosts.find((p) => p.slug === selectedPost) ?? blogPosts[0];

  function run(action: () => Promise<{ ok: boolean; error?: string; slug?: string }>, success: string) {
    setMessage("");
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        setMessage(result.error ?? "Save failed.");
        return;
      }
      setMessage(result.slug ? `${success} (${result.slug})` : success);
    });
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["spotlight", "Spotlight"],
            ["courses", "Full course editor"],
            ["new-course", "New course"],
            ["blog", "Blog posts"],
            ["new-blog", "New blog post"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded-xl px-4 py-2 text-sm font-black ${
              tab === id ? "bg-violet-600 text-white" : "border border-zinc-200 dark:border-white/10"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "spotlight" ? (
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-violet-600">
            <BookOpen size={14} />
            Course spotlight
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(() => saveCourseOverrides(new FormData(e.currentTarget)), "Course overrides saved.");
            }}
            className="mt-4 space-y-4"
          >
            {allCourses.map((c) => {
              const p = courseOverrides[c.slug] ?? {};
              return (
                <div key={c.slug} className="rounded-2xl border border-zinc-200 p-4 dark:border-white/10">
                  <p className="font-black">{p.title ?? c.title}</p>
                  <label className="mt-3 block">
                    <span className={labelClass}>Short description</span>
                    <textarea
                      name={`desc_${c.slug}`}
                      defaultValue={p.shortDescription ?? c.shortDescription}
                      rows={2}
                      disabled={!tableReady || isPending}
                      className={inputClass}
                    />
                  </label>
                  <label className="mt-2 block">
                    <span className={labelClass}>Price label</span>
                    <input
                      name={`price_${c.slug}`}
                      defaultValue={p.priceLabel ?? c.priceLabel}
                      disabled={!tableReady || isPending}
                      className={inputClass}
                    />
                  </label>
                  <label className="mt-2 inline-flex items-center gap-2 text-sm font-bold">
                    <input
                      type="checkbox"
                      name={`featured_${c.slug}`}
                      defaultChecked={p.featured ?? c.featured}
                      disabled={!tableReady || isPending}
                    />
                    Featured on homepage
                  </label>
                </div>
              );
            })}
            <button
              type="submit"
              disabled={!tableReady || isPending}
              className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-black text-white disabled:opacity-60 dark:bg-white dark:text-zinc-950"
            >
              {isPending ? "Saving…" : "Save course overrides"}
            </button>
          </form>
        </section>
      ) : null}

      {tab === "courses" && mergedCourse ? (
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">Full course editor</p>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="rounded-xl border border-zinc-200 px-3 py-2 text-sm font-bold dark:border-white/10 dark:bg-zinc-950"
            >
              {allCourses.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
          <form
            key={mergedCourse.slug}
            onSubmit={(e) => {
              e.preventDefault();
              run(() => saveFullCourseOverride(new FormData(e.currentTarget)), "Course saved.");
            }}
            className="mt-4 grid gap-3 sm:grid-cols-2"
          >
            <input type="hidden" name="slug" value={mergedCourse.slug} />
            <label className="block sm:col-span-2">
              <span className={labelClass}>Title</span>
              <input name="title" defaultValue={mergedCourse.title} disabled={!tableReady || isPending} className={inputClass} />
            </label>
            <label className="block sm:col-span-2">
              <span className={labelClass}>Short description</span>
              <textarea name="shortDescription" defaultValue={mergedCourse.shortDescription} rows={2} disabled={!tableReady || isPending} className={inputClass} />
            </label>
            <label className="block sm:col-span-2">
              <span className={labelClass}>Long description</span>
              <textarea name="longDescription" defaultValue={mergedCourse.longDescription} rows={4} disabled={!tableReady || isPending} className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Level</span>
              <input name="level" defaultValue={mergedCourse.level} disabled={!tableReady || isPending} className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Duration</span>
              <input name="duration" defaultValue={mergedCourse.duration} disabled={!tableReady || isPending} className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Price label</span>
              <input name="priceLabel" defaultValue={mergedCourse.priceLabel} disabled={!tableReady || isPending} className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Price (paise)</span>
              <input name="priceInPaise" type="number" defaultValue={mergedCourse.priceInPaise} disabled={!tableReady || isPending} className={inputClass} />
            </label>
            <label className="block sm:col-span-2">
              <span className={labelClass}>Tags (one per line)</span>
              <textarea name="tags" defaultValue={mergedCourse.tags.join("\n")} rows={2} disabled={!tableReady || isPending} className={inputClass} />
            </label>
            <label className="block sm:col-span-2">
              <span className={labelClass}>Learn outcomes (one per line)</span>
              <textarea name="learnOutcomes" defaultValue={mergedCourse.learnOutcomes.join("\n")} rows={4} disabled={!tableReady || isPending} className={inputClass} />
            </label>
            <label className="block sm:col-span-2">
              <span className={labelClass}>Curriculum (JSON array)</span>
              <textarea name="curriculumJson" defaultValue={JSON.stringify(mergedCourse.curriculum, null, 2)} rows={8} disabled={!tableReady || isPending} className={`${inputClass} font-mono text-xs`} />
            </label>
            <label className="block sm:col-span-2">
              <span className={labelClass}>FAQs (JSON array)</span>
              <textarea name="faqsJson" defaultValue={JSON.stringify(mergedCourse.faqs, null, 2)} rows={6} disabled={!tableReady || isPending} className={`${inputClass} font-mono text-xs`} />
            </label>
            <label className="inline-flex items-center gap-2 text-sm font-bold sm:col-span-2">
              <input type="checkbox" name="featured" defaultChecked={mergedCourse.featured} disabled={!tableReady || isPending} />
              Featured on homepage
            </label>
            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button type="submit" disabled={!tableReady || isPending} className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-black text-white disabled:opacity-60">
                {isPending ? "Saving…" : "Save full course"}
              </button>
              <button
                type="button"
                disabled={!tableReady || isPending}
                onClick={() => {
                  if (!window.confirm(`Hide ${mergedCourse.title} from the catalog?`)) return;
                  run(() => hideCourse(mergedCourse.slug), "Course hidden.");
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-black text-red-600 disabled:opacity-60"
              >
                <Trash2 size={14} />
                Hide course
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {tab === "new-course" ? (
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-violet-600">
            <Plus size={14} />
            Create course
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(() => saveCustomCourse(new FormData(e.currentTarget)), "Course created.");
            }}
            className="mt-4 grid gap-3 sm:grid-cols-2"
          >
            <label className="block sm:col-span-2">
              <span className={labelClass}>Title</span>
              <input name="title" required disabled={!tableReady || isPending} className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Slug (optional)</span>
              <input name="slug" placeholder="auto-from-title" disabled={!tableReady || isPending} className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Price (paise)</span>
              <input name="priceInPaise" type="number" defaultValue={999900} disabled={!tableReady || isPending} className={inputClass} />
            </label>
            <label className="block sm:col-span-2">
              <span className={labelClass}>Short description</span>
              <textarea name="shortDescription" rows={2} disabled={!tableReady || isPending} className={inputClass} />
            </label>
            <label className="block sm:col-span-2">
              <span className={labelClass}>Long description</span>
              <textarea name="longDescription" rows={3} disabled={!tableReady || isPending} className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Level</span>
              <input name="level" defaultValue="All levels" disabled={!tableReady || isPending} className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Duration</span>
              <input name="duration" defaultValue="8 weeks" disabled={!tableReady || isPending} className={inputClass} />
            </label>
            <label className="block sm:col-span-2">
              <span className={labelClass}>Curriculum JSON</span>
              <textarea
                name="curriculumJson"
                rows={6}
                defaultValue={JSON.stringify([{ week: "Week 1", topics: ["Orientation", "First milestone"] }], null, 2)}
                disabled={!tableReady || isPending}
                className={`${inputClass} font-mono text-xs`}
              />
            </label>
            <button type="submit" disabled={!tableReady || isPending} className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-black text-white disabled:opacity-60 sm:col-span-2">
              {isPending ? "Creating…" : "Create course"}
            </button>
          </form>
        </section>
      ) : null}

      {tab === "blog" && post ? (
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-violet-600">
            <FileText size={14} />
            Blog posts
          </p>
          <select
            value={selectedPost}
            onChange={(e) => setSelectedPost(e.target.value)}
            className="mt-4 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm font-bold dark:border-white/10 dark:bg-zinc-950"
          >
            {blogPosts.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.title}
              </option>
            ))}
          </select>
          <form
            key={post.slug}
            onSubmit={(e) => {
              e.preventDefault();
              run(() => saveBlogPostOverride(new FormData(e.currentTarget)), "Blog post saved.");
            }}
            className="mt-4 space-y-3"
          >
            <input type="hidden" name="slug" value={post.slug} />
            <label className="block">
              <span className={labelClass}>Title</span>
              <input name="title" defaultValue={post.title} disabled={!tableReady || isPending} className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Published date</span>
              <input name="publishedAt" type="date" defaultValue={post.publishedAt} disabled={!tableReady || isPending} className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Excerpt</span>
              <textarea name="excerpt" defaultValue={post.excerpt} rows={2} disabled={!tableReady || isPending} className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Tags (one per line)</span>
              <textarea name="tags" defaultValue={post.tags.join("\n")} rows={2} disabled={!tableReady || isPending} className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Content (markdown)</span>
              <textarea name="content" defaultValue={post.content} rows={10} disabled={!tableReady || isPending} className={`${inputClass} font-mono`} />
            </label>
            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={!tableReady || isPending} className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-black text-white disabled:opacity-60">
                {isPending ? "Saving…" : "Save blog post"}
              </button>
              <button
                type="button"
                disabled={!tableReady || isPending}
                onClick={() => {
                  if (!window.confirm(`Delete or hide ${post.title}?`)) return;
                  run(() => deleteBlogPost(post.slug), "Blog post removed.");
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-black text-red-600"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {tab === "new-blog" ? (
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-violet-600">
            <Plus size={14} />
            New blog post
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(() => createBlogPost(new FormData(e.currentTarget)), "Blog post created.");
            }}
            className="mt-4 space-y-3"
          >
            <label className="block">
              <span className={labelClass}>Title</span>
              <input name="title" required disabled={!tableReady || isPending} className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Slug (optional)</span>
              <input name="slug" placeholder="auto-from-title" disabled={!tableReady || isPending} className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Excerpt</span>
              <textarea name="excerpt" rows={2} disabled={!tableReady || isPending} className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Content</span>
              <textarea name="content" rows={10} required disabled={!tableReady || isPending} className={`${inputClass} font-mono`} />
            </label>
            <button type="submit" disabled={!tableReady || isPending} className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-black text-white disabled:opacity-60">
              {isPending ? "Creating…" : "Create blog post"}
            </button>
          </form>
        </section>
      ) : null}

      {message ? <p className="text-sm font-bold text-violet-600">{message}</p> : null}
    </div>
  );
}
