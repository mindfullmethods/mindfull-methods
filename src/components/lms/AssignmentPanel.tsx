"use client";

import { useState, useTransition } from "react";

import { submitLmsAssignmentAction } from "@/actions/lms";
import type { LmsAssignment } from "@/lib/lms/types";

export default function AssignmentPanel({ assignments }: { assignments: LmsAssignment[] }) {
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await submitLmsAssignmentAction(formData);
      setMessage(result.ok ? "Assignment submitted for instructor review." : (result.error ?? "Submit failed."));
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <article className="lms-card">
        <h2 className="text-lg font-black text-zinc-900 dark:text-white">Submit assignment</h2>
        <form action={onSubmit} className="mt-4 space-y-4">
          <input type="hidden" name="assignmentId" value={assignments[0]?.id ?? "demo-a1"} />
          <label className="block text-sm font-semibold">
            PDF or ZIP upload
            <input type="file" accept=".pdf,.zip" className="mt-2 w-full text-sm" />
          </label>
          <label className="block text-sm font-semibold">
            GitHub repository
            <input
              name="githubLink"
              className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 dark:border-white/10 dark:bg-zinc-900"
              placeholder="https://github.com/student/ai-capstone"
            />
          </label>
          <label className="block text-sm font-semibold">
            Project URL
            <input
              name="projectUrl"
              className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 dark:border-white/10 dark:bg-zinc-900"
              placeholder="https://your-demo.vercel.app"
            />
          </label>
          <button type="submit" className="lms-primary text-sm" disabled={pending}>
            {pending ? "Submitting…" : "Submit project"}
          </button>
          {message ? <p className="text-sm font-semibold text-emerald-600">{message}</p> : null}
        </form>
      </article>
      <article className="lms-card">
        <h2 className="text-lg font-black text-zinc-900 dark:text-white">Assignment tracker</h2>
        <ul className="mt-4 space-y-3">
          {assignments.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 px-3 py-3 dark:border-white/10"
            >
              <span className="text-sm">
                {item.title}
                <br />
                <small className="text-zinc-500">
                  {item.courseTitle}
                  {item.dueAt ? ` · Due ${item.dueAt}` : ""}
                </small>
              </span>
              <span className="lms-badge">{item.status}</span>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}
