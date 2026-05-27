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
    <div className={cn("grid gap-4 md:grid-cols-3", className)}>
      {steps.map((step, idx) => {
        const Icon = step.icon;
        return (
          <article
            key={step.title}
            className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-950 text-white/90">
                {Icon ? <Icon size={20} /> : <span className="text-sm font-black">{idx + 1}</span>}
              </div>
              <div>
                <p className="text-sm font-black text-white/50">Step {idx + 1}</p>
                <h3 className="mt-1 text-xl font-black tracking-tight">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">{step.description}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

