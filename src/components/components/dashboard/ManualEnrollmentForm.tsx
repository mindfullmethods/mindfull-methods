"use client";

import { useState, useTransition } from "react";

import SectionHeader from "@/components/marketing/SectionHeader";
import { grantManualEnrollment } from "@/actions/grantManualEnrollment";
import { getCourses } from "@/lib/courses";

export default function ManualEnrollmentForm() {
  const courses = getCourses();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="mt-8 mm-section-panel border border-dashed border-violet-300/80 dark:border-violet-400/30"
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
      <SectionHeader
        title="Grant complimentary access"
        description="Enroll a student without Razorpay — useful for comps, scholarships, or manual onboarding."
      />
      <div className="relative mt-5 grid gap-4 sm:grid-cols-2">
        <input
          name="email"
          type="email"
          required
          placeholder="student@email.com"
          className="mm-input w-full"
        />
        <select
          name="course_slug"
          required
          className="mm-input w-full"
          defaultValue={courses[0]?.slug ?? ""}
        >
          {courses.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.title}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="relative mt-4 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-bold text-white disabled:opacity-60 dark:bg-white dark:text-zinc-950"
      >
        {isPending ? "Granting…" : "Grant enrollment"}
      </button>
      {message ? <p className="relative mt-3 text-sm font-semibold text-violet-600 dark:text-violet-300">{message}</p> : null}
    </form>
  );
}
