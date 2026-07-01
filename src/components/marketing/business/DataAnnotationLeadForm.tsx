"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";

type Status = "idle" | "sending" | "sent" | "error";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function DataAnnotationLeadForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    requirement: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || form.name.trim().length < 2) {
      setError("Please enter your full name.");
      setStatus("error");
      return;
    }
    if (!isValidEmail(form.email)) {
      setError("Please enter a valid work email.");
      setStatus("error");
      return;
    }
    if (!form.company.trim()) {
      setError("Please enter your company name.");
      setStatus("error");
      return;
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      setError("Message should be at least 10 characters.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    try {
      const message = `[Data annotation enquiry] Company: ${form.company}${
        form.requirement ? ` · Dataset: ${form.requirement}` : ""
      }\n\n${form.message}`;
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          interest: "general",
          message,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("sent");
      setForm({ name: "", email: "", company: "", phone: "", requirement: "", message: "" });
    } catch {
      setError("Network error. Check your connection and try again.");
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/35 outline-none transition focus:border-violet-400/50 focus:bg-white/[0.05]";

  return (
    <section id="quote" className="mm-landing-section px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <p className="mm-landing-tag">Request a custom quote</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Get pricing &amp; a <span className="text-violet-300">sample dataset</span>
          </h2>
          <p className="mt-3 text-sm text-white/50">
            Share your project and get pricing, sample data, and a plan—usually within 24 hours.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mm-landing-glass mt-10 space-y-4 rounded-2xl p-6 sm:p-8">
          {status === "sent" ? (
            <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm font-semibold text-emerald-200">
              Thanks — we&apos;ll send a proposal and sample dataset shortly.
            </div>
          ) : null}
          {status === "error" && error ? (
            <div className="rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm font-semibold text-rose-200">
              {error}
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              className={inputClass}
              placeholder="Full name *"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
            <input
              className={inputClass}
              placeholder="Work email *"
              inputMode="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            />
            <input
              className={inputClass}
              placeholder="Company *"
              value={form.company}
              onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
            />
            <input
              className={inputClass}
              placeholder="Phone (optional)"
              inputMode="tel"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            />
          </div>

          <input
            className={inputClass}
            placeholder="Dataset requirement (optional)"
            value={form.requirement}
            onChange={(e) => setForm((p) => ({ ...p, requirement: e.target.value }))}
          />

          <textarea
            className={`${inputClass} resize-none`}
            rows={5}
            placeholder="Describe your data needs—tasks, volume, formats, timelines *"
            value={form.message}
            onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
          />

          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-900/40 transition hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-60"
          >
            {status === "sending" ? "Sending…" : "Submit & get a proposal"}
            <Send size={16} />
          </button>

          <p className="text-center text-xs text-white/35">
            By submitting, you agree to be contacted about your enquiry.
          </p>
        </form>
      </div>
    </section>
  );
}
