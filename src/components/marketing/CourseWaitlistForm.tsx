"use client";

import { useState, useTransition } from "react";
import { Bell } from "lucide-react";

import { joinCourseWaitlistAction } from "@/actions/joinCourseWaitlist";

export default function CourseWaitlistForm({
  courseSlug,
  courseTitle,
}: {
  courseSlug: string;
  courseTitle: string;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    const formData = new FormData();
    formData.set("course_slug", courseSlug);
    formData.set("email", email);
    formData.set("full_name", name);
    startTransition(async () => {
      const result = await joinCourseWaitlistAction(formData);
      if (result.ok) {
        setMessage("You're on the waitlist — we'll email you when seats open.");
        setEmail("");
      } else {
        setMessage(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border mm-border bg-violet-50/60 p-5 dark:bg-violet-950/30">
      <p className="flex items-center gap-2 text-sm font-bold text-violet-800 dark:text-violet-200">
        <Bell size={16} />
        Join the waitlist for {courseTitle}
      </p>
      <p className="mt-1 text-xs leading-5 mm-muted">
        Get notified when enrollment opens or new cohort dates are announced.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mm-input w-full"
        />
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mm-input w-full"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="mt-3 w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Notify me"}
      </button>
      {message ? (
        <p
          className={`mt-3 text-xs font-bold ${message.includes("waitlist") ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700"}`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
