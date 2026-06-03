"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, LockKeyhole, Loader2 } from "lucide-react";

import ThemedBrandLogo from "@/components/marketing/ThemedBrandLogo";
import ThemeToggle from "@/components/ThemeToggle";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#f7f8f5] dark:bg-zinc-950" />}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [exchanging, setExchanging] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
      }
    });

    async function establishSession() {
      const code = searchParams.get("code");
      if (code) {
        setExchanging(true);
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        setExchanging(false);
        if (cancelled) return;
        if (exchangeError) {
          setError(exchangeError.message);
          return;
        }
        setReady(true);
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      if (!cancelled && sessionData.session) setReady(true);
    }

    void establishSession();

    return () => {
      cancelled = true;
      authListener.subscription.unsubscribe();
    };
  }, [searchParams]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setDone(true);
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
          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Choose a new password</h1>

          {exchanging ? (
            <p className="mt-6 flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
              <Loader2 size={18} className="animate-spin" />
              Verifying your reset link…
            </p>
          ) : done ? (
            <>
              <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Your password was updated. You can sign in with your new credentials.
              </p>
              <Link
                href="/login"
                className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-5 py-4 text-sm font-black text-white dark:bg-white dark:text-zinc-950"
              >
                Go to sign in
                <ArrowRight size={18} />
              </Link>
            </>
          ) : !ready ? (
            <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Open the reset link from your email on this device. If it expired,{" "}
              <Link href="/forgot-password" className="font-black text-violet-600 hover:underline">
                request a new one
              </Link>
              .
            </p>
          ) : (
            <>
              <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Use at least 8 characters. You will stay signed in after saving.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <label className="block">
                  <span className="text-sm font-black">New password</span>
                  <span className="mt-2 flex items-center gap-3 rounded-xl border border-zinc-200 bg-[#f7f8f5] px-4 py-3 dark:border-white/10 dark:bg-zinc-950">
                    <LockKeyhole size={18} className="shrink-0 text-zinc-500" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="w-full min-w-0 bg-transparent text-sm font-semibold outline-none"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="text-sm font-black">Confirm password</span>
                  <span className="mt-2 flex items-center gap-3 rounded-xl border border-zinc-200 bg-[#f7f8f5] px-4 py-3 dark:border-white/10 dark:bg-zinc-950">
                    <LockKeyhole size={18} className="shrink-0 text-zinc-500" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      autoComplete="new-password"
                      placeholder="Repeat password"
                      value={confirm}
                      onChange={(event) => setConfirm(event.target.value)}
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
                  {loading ? "Saving…" : "Update password"}
                  <ArrowRight size={18} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
