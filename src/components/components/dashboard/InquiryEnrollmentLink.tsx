"use client";

import { useState, useTransition } from "react";

import { linkInquiryToEnrollment } from "@/actions/updateInquiryNotes";
import type { AdminEnrollment } from "@/Services/admin-enrollments";

export default function InquiryEnrollmentLink({
  inquiryId,
  inquiryEmail,
  enrollments,
  linkedEnrollmentId,
  disabled,
}: {
  inquiryId: string;
  inquiryEmail: string;
  enrollments: AdminEnrollment[];
  linkedEnrollmentId?: string | null;
  disabled?: boolean;
}) {
  const matches = enrollments.filter((e) => e.email?.toLowerCase() === inquiryEmail.toLowerCase());
  const [value, setValue] = useState(linkedEnrollmentId ?? "");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  if (matches.length === 0) return null;

  function save() {
    setMessage("");
    startTransition(async () => {
      const result = await linkInquiryToEnrollment(inquiryId, value || null);
      setMessage(result.ok ? "Enrollment link saved." : result.error);
    });
  }

  return (
    <div className="mt-4 rounded-2xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-400/20 dark:bg-violet-400/10">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700 dark:text-violet-300">
        Link enrollment
      </p>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        className="mt-2 w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60 dark:border-violet-400/20 dark:bg-zinc-950"
      >
        <option value="">No linked enrollment</option>
        {matches.map((e) => (
          <option key={e.id} value={e.id}>
            {e.course_title} · {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(e.created_at))}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={save}
        disabled={isPending || disabled}
        className="mt-3 rounded-xl bg-violet-600 px-4 py-2 text-xs font-black text-white disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save link"}
      </button>
      {disabled ? (
        <p className="mt-2 text-xs font-bold text-violet-700 dark:text-violet-300">
          Run the enrollment link SQL from the banner above, then refresh.
        </p>
      ) : null}
      {message ? (
        <p
          className={`mt-2 text-xs font-bold ${message.includes("SQL") || message.includes("schema") ? "text-red-600" : "text-violet-700 dark:text-violet-300"}`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
