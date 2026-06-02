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
            className="group relative mm-glass-premium rounded-3xl p-6 transition hover:-translate-y-1"
          >
            <div className="absolute -top-3 left-6 rounded-md bg-violet-700 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
              Step {idx + 1}
            </div>

            <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-700 ring-1 ring-violet-100 dark:bg-violet-500/10 dark:text-violet-200 dark:ring-violet-500/20">
              {Icon ? <Icon size={22} /> : <span className="text-lg font-black">{idx + 1}</span>}
            </div>

            <h3 className="mt-5 text-lg font-semibold tracking-tight mm-heading">{step.title}</h3>
            <p className="mt-3 text-sm leading-6 mm-muted">{step.description}</p>
          </article>
        );
      })}
    </div>
  );
}
