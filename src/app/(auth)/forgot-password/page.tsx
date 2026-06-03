"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";

import ThemedBrandLogo from "@/components/marketing/ThemedBrandLogo";
import ThemeToggle from "@/components/ThemeToggle";
import { passwordResetRedirectUrl } from "@/lib/auth-redirect";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: passwordResetRedirectUrl(),
    });

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSent(true);
  }

  return (
    <main className="relative min-h-screen bg-[#f7f8f5] px-5 py-10 text-zinc-950 dark:bg-zinc-950 dark:text-white sm:px-8">
      <div className="absolute right-5 top-5 z-20 sm:right-8">
        <ThemeToggle />
      </div>

      <div className="mx-auto w-full max-w-md">
        <Link href="/" className="mb-10 inline-flex">
          <ThemedBrandLogo size="md" />
        </Link>

        <div className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-xl dark:border-white/10 dark:bg-white/5 sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-zinc-500">Account</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Reset your password</h1>

          {sent ? (
            <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              If an account exists for <strong className="text-zinc-950 dark:text-white">{email}</strong>, you will
              receive a reset link shortly. Open it on this device, then set a new password.
            </p>
          ) : (
            <>
              <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Enter your email and we will send a secure link to choose a new password.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <label className="block">
                  <span className="text-sm font-black">Email</span>
                  <span className="mt-2 flex items-center gap-3 rounded-xl border border-zinc-200 bg-[#f7f8f5] px-4 py-3 dark:border-white/10 dark:bg-zinc-950">
                    <Mail size={18} className="shrink-0 text-zinc-500" />
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="w-full min-w-0 bg-transparent text-sm font-semibold outline-none"
                    />
                  </span>
                </label>

                {error ? (
                  <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 dark:bg-red-950/40 dark:text-red-300">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-5 py-4 text-sm font-black text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-950"
                >
                  {loading ? "Sending…" : "Send reset link"}
                  <ArrowRight size={18} />
                </button>
              </form>
            </>
          )}

          <p className="mt-7 text-center text-sm font-semibold text-zinc-500">
            <Link href="/login" className="inline-flex items-center gap-1.5 font-black text-zinc-950 dark:text-white">
              <ArrowLeft size={16} />
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
