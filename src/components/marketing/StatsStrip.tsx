import * as React from "react";
import { cn } from "@/lib/utils";

export default function StatsStrip({
  className,
  stats,
}: {
  className?: string;
  stats: Array<{ label: string; value: string }>;
}) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {stats.map((s, i) => (
        <div
          key={s.label}
          className="group mm-glass-premium rounded-2xl p-4 transition hover:-translate-y-0.5"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.12em] mm-subtle">{s.label}</p>
          <p className={cn("mt-2 text-xl font-bold", i % 2 === 0 ? "mm-heading" : "text-violet-700 dark:text-violet-300")}>
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}
