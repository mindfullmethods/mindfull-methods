"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, LockKeyhole, Mail, UserRound } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getCourseBySlug } from "@/lib/courses";
import { linkEnrollmentAction } from "@/actions/linkEnrollment";
import ThemedBrandLogo from "@/components/marketing/ThemedBrandLogo";
import ThemeToggle from "@/components/ThemeToggle";
import { marketingImages } from "@/lib/images";

export default function SignupPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#f7f8f5] dark:bg-zinc-950" />}>
      <SignupPageContent />
    </Suspense>
  );
}

function SignupPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseSlug = searchParams.get("course");
  const paid = searchParams.get("paid") === "1";
  const orderId = searchParams.get("order");
  const selectedCourse = useMemo(
    () => (courseSlug ? getCourseBySlug(courseSlug) : null),
    [courseSlug]
  );

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSignup(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          interested_course: selectedCourse?.slug ?? courseSlug ?? null,
        },
      },
    });

    if (error) {
      setLoading(false);
      setMessage(error.message);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: fullName,
        email,
      });

      if (orderId) {
        await linkEnrollmentAction(orderId);
      }
    }

    setLoading(false);

    if (data.session) {
      router.replace(paid ? "/dashboard/my-courses?enrolled=1" : "/dashboard/internships");
      return;
    }

    setMessage("Account created. Check your email if confirmation is enabled, then sign in to continue.");
  }

  return (
    <main className="relative grid min-h-screen bg-[#f7f8f5] text-zinc-950 dark:bg-zinc-950 dark:text-white lg:grid-cols-[0.95fr_1.05fr]">
      <div className="absolute right-5 top-5 z-20 sm:right-8">
        <ThemeToggle />
      </div>
      <section className="flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-7 shadow-xl dark:border-white/10 dark:bg-white/5 sm:p-8">
          <Link href="/" className="mb-8 inline-flex">
            <ThemedBrandLogo size="md" />
          </Link>

          <p className="text-sm font-black uppercase tracking-[0.28em] text-zinc-500">Apply</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight">Create your student workspace</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {selectedCourse
              ? `You're applying for ${selectedCourse.title}. Create an account to browse internships and track applications.`
              : "Start applying to structured programs and build proof of work."}
          </p>

          {paid ? (
            <div className="mt-5 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-bold text-violet-900 dark:border-violet-400/20 dark:bg-violet-400/10 dark:text-violet-100">
              Payment confirmed — create your account to access the course and dashboard.
            </div>
          ) : null}

          {selectedCourse ? (
            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
              Selected track: {selectedCourse.title}
            </div>
          ) : null}

          <form onSubmit={handleSignup} className="mt-8 space-y-5">
            {[
              {
                label: "Full name",
                value: fullName,
                setValue: setFullName,
                type: "text",
                placeholder: "Your full name",
                icon: UserRound,
              },
              {
                label: "Email",
                value: email,
                setValue: setEmail,
                type: "email",
                placeholder: "you@example.com",
                icon: Mail,
              },
              {
                label: "Password",
                value: password,
                setValue: setPassword,
                type: "password",
                placeholder: "Create password",
                icon: LockKeyhole,
              },
            ].map((field) => {
              const Icon = field.icon;

              return (
                <label key={field.label} className="block">
                  <span className="text-sm font-black">{field.label}</span>
                  <span className="mt-2 flex items-center gap-3 rounded-xl border border-zinc-200 bg-[#f7f8f5] px-4 py-3 dark:border-white/10 dark:bg-zinc-950">
                    <Icon size={18} className="text-zinc-500" />
                    <input
                      type={field.type}
                      required
                      placeholder={field.placeholder}
                      value={field.value}
                      onChange={(event) => field.setValue(event.target.value)}
                      className="w-full bg-transparent text-sm font-semibold outline-none"
                    />
                  </span>
                </label>
              );
            })}

            {message && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{message}</p>}

            <button
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-5 py-4 text-sm font-black text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-950"
            >
              {loading ? "Creating account..." : "Create account"}
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-7 text-center text-sm font-semibold text-zinc-500">
            Already registered?{" "}
            <Link
              href={courseSlug ? `/login?next=${encodeURIComponent("/dashboard/internships")}` : "/login"}
              className="font-black text-zinc-950 dark:text-white"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>

      <section className="relative hidden overflow-hidden lg:block">
        <img
          src={marketingImages.authDashboard}
          alt="Mindfull Methods dashboard preview"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-zinc-950/65" />
        <div className="relative z-10 flex h-full flex-col justify-end p-10 text-white">
          <div className="max-w-xl">
            <h2 className="text-6xl font-black leading-tight tracking-tight">Internships that feel like real work.</h2>
            <div className="mt-8 grid gap-3">
              {["Curated tracks", "Guided project work", "Application tracking"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 font-bold backdrop-blur">
                  <CheckCircle2 size={18} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
