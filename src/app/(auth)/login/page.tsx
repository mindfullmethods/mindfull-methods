"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, BriefcaseBusiness, LockKeyhole, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { linkEnrollmentAction } from "@/actions/linkEnrollment";
import BrandLogo from "@/components/marketing/BrandLogo";
import ThemedBrandLogo from "@/components/marketing/ThemedBrandLogo";
import ThemeToggle from "@/components/ThemeToggle";
import { marketingImages } from "@/lib/images";

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#f7f8f5] dark:bg-zinc-950" />}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/dashboard";
  const paid = searchParams.get("paid") === "1";
  const orderId = searchParams.get("order");
  const courseSlug = searchParams.get("course");

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    let destination = nextPath.startsWith("/") ? nextPath : "/dashboard";

    if (orderId) {
      const link = await linkEnrollmentAction(orderId);
      if (link.ok && link.courseSlug) {
        destination = paid
          ? `/dashboard/my-courses/welcome?course=${encodeURIComponent(link.courseSlug)}`
          : `/dashboard/my-courses?enrolled=1&course=${encodeURIComponent(link.courseSlug)}`;
      }
    } else if (paid && courseSlug) {
      destination = `/dashboard/my-courses/welcome?course=${encodeURIComponent(courseSlug)}`;
    }

    setLoading(false);
    router.replace(destination);
  }

  return (
    <main className="relative grid min-h-screen bg-[#f7f8f5] text-zinc-950 dark:bg-zinc-950 dark:text-white lg:grid-cols-[1.05fr_0.95fr]">
      <div className="absolute right-5 top-5 z-20 sm:right-8">
        <ThemeToggle />
      </div>
      <section className="relative hidden overflow-hidden lg:block">
        <img
          src={marketingImages.authCollaboration}
          alt="Team collaboration"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-zinc-950/65" />
        <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
          <Link href="/" className="inline-flex">
            <BrandLogo size="lg" theme="dark" />
          </Link>

          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur-md">
              <BriefcaseBusiness size={16} />
              Student career workspace
            </div>
            <h1 className="mt-6 text-6xl font-black leading-tight tracking-tight">
              Welcome back to your internship command center.
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/75">
              Continue applications, explore programs, and manage your progress from a focused dashboard.
            </p>
          </div>

          <p className="text-sm font-bold text-white/55">Built for students, mentors, and admin teams.</p>
        </div>
      </section>

      <section className="flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-10 inline-flex lg:hidden">
            <ThemedBrandLogo size="md" />
          </Link>

          <div className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-xl dark:border-white/10 dark:bg-white/5 sm:p-8">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-zinc-500">Login</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight">Continue your journey</h1>
            <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Access your internship dashboard and manage your applications.
            </p>

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              <label className="block">
                <span className="text-sm font-black">Email</span>
                <span className="mt-2 flex items-center gap-3 rounded-xl border border-zinc-200 bg-[#f7f8f5] px-4 py-3 dark:border-white/10 dark:bg-zinc-950">
                  <Mail size={18} className="text-zinc-500" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full bg-transparent text-sm font-semibold outline-none"
                  />
                </span>
              </label>

              <label className="block">
                <span className="text-sm font-black">Password</span>
                <span className="mt-2 flex items-center gap-3 rounded-xl border border-zinc-200 bg-[#f7f8f5] px-4 py-3 dark:border-white/10 dark:bg-zinc-950">
                  <LockKeyhole size={18} className="text-zinc-500" />
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full bg-transparent text-sm font-semibold outline-none"
                  />
                </span>
              </label>

              {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{error}</p>}

              <button
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-5 py-4 text-sm font-black text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-950"
              >
                {loading ? "Signing in..." : "Sign in"}
                <ArrowRight size={18} />
              </button>
            </form>

            <p className="mt-7 text-center text-sm font-semibold text-zinc-500">
              New here?{" "}
              <Link href="/signup" className="font-black text-zinc-950 dark:text-white">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
