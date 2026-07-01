"use client";

import { useState, useTransition } from "react";
import Link from "next/link";

import { markLmsLessonCompleteAction } from "@/actions/lms";
import type { LmsCourse, LmsLesson } from "@/lib/lms/types";

function bunnyEmbedUrl(url: string | null) {
  if (!url) return null;
  if (url.includes("mediadelivery.net") || url.includes("iframe.mediadelivery")) return url;
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const id = url.includes("youtu.be") ? url.split("/").pop() : new URL(url).searchParams.get("v");
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  return url;
}

export default function LessonPlayer({
  course,
  initialLessonId,
}: {
  course: LmsCourse;
  initialLessonId?: string;
}) {
  const allLessons = course.modules.flatMap((mod) => mod.lessons);
  const [activeId, setActiveId] = useState(initialLessonId ?? allLessons[0]?.id ?? "");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  const activeLesson: LmsLesson | undefined = allLessons.find((l) => l.id === activeId) ?? allLessons[0];
  const embed = bunnyEmbedUrl(activeLesson?.videoUrl ?? null);

  function markComplete() {
    if (!activeLesson) return;
    startTransition(async () => {
      const result = await markLmsLessonCompleteAction(course.slug, activeLesson.id);
      setMessage(result.ok ? "Lesson marked complete." : (result.error ?? "Could not save progress."));
    });
  }

  if (!course.enrolled) {
    return (
      <div className="lms-card">
        <p className="font-bold text-zinc-900 dark:text-white">Enroll to access lessons</p>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Complete checkout for this course, then return here to watch lessons and track progress.
        </p>
        <Link href={`/courses/${course.slug}`} className="lms-primary mt-4 inline-block text-sm">
          Go to course page
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <article className="lms-card space-y-4">
        {embed ? (
          <iframe
            title={activeLesson?.title ?? "Lesson video"}
            src={embed}
            className="aspect-video w-full rounded-xl border border-zinc-200 dark:border-white/10"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="lms-video-stage">
            <span aria-hidden>▶</span>
          </div>
        )}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-300">
            {embed ? "Video lesson" : "Bunny Stream ready"}
          </p>
          <h2 className="mt-2 text-xl font-black text-zinc-900 dark:text-white">{activeLesson?.title}</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Secure playback with completion tracking. Set <code>BUNNY_STREAM_*</code> and add URLs in Content studio.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="lms-primary text-sm" disabled={pending} onClick={markComplete}>
              {pending ? "Saving…" : "Mark lesson complete"}
            </button>
            {activeLesson?.notesUrl ? (
              <a href={activeLesson.notesUrl} className="lms-ghost text-sm" target="_blank" rel="noreferrer">
                Download notes
              </a>
            ) : null}
          </div>
          {message ? <p className="mt-3 text-sm font-semibold text-emerald-600">{message}</p> : null}
        </div>
      </article>

      <article className="lms-card">
        <h2 className="text-lg font-black text-zinc-900 dark:text-white">{course.title}</h2>
        {course.modules.map((module) => (
          <div key={module.id} className="mt-6">
            <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{module.title}</h3>
            <ul className="mt-3 space-y-2">
              {module.lessons.map((lesson) => (
                <li key={lesson.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(lesson.id)}
                    className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition ${
                      lesson.id === activeId
                        ? "border-emerald-400/50 bg-emerald-500/10"
                        : "border-zinc-200 dark:border-white/10"
                    }`}
                  >
                    <span>
                      {lesson.complete ? "✓" : "○"} {lesson.title}
                      <br />
                      <small className="text-zinc-500">{lesson.duration}</small>
                    </span>
                    <span className="lms-badge">{lesson.complete ? "Complete" : "Open"}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </article>
    </div>
  );
}
