import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, Rocket } from "lucide-react";

import DashboardPageHeader from "@/components/components/dashboard/DashboardPageHeader";
import { requireAdmin } from "@/lib/auth";
import { getPlatformSetupChecks, getSetupProgress } from "@/lib/platform-setup";

export default async function LaunchSetupPage() {
  await requireAdmin();
  const checks = await getPlatformSetupChecks();
  const progress = getSetupProgress(checks);

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <DashboardPageHeader
        variant="hero"
        eyebrow="Launch setup"
        title="Everything to finish before you go live."
        description="Checklist for email, payments, domain, and Supabase tables. Complete these before your final push to production."
      >
        <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10 lg:max-w-md">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-400 to-teal-300 transition-all"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <div className="rounded-2xl bg-violet-600 px-6 py-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">Ready</p>
            <p className="mt-1 text-4xl font-bold">
              {progress.ready}/{progress.total}
            </p>
            <p className="mt-1 text-sm font-semibold opacity-90">{progress.percent}% complete</p>
          </div>
        </div>
      </DashboardPageHeader>

      <section className="mt-8 grid gap-4">
        {checks.map((check) => (
          <article
            key={check.id}
            className={`mm-section-panel ${
              check.ready
                ? "border-emerald-200 bg-emerald-50/80 dark:border-emerald-400/20 dark:bg-emerald-400/10"
                : ""
            }`}
          >
            <div className="relative flex items-start gap-4">
              {check.ready ? (
                <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={22} />
              ) : (
                <Circle className="mt-0.5 shrink-0 text-zinc-400" size={22} />
              )}
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold mm-heading">{check.label}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{check.detail}</p>
                {check.action && !check.ready ? (
                  <p className="mt-3 text-sm font-bold text-violet-700 dark:text-violet-300">→ {check.action}</p>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-8 mm-section-panel">
        <p className="text-xs font-bold uppercase tracking-[0.2em] mm-subtle">Supabase SQL (local dev)</p>
        <p className="mt-2 text-sm leading-6 mm-muted">
          Run migrations in order in the Supabase SQL Editor. From your project root:{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs dark:bg-white/10">npm run setup:check</code>
        </p>
        <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm font-semibold mm-heading">
          {[
            "enrollments-schema.sql",
            "applications-status-only.sql",
            "course-progress-schema.sql",
            "contact-inquiries-schema.sql",
            "contact-inquiries-status.sql",
            "admin-dashboard-extensions.sql",
            "contact-inquiries-linked-enrollment.sql",
            "certificates-schema.sql",
            "completion-verifications-schema.sql",
            "content-cms-schema.sql",
            "storage-marketing-uploads.sql",
            "storage-resumes.sql",
          ].map((file) => (
            <li key={file}>
              <span className="font-mono text-xs text-violet-700 dark:text-violet-300">supabase/{file}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs mm-muted">
          Full guide: <span className="font-mono">docs/LOCAL_MIGRATIONS.md</span>
        </p>
      </section>

      <section className="mt-6 mm-section-panel flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] mm-subtle">
            <Rocket size={14} />
            When all checks are green
          </p>
          <p className="mt-2 text-sm leading-6 mm-muted">
            Run <code className="rounded bg-zinc-100 px-1 dark:bg-white/10">npm run smoke</code> locally, then connect
            domain and production env when you are ready to launch.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/admin/site"
            className="inline-flex items-center gap-2 rounded-xl border mm-border px-5 py-3 text-sm font-bold mm-heading"
          >
            Site & promos
          </Link>
          <Link
            href="/dashboard/inquiries"
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-bold text-white dark:bg-white dark:text-zinc-950"
          >
            Contact inquiries
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
