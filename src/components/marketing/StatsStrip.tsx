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
      {stats.map((s) => (
        <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-bold text-white/60">{s.label}</p>
          <p className="mt-1 text-2xl font-black text-white">{s.value}</p>
        </div>
      ))}
    </div>
  );
}

