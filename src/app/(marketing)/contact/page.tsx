"use client";

import { Suspense, useEffect, useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";

import Button from "@/components/marketing/Button";
import MarketingPageHero from "@/components/marketing/MarketingPageHero";
import SectionHeader from "@/components/marketing/SectionHeader";
import { getCourseBySlug, getCourses } from "@/lib/courses";
import { supabase } from "@/lib/supabase";
import { siteConfig } from "@/lib/site";

type ContactForm = {
  name: string;
  email: string;
  phone?: string;
  interest: string;
  message: string;
};

type ContactStatus = "idle" | "sending" | "sent" | "error";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10" />}>
      <ContactPageContent />
    </Suspense>
  );
}

function ContactPageContent() {
  const searchParams = useSearchParams();
  const courseParam = searchParams.get("course");
  const courses = getCourses();

  const interestOptions = useMemo(() => {
    return [
      { value: "general", label: "General guidance" },
      ...courses.map((c) => ({ value: c.slug, label: c.title })),
    ];
  }, [courses]);

  const defaultInterest = useMemo(() => {
    if (!courseParam) return "general";
    const course = getCourseBySlug(courseParam);
    return course?.slug ?? "general";
  }, [courseParam]);

  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    interest: defaultInterest,
    message: "",
  });

  useEffect(() => {
    setForm((prev) => ({ ...prev, interest: defaultInterest }));
  }, [defaultInterest]);

  useEffect(() => {
    async function prefillFromSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const name =
        (user.user_metadata?.full_name as string | undefined) ??
        (user.user_metadata?.name as string | undefined) ??
        "";

      setForm((prev) => ({
        ...prev,
        name: prev.name || name,
        email: prev.email || user.email || "",
      }));
    }

    prefillFromSession();
  }, []);

  const [status, setStatus] = useState<ContactStatus>("idle");
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});

  function validate(next: ContactForm) {
    const nextErrors: Partial<Record<keyof ContactForm, string>> = {};

    if (!next.name.trim() || next.name.trim().length < 2) {
      nextErrors.name = "Please enter your full name.";
    }
    if (!next.email.trim() || !isValidEmail(next.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (!next.interest.trim()) {
      nextErrors.interest = "Please choose an interest.";
    }
    if (!next.message.trim() || next.message.trim().length < 10) {
      nextErrors.message = "Message should be at least 10 characters.";
    }

    if (next.phone && next.phone.trim().length > 0) {
      const digits = next.phone.replace(/\D/g, "");
      if (digits.length < 8) nextErrors.phone = "Phone number looks too short.";
    }

    return nextErrors;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("idle");

    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      return;
    }

    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok || !data.ok) {
        setServerError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("sent");
      setForm({ name: "", email: "", phone: "", interest: defaultInterest, message: "" });
      setErrors({});
    } catch {
      setServerError("Network error. Check your connection and try again.");
      setStatus("error");
    }
  }

  return (
    <>
      <MarketingPageHero
        eyebrow="Contact"
        title="Talk to a mentor"
        description="Tell us your goals and we'll recommend the best mentorship track. Response time: Mon–Fri, 10am–6pm."
      />

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="mm-card-premium p-6 sm:p-8">
            <div className="flex items-start justify-between gap-6">
              <SectionHeader eyebrow="Request" title="Send your details" className="flex-1" />

              <div className="hidden rounded-2xl border mm-border bg-zinc-50/80 p-4 dark:bg-white/[0.02] sm:block">
                <p className="text-xs font-bold uppercase tracking-[0.22em] mm-subtle">What happens next</p>
                <div className="mt-3 space-y-2 text-sm font-bold mm-muted">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Quick review
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Track recommendation
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Mentor touchpoint
                  </div>
                </div>
              </div>
            </div>

            <form className="mt-6 space-y-5" onSubmit={onSubmit}>
              {status === "sent" ? (
                <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4">
                  <p className="text-sm font-bold text-emerald-300">Message sent successfully.</p>
                  <p className="mt-1 text-sm font-bold text-emerald-200/70">
                    We'll get back to you soon with next steps.
                  </p>
                </div>
              ) : null}

              {status === "error" && serverError ? (
                <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 p-4">
                  <p className="text-sm font-bold text-rose-200">{serverError}</p>
                </div>
              ) : null}

              {status === "error" && Object.keys(errors).length > 0 && !serverError ? (
                <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 p-4">
                  <p className="text-sm font-bold text-rose-200">Please fix the highlighted fields.</p>
                </div>
              ) : null}

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-zinc-800 dark:text-white/80">Full name</span>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="mt-2 mm-input"
                    placeholder="Your name"
                  />
                  {errors.name ? (
                    <p className="mt-2 text-xs font-bold text-rose-600 dark:text-rose-200">{errors.name}</p>
                  ) : null}
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-zinc-800 dark:text-white/80">Email</span>
                  <input
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className="mt-2 mm-input"
                    placeholder="you@example.com"
                    inputMode="email"
                  />
                  {errors.email ? (
                    <p className="mt-2 text-xs font-bold text-rose-600 dark:text-rose-200">{errors.email}</p>
                  ) : null}
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-zinc-800 dark:text-white/80">Phone (optional)</span>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    className="mt-2 mm-input"
                    placeholder="+1 555 123 4567"
                    inputMode="tel"
                  />
                  {errors.phone ? (
                    <p className="mt-2 text-xs font-bold text-rose-600 dark:text-rose-200">{errors.phone}</p>
                  ) : null}
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-zinc-800 dark:text-white/80">Interest</span>
                  <select
                    value={form.interest}
                    onChange={(e) => setForm((p) => ({ ...p, interest: e.target.value }))}
                    className="mt-2 mm-input"
                  >
                    {interestOptions.map((o) => (
                      <option key={o.value} value={o.value} className="text-zinc-950">
                        {o.label}
                      </option>
                    ))}
                  </select>
                  {errors.interest ? (
                    <p className="mt-2 text-xs font-bold text-rose-600 dark:text-rose-200">{errors.interest}</p>
                  ) : null}
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-zinc-800 dark:text-white/80">Message</span>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  rows={6}
                  className="mt-2 mm-input resize-none"
                  placeholder="Tell us what you want to achieve and your current level..."
                />
                {errors.message ? (
                  <p className="mt-2 text-xs font-bold text-rose-600 dark:text-rose-200">{errors.message}</p>
                ) : null}
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-bold mm-subtle">
                  By submitting, you agree to be contacted about your request.
                </p>

                <Button
                  variant="primary"
                  size="lg"
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full sm:w-auto"
                >
                  {status === "sending" ? "Sending..." : "Send message"}
                </Button>
              </div>
            </form>
          </section>

          <aside className="space-y-5">
            <div className="mm-card-premium p-6 sm:p-8">
              <SectionHeader
                eyebrow="Support"
                title="Quick answers"
                description="Prefer email? Reach out and we'll help you pick the right course track."
              />

              <div className="mt-6 space-y-3 text-sm font-semibold text-zinc-800 dark:text-white/80">
                <div className="flex items-center gap-3 rounded-2xl border mm-border bg-zinc-50/80 p-4 dark:bg-white/[0.02]">
                  <span className="h-3 w-3 rounded-full bg-violet-400" />
                  {siteConfig.supportEmail}
                </div>
                <div className="flex items-center gap-3 rounded-2xl border mm-border bg-zinc-50/80 p-4 dark:bg-white/[0.02]">
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  Mon–Fri · 10am–6pm
                </div>
              </div>
            </div>

            <div className="mm-card-premium p-6 sm:p-8">
              <p className="mm-pro-eyebrow">Recommendation</p>
              <p className="mt-3 text-sm leading-7 mm-muted">
                If you're unsure which track fits, choose{" "}
                <span className="font-bold mm-heading">General guidance</span>. We'll tailor the recommendation to
                your goals.
              </p>
              <div className="mt-6">
                <Button href="/courses" variant="secondary" size="md">
                  Browse courses
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
