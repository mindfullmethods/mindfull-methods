"use client";

import { useState, useTransition } from "react";
import { Award, CheckCircle2 } from "lucide-react";

import { adminCompleteEnrollmentCourse } from "@/actions/adminCompleteCourse";

export default function EnrollmentCompleteButton({
  enrollmentId,
  percent,
  disabled,
}: {
  enrollmentId: string;
  percent: number;
  disabled?: boolean;
}) {
  const [message, setMessage] = useState("");
  const [messageIsError, setMessageIsError] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (percent >= 100) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
        <CheckCircle2 size={14} />
        Complete
      </span>
    );
  }

  function markComplete() {
    if (!window.confirm("Mark all weeks complete and issue the certificate for this student?")) return;

    setMessage("");
    setMessageIsError(false);
    startTransition(async () => {
      const result = await adminCompleteEnrollmentCourse(enrollmentId);
      if (!result.ok) {
        setMessageIsError(true);
        setMessage(result.error);
        return;
      }
      setMessage(`Course marked complete${result.certificateId ? ` · ${result.certificateId}` : ""}.`);
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={markComplete}
        disabled={isPending || disabled}
        className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-black text-white disabled:opacity-60"
      >
        <Award size={14} />
        {isPending ? "Completing…" : "Mark complete"}
      </button>
      {message ? (
        <p className={`mt-2 text-xs font-bold ${messageIsError ? "text-red-600" : "text-violet-700 dark:text-violet-300"}`}>
          {message}
        </p>
      ) : null}
    </div>
  );
}
