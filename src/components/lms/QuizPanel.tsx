"use client";

import { useEffect, useState, useTransition } from "react";

import { submitLmsQuizAction } from "@/actions/lms";
import type { LmsQuiz } from "@/lib/lms/types";

export default function QuizPanel({ quiz }: { quiz: LmsQuiz }) {
  const question = quiz.questions[0];
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(quiz.timerSeconds);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  function submit() {
    if (!selected || !question) return;
    startTransition(async () => {
      const result = await submitLmsQuizAction(quiz.id, selected);
      if (result.ok) setScore(result.scorePercent ?? 0);
    });
  }

  if (!question) return null;

  return (
    <article className="lms-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">Timed auto-evaluation</p>
          <h2 className="text-xl font-black text-zinc-900 dark:text-white">{quiz.title}</h2>
        </div>
        <span className="lms-badge">
          {minutes}:{seconds}
        </span>
      </div>
      <p className="mt-6 font-semibold text-zinc-800 dark:text-zinc-200">{question.question}</p>
      <div className="mt-4 grid gap-2">
        {question.options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setSelected(option)}
            className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
              selected === option
                ? "border-emerald-400 bg-emerald-500/10"
                : "border-zinc-200 dark:border-white/10"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" className="lms-primary text-sm" disabled={pending || !selected} onClick={submit}>
          Submit quiz
        </button>
        {score !== null ? <span className="lms-badge">Score: {score}%</span> : null}
      </div>
    </article>
  );
}
