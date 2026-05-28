"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CheckCircle2, CircleAlert } from "lucide-react";

import { applyToInternshipAction } from "@/actions/applyToInternship";

type Feedback =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null;

export default function ApplyButton({ internshipId }: { internshipId: string }) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  async function handleApply() {
    setFeedback(null);
    setLoading(true);

    const result = await applyToInternshipAction(internshipId);

    setLoading(false);

    if (result.ok) {
      setFeedback({ type: "success", message: result.message });
      return;
    }

    setFeedback({ type: "error", message: result.error });
  }

  return (
    <div className="mt-8">
      <button
        onClick={handleApply}
        disabled={loading || feedback?.type === "success"}
        className="w-full rounded-2xl bg-black py-4 text-lg font-medium text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {loading ? "Applying..." : feedback?.type === "success" ? "Applied" : "Apply Now"}
      </button>

      {feedback?.type === "success" ? (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-400/20 dark:bg-emerald-400/10">
          <p className="flex items-center gap-2 text-sm font-bold text-emerald-800 dark:text-emerald-200">
            <CheckCircle2 size={16} />
            {feedback.message}
          </p>
          <Link
            href="/dashboard/my-applications"
            className="mt-2 inline-flex items-center gap-1 text-sm font-black text-emerald-700 hover:underline dark:text-emerald-300"
          >
            View my applications
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : null}

      {feedback?.type === "error" ? (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-400/20 dark:bg-red-400/10">
          <p className="flex items-center gap-2 text-sm font-bold text-red-700 dark:text-red-300">
            <CircleAlert size={16} />
            {feedback.message}
          </p>
          {feedback.message.includes("sign in") ? (
            <Link
              href={`/login?next=${encodeURIComponent(`/dashboard/internships/${internshipId}`)}`}
              className="mt-2 inline-flex items-center gap-1 text-sm font-black text-red-700 hover:underline dark:text-red-300"
            >
              Sign in to apply
              <ArrowRight size={14} />
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
