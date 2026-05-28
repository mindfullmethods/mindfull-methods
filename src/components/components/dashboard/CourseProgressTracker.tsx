"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

import { toggleWeekProgressAction } from "@/actions/toggleWeekProgress";

export type WeekItem = {
  index: number;
  label: string;
  topics: string[];
};

export default function CourseProgressTracker({
  courseSlug,
  weeks,
  completedWeeks: initialCompleted,
}: {
  courseSlug: string;
  weeks: WeekItem[];
  completedWeeks: number[];
}) {
  const router = useRouter();
  const [completed, setCompleted] = useState(new Set(initialCompleted));
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const total = weeks.length;
  const done = completed.size;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

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
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-black text-zinc-700 dark:text-zinc-300">
            {done} of {total} weeks complete
          </p>
          <p className="text-2xl font-black text-violet-600 dark:text-violet-300">{percent}%</p>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
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
                <span className="font-black">{week.label}</span>
                <span className="mt-1 block text-sm text-zinc-600 dark:text-zinc-400">
                  {week.topics.join(" · ")}
                </span>
              </span>
            </label>
          );
        })}
      </div>

      {error ? <p className="mt-4 text-sm font-bold text-red-600">{error}</p> : null}
    </div>
  );
}
