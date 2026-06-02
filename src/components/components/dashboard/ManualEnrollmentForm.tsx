"use client";

import { useState, useTransition } from "react";

import { grantManualEnrollment } from "@/actions/grantManualEnrollment";
import { getCourses } from "@/lib/courses";

export default function ManualEnrollmentForm() {
  const courses = getCourses();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="mt-8 rounded-3xl border border-dashed border-violet-300 bg-violet-50 p-6 dark:border-violet-400/30 dark:bg-violet-400/10"
      onSubmit={(event) => {
        event.preventDefault();
        setMessage("");
        const form = event.currentTarget;
        const formData = new FormData(form);
        startTransition(async () => {
          const result = await grantManualEnrollment(formData);
          setMessage(result.ok ? "Complimentary enrollment granted." : result.error);
          if (result.ok) form.reset();
        });
      }}
    >
      <h2 className="text-lg font-black">Grant complimentary access</h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Enroll a student without Razorpay — useful for comps, scholarships, or manual onboarding.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <input
          name="email"
          type="email"
          required
          placeholder="student@email.com"
          className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold dark:border-white/10 dark:bg-zinc-950"
        />
        <select
          name="courseSlug"
          required
          className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-bold dark:border-white/10 dark:bg-zinc-950"
        >
          <option value="">Select course</option>
          {courses.map((course) => (
            <option key={course.slug} value={course.slug}>
              {course.title}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="mt-4 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-black text-white disabled:opacity-60 dark:bg-white dark:text-zinc-950"
      >
        {isPending ? "Granting…" : "Grant enrollment"}
      </button>
      {message ? <p className="mt-3 text-sm font-bold text-violet-700 dark:text-violet-300">{message}</p> : null}
    </form>
  );
}
