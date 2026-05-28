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
          className="group mm-glass rounded-2xl p-4 transition hover:border-violet-400/30 hover:bg-white/[0.07]"
        >
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">{s.label}</p>
          <p
            className={cn(
              "mt-2 text-2xl font-black",
              i % 2 === 0 ? "text-white" : "mm-gradient-text"
            )}
          >
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}
