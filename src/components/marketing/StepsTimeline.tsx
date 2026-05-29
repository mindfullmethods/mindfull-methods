import * as React from "react";
import { cn } from "@/lib/utils";

export type StepModel = {
  title: string;
  description: string;
  icon?: React.ComponentType<{ size?: number }>;
};

export default function StepsTimeline({
  steps,
  className,
}: {
  steps: StepModel[];
  className?: string;
}) {
  return (
    <div className={cn("relative grid gap-5 md:grid-cols-3", className)}>
      <div className="pointer-events-none absolute left-[16%] right-[16%] top-10 hidden h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent md:block" />

      {steps.map((step, idx) => {
        const Icon = step.icon;
        return (
          <article
            key={step.title}
            className="group relative mm-glass rounded-3xl p-6 transition hover:-translate-y-1 hover:border-violet-400/25 dark:hover:bg-white/[0.07]"
          >
            <div className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-violet-500 to-teal-400 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">
              Step {idx + 1}
            </div>

            <div className="mt-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-teal-400/10 text-violet-700 ring-1 ring-violet-200 dark:text-white dark:ring-white/10">
              {Icon ? <Icon size={22} /> : <span className="text-lg font-black">{idx + 1}</span>}
            </div>

            <h3 className="mt-5 text-xl font-black tracking-tight mm-heading">{step.title}</h3>
            <p className="mt-3 text-sm leading-6 mm-muted">{step.description}</p>
          </article>
        );
      })}
    </div>
  );
}
