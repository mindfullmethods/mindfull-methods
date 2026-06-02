"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Circle, Settings, BookOpen, Download } from "lucide-react";

export type OnboardingStep = {
  id: string;
  label: string;
  href: string;
  done: boolean;
};

export default function DashboardOnboardingChecklist({ steps }: { steps: OnboardingStep[] }) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(window.localStorage.getItem("mm_onboarding_dismissed") === "1");
  }, []);

  const pending = steps.filter((s) => !s.done);
  if (dismissed || pending.length === 0) return null;

  const icons: Record<string, typeof Settings> = {
    profile: Settings,
    week1: BookOpen,
    syllabus: Download,
  };

  return (
    <section className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-400/20 dark:bg-amber-400/10 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-800 dark:text-amber-200">
            Getting started
          </p>
          <h2 className="mt-2 text-xl font-black text-amber-950 dark:text-amber-100">
            Complete your setup ({pending.length} left)
          </h2>
        </div>
        <button
          type="button"
          onClick={() => {
            window.localStorage.setItem("mm_onboarding_dismissed", "1");
            setDismissed(true);
          }}
          className="text-xs font-black text-amber-700 hover:underline dark:text-amber-300"
        >
          Dismiss
        </button>
      </div>
      <ul className="mt-5 space-y-3">
        {steps.map((step) => {
          const Icon = icons[step.id] ?? BookOpen;
          return (
            <li key={step.id}>
              <Link
                href={step.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                  step.done
                    ? "bg-emerald-100/80 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200"
                    : "bg-white text-amber-950 hover:bg-amber-100 dark:bg-zinc-950 dark:text-amber-100 dark:hover:bg-amber-400/10"
                }`}
              >
                {step.done ? <CheckCircle2 size={18} className="text-emerald-600" /> : <Circle size={18} />}
                <Icon size={16} />
                {step.label}
                {!step.done ? <ArrowRight size={14} className="ml-auto" /> : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
