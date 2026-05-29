import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, Rocket } from "lucide-react";

import { requireAdmin } from "@/lib/auth";
import { getPlatformSetupChecks, getSetupProgress } from "@/lib/platform-setup";

export default async function LaunchSetupPage() {
  await requireAdmin();
  const checks = await getPlatformSetupChecks();
  const progress = getSetupProgress(checks);

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <section className="rounded-3xl bg-zinc-950 p-6 text-white shadow-xl sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-white/50">Launch setup</p>
        <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
              Everything to finish before you go live.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              Checklist for email, payments, domain, and Supabase tables. Complete these before your final push to
              production.
            </p>
          </div>
          <div className="rounded-2xl bg-violet-600 px-6 py-4 text-white">
            <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80">Ready</p>
            <p className="mt-1 text-4xl font-black">
              {progress.ready}/{progress.total}
            </p>
            <p className="mt-1 text-sm font-bold opacity-90">{progress.percent}% complete</p>
          </div>
        </div>
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-400 to-teal-300 transition-all"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      </section>

      <section className="mt-8 grid gap-4">
        {checks.map((check) => (
          <article
            key={check.id}
            className={`rounded-3xl border p-5 sm:p-6 ${
              check.ready
                ? "border-emerald-200 bg-emerald-50 dark:border-emerald-400/20 dark:bg-emerald-400/10"
                : "border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5"
            }`}
          >
            <div className="flex items-start gap-4">
              {check.ready ? (
                <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={22} />
              ) : (
                <Circle className="mt-0.5 shrink-0 text-zinc-400" size={22} />
              )}
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-black">{check.label}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{check.detail}</p>
                {check.action && !check.ready ? (
                  <p className="mt-3 text-sm font-bold text-violet-700 dark:text-violet-300">→ {check.action}</p>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 dark:border-white/10 dark:bg-white/5 sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
              <Rocket size={14} />
              When all checks are green
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Connect your domain, set production env vars on Vercel, run a smoke test, then push to deploy.
            </p>
          </div>
          <Link
            href="/dashboard/inquiries"
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-black text-white dark:bg-white dark:text-zinc-950"
          >
            View contact inquiries
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
