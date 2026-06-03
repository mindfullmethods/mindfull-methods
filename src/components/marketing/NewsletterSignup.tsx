"use client";

import { useState, useTransition } from "react";
import { Mail } from "lucide-react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    startTransition(async () => {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (data.ok) {
        setMessage("Subscribed — watch your inbox for course updates.");
        setEmail("");
      } else {
        setMessage(data.error ?? "Could not subscribe.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-white/55">
        Newsletter
      </p>
      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-white/60">
        Tips on courses, mentorship, and career growth — no spam.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <span className="flex min-h-11 flex-1 items-center gap-2 rounded-xl border mm-border bg-white px-3 dark:bg-zinc-950">
          <Mail size={16} className="shrink-0 text-zinc-400" />
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent text-sm font-semibold outline-none"
          />
        </span>
        <button
          type="submit"
          disabled={isPending}
          className="min-h-11 shrink-0 rounded-xl bg-zinc-950 px-5 text-sm font-bold text-white dark:bg-white dark:text-zinc-950"
        >
          {isPending ? "…" : "Subscribe"}
        </button>
      </div>
      {message ? <p className="mt-2 text-xs font-bold text-violet-600 dark:text-violet-300">{message}</p> : null}
    </form>
  );
}
