"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Award, CheckCircle2, Circle, ExternalLink, Loader2, PlayCircle } from "lucide-react";

import { toggleWeekProgressAction } from "@/actions/toggleWeekProgress";
import type { CourseResource } from "@/lib/course-resources";

export type WeekItem = {
  index: number;
  label: string;
  topics: string[];
  resources?: CourseResource[];
};

export default function CourseProgressTracker({
  courseSlug,
  weeks,
  completedWeeks: initialCompleted,
  lastActivityAt,
  verificationStatus = null,
}: {
  courseSlug: string;
  weeks: WeekItem[];
  completedWeeks: number[];
  lastActivityAt?: string | null;
  verificationStatus?: "pending" | "approved" | "rejected" | null;
}) {
  const router = useRouter();
  const [completed, setCompleted] = useState(new Set(initialCompleted));
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const total = weeks.length;
  const done = completed.size;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  const isComplete = percent >= 100;

  function toggleWeek(weekIndex: number, next: boolean) {
    setError("");
    const prev = new Set(completed);
    const nextSet = new Set(completed);
    if (next) nextSet.add(weekIndex);
    else nextSet.delete(weekIndex);
    setCompleted(nextSet);

    startTransition(async () => {
      const result = await toggleWeekProgressAction(courseSlug, weekIndex, next);
      if (!result.ok) {
        setCompleted(prev);
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div>
      {isComplete ? (
        <div
          className={`mb-6 rounded-2xl border p-5 ${
            verificationStatus === "approved"
              ? "border-emerald-200 bg-emerald-50 dark:border-emerald-400/20 dark:bg-emerald-400/10"
              : verificationStatus === "rejected"
                ? "border-red-200 bg-red-50 dark:border-red-400/20 dark:bg-red-400/10"
                : "border-amber-200 bg-amber-50 dark:border-amber-400/20 dark:bg-amber-400/10"
          }`}
        >
          <p className="flex items-center gap-2 text-sm font-bold text-zinc-800 dark:text-zinc-200">
            <Award size={18} />
            {verificationStatus === "approved"
              ? "Certificate approved — ready to download"
              : verificationStatus === "rejected"
                ? "Certificate review — more work needed"
                : "All milestones complete — mentor review in progress"}
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {verificationStatus === "approved"
              ? "Your certificate is issued. Download the PDF or share your verify link."
              : verificationStatus === "rejected"
                ? "Check your email for mentor notes, complete any gaps, and reach out if you need help."
                : "A mentor typically reviews within 1–2 business days. You'll get an email when your certificate is ready."}
          </p>
          <Link
            href={`/dashboard/my-courses/${courseSlug}/certificate`}
            className="mt-3 inline-flex rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
          >
            {verificationStatus === "approved" ? "View & download certificate" : "View certificate status"}
          </Link>
        </div>
      ) : null}

      <div className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
            {done} of {total} weeks complete
          </p>
          <p className="text-2xl font-bold text-violet-600 dark:text-violet-300">{percent}%</p>
        </div>
        {lastActivityAt ? (
          <p className="mt-1 text-xs font-bold text-zinc-500">
            Last activity:{" "}
            {new Intl.DateTimeFormat("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }).format(new Date(lastActivityAt))}
          </p>
        ) : null}
        <div
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Course progress"
          className="mt-3 h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-teal-400 transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {weeks.map((week) => {
          const isDone = completed.has(week.index);

          return (
            <label
              key={week.index}
              className={`flex cursor-pointer gap-4 rounded-2xl border p-4 transition ${
                isDone
                  ? "border-emerald-200 bg-emerald-50 dark:border-emerald-400/20 dark:bg-emerald-400/10"
                  : "border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5"
              } ${isPending ? "opacity-70" : ""}`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={isDone}
                disabled={isPending}
                onChange={(e) => toggleWeek(week.index, e.target.checked)}
              />
              <span className="mt-0.5 shrink-0">
                {isPending ? (
                  <Loader2 size={20} className="animate-spin text-zinc-400" />
                ) : isDone ? (
                  <CheckCircle2 size={20} className="text-emerald-600" />
                ) : (
                  <Circle size={20} className="text-zinc-400" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-bold">{week.label}</span>
                <span className="mt-1 block text-sm text-zinc-600 dark:text-zinc-400">
                  {week.topics.join(" · ")}
                </span>
                {week.resources?.length ? (
                  <span className="mt-3 flex flex-wrap gap-2">
                    {week.resources.map((resource) => (
                      <a
                        key={resource.url + resource.title}
                        href={resource.url}
                        target={resource.url.startsWith("http") ? "_blank" : undefined}
                        rel={resource.url.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-bold text-violet-700 dark:border-white/10 dark:bg-zinc-950 dark:text-violet-300"
                      >
                        {resource.type === "video" ? <PlayCircle size={12} /> : <ExternalLink size={12} />}
                        {resource.title}
                      </a>
                    ))}
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>

      {error ? <p className="mt-4 text-sm font-bold text-red-600">{error}</p> : null}
    </div>
  );
}
