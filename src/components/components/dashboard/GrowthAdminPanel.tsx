"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Download, Mail, Trash2, Users } from "lucide-react";

import { notifyWaitlistForCourseAction } from "@/actions/notifyWaitlist";
import { removeWaitlistEntryAction } from "@/actions/removeWaitlistEntry";
import type { GrowthSummary } from "@/Services/admin-growth";
import { getCourseBySlug } from "@/lib/courses";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function GrowthAdminPanel({ summary }: { summary: GrowthSummary }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseFilter = searchParams.get("course") ?? "";
  const [notifyCourse, setNotifyCourse] = useState(
    courseFilter || (summary.waitlistByCourse[0]?.course_slug ?? "")
  );
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  if (!summary.tableReady) {
    return (
      <p className="mm-section-panel text-sm font-semibold text-amber-800 dark:text-amber-200">
        Run <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">supabase/v2-platform-extensions.sql</code> to
        enable waitlist, newsletter, and checkout tracking.
      </p>
    );
  }

  function applyCourseFilter(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("course", slug);
    else params.delete("course");
    router.push(`/dashboard/growth?${params.toString()}`);
  }

  function sendWaitlistEmails() {
    if (!notifyCourse) {
      setMessage("Choose a course first.");
      return;
    }
    setMessage("");
    startTransition(async () => {
      const result = await notifyWaitlistForCourseAction(notifyCourse);
      setMessage(result.ok ? `Sent ${result.sent} email(s) for ${notifyCourse}.` : result.error);
    });
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Waitlist signups", value: summary.waitlistTotal },
          { label: "Newsletter subscribers", value: summary.newsletterTotal },
          { label: "Open checkouts", value: summary.openCheckouts },
          { label: "Paid (7 days)", value: summary.completedCheckoutsLast7d },
        ].map((stat) => (
          <div key={stat.label} className="mm-card-premium p-5">
            <p className="text-xs font-semibold uppercase tracking-wider mm-subtle">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold mm-heading">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="mm-section-panel">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold mm-heading">Waitlist by course</h2>
          <a
            href={`/api/admin/export/waitlist${courseFilter ? `?course=${encodeURIComponent(courseFilter)}` : ""}`}
            className="inline-flex items-center gap-2 rounded-xl border mm-border px-4 py-2 text-sm font-bold mm-heading"
          >
            <Download size={16} />
            Export CSV
          </a>
        </div>
        <ul className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => applyCourseFilter("")}
            className={`rounded-full px-3 py-1 text-xs font-bold ${!courseFilter ? "bg-violet-600 text-white" : "border mm-border mm-heading"}`}
          >
            All
          </button>
          {summary.waitlistByCourse.map((row) => (
            <button
              key={row.course_slug}
              type="button"
              onClick={() => applyCourseFilter(row.course_slug)}
              className={`rounded-full px-3 py-1 text-xs font-bold ${courseFilter === row.course_slug ? "bg-violet-600 text-white" : "border mm-border mm-heading"}`}
            >
              {getCourseBySlug(row.course_slug)?.title ?? row.course_slug} ({row.count})
            </button>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="block flex-1">
            <span className="text-sm font-semibold mm-heading">Notify waitlist — seats open</span>
            <select
              value={notifyCourse}
              onChange={(e) => setNotifyCourse(e.target.value)}
              disabled={isPending}
              className="mt-2 mm-input w-full"
            >
              <option value="">Select course</option>
              {summary.waitlistByCourse.map((row) => (
                <option key={row.course_slug} value={row.course_slug}>
                  {getCourseBySlug(row.course_slug)?.title ?? row.course_slug} ({row.count})
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={sendWaitlistEmails}
            disabled={isPending || !notifyCourse}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
          >
            <Mail size={16} />
            {isPending ? "Sending…" : "Email waitlist"}
          </button>
        </div>
        {message ? <p className="mt-3 text-sm font-semibold text-violet-600 dark:text-violet-300">{message}</p> : null}

        <ul className="mt-6 divide-y mm-border">
          {summary.waitlist.map((row) => (
            <li key={row.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
              <span>
                <span className="font-bold">{row.full_name ?? row.email}</span>
                <span className="text-zinc-500">
                  {" "}
                  · {getCourseBySlug(row.course_slug)?.title ?? row.course_slug} · {row.email} ·{" "}
                  {formatDate(row.created_at)}
                </span>
              </span>
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  if (!confirm(`Remove ${row.email} from the waitlist?`)) return;
                  startTransition(async () => {
                    const result = await removeWaitlistEntryAction(row.id);
                    setMessage(result.ok ? "Removed from waitlist." : result.error);
                    router.refresh();
                  });
                }}
                className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50 disabled:opacity-60"
                aria-label="Remove from waitlist"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
          {!summary.waitlist.length ? <li className="py-4 text-sm text-zinc-500">No waitlist entries yet.</li> : null}
        </ul>
      </section>

      <section className="mm-section-panel">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold mm-heading">Newsletter subscribers</h2>
          <a
            href="/api/admin/export/newsletter"
            className="inline-flex items-center gap-2 rounded-xl border mm-border px-4 py-2 text-sm font-bold mm-heading"
          >
            <Download size={16} />
            Export CSV
          </a>
        </div>
        <ul className="mt-4 divide-y mm-border">
          {summary.newsletter.map((row) => (
            <li key={row.id} className="flex flex-wrap items-baseline justify-between gap-2 py-3 text-sm">
              <span className="font-bold">{row.email}</span>
              <span className="text-zinc-500">
                {row.source ?? "footer"} · {formatDate(row.created_at)}
              </span>
            </li>
          ))}
          {!summary.newsletter.length ? (
            <li className="py-4 text-sm text-zinc-500">No subscribers yet — footer signup on the marketing site.</li>
          ) : null}
        </ul>
      </section>

      <p className="text-sm text-zinc-500">
        <Users size={14} className="mr-1 inline" />
        Abandoned checkout recovery runs daily via cron — see{" "}
        <Link href="/dashboard/setup" className="font-bold text-violet-600 dark:text-violet-300">
          Launch setup
        </Link>
        .
      </p>
    </div>
  );
}
