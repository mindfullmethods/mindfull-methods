"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Award, CheckCircle2, Download, XCircle } from "lucide-react";

import { approveCompletionVerification, rejectCompletionVerification } from "@/actions/completionVerification";
import { formatCertificateId } from "@/lib/certificates";
import AnalyticsChart from "@/components/components/dashboard/AnalyticsChart";
import type { AdminAnalytics } from "@/Services/admin-analytics";
import type { PromoUsageStat } from "@/lib/promo-analytics";

function formatAmount(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function PendingReviewRow({
  review,
}: {
  review: AdminAnalytics["pendingReviews"][number];
}) {
  const [message, setMessage] = useState("");
  const [approvedId, setApprovedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const previewCertId = formatCertificateId(review.userId, review.courseSlug);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-bold">{review.courseTitle}</p>
        <p className="text-sm text-zinc-500">
          Requested {formatDate(review.requestedAt)} ·{" "}
          <Link href={`/dashboard/users/${review.userId}`} className="font-bold text-violet-600 hover:underline">
            View student
          </Link>
        </p>
        {message ? <p className="mt-2 text-xs font-bold text-violet-600">{message}</p> : null}
        {approvedId ? (
          <a
            href={`/api/certificates/${encodeURIComponent(approvedId)}/pdf`}
            download
            className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
          >
            <Download size={12} />
            Preview certificate PDF
          </a>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              const result = await approveCompletionVerification(review.userId, review.courseSlug);
              if (result.ok) {
                setApprovedId(result.certificateId ?? previewCertId);
                setMessage("Approved — certificate issued.");
              } else {
                setMessage(result.error);
              }
            });
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
        >
          <CheckCircle2 size={14} />
          Approve
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              const result = await rejectCompletionVerification(review.userId, review.courseSlug);
              setMessage(result.ok ? "Rejected." : result.error);
            });
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-600 disabled:opacity-60"
        >
          <XCircle size={14} />
          Reject
        </button>
      </div>
    </div>
  );
}

export default function AdminAnalyticsPanel({
  analytics,
  promoUsage = [],
}: {
  analytics: AdminAnalytics;
  promoUsage?: PromoUsageStat[];
}) {
  const {
    totals,
    applicationsByDay,
    enrollmentsByDay,
    revenueByDay,
    applicationStatuses,
    enrollmentsByCourse,
    revenueByCourse,
    pendingReviews,
    funnel,
  } = analytics;
  const statusMax = Math.max(1, ...applicationStatuses.map((s) => s.value));
  const courseMax = Math.max(1, ...enrollmentsByCourse.map((s) => s.value));
  const revenueMax = Math.max(1, ...revenueByCourse.map((s) => s.value));

  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Applications", value: totals.applications, helper: `${totals.applicationApprovalRate}% approved · ${totals.pendingApplications} pending` },
          { label: "Paid enrollments", value: totals.paidEnrollments, helper: `${totals.complimentaryEnrollments} complimentary grants` },
          { label: "Revenue", value: formatAmount(totals.revenuePaise), helper: `Avg order ${formatAmount(totals.avgOrderValuePaise)}` },
          { label: "Certificates", value: totals.certificatesIssued, helper: `${totals.pendingCertificateReviews} pending review` },
        ].map((card) => (
          <article
            key={card.label}
            className="mm-metric-glow p-5"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">{card.label}</p>
            <p className="mt-3 text-3xl font-bold">{card.value}</p>
            <p className="mt-2 text-sm text-zinc-500">{card.helper}</p>
          </article>
        ))}
      </section>

      <section className="mm-section-panel">
        <h2 className="text-xl font-bold">Platform funnel</h2>
        <p className="mt-2 text-sm mm-muted">Snapshot across inquiries, enrollments, applications, and certificates.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {funnel.map((step) => (
            <article key={step.label} className="rounded-2xl border mm-border bg-zinc-50/50 p-4 dark:bg-white/[0.02]">
              <p className="text-xs font-bold uppercase tracking-[0.18em] mm-subtle">{step.label}</p>
              <p className="mt-2 text-3xl font-bold">{step.value}</p>
              <p className="mt-2 text-xs leading-5 mm-muted">{step.hint}</p>
            </article>
          ))}
        </div>
      </section>

      {promoUsage.length > 0 ? (
        <section className="mm-section-panel">
          <h2 className="text-xl font-bold">Promo code usage</h2>
          <p className="mt-2 text-sm mm-muted">From checkout intents (requires v3 migration for promo_code column).</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {promoUsage.map((row) => (
              <li
                key={row.code}
                className="rounded-full border mm-border px-3 py-1.5 text-sm font-bold mm-heading"
              >
                {row.code}: {row.completed}/{row.checkouts} completed
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {pendingReviews.length > 0 ? (
        <section className="mm-section-panel border-violet-200 bg-violet-50/80 dark:border-violet-400/20 dark:bg-violet-400/10">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-700 dark:text-violet-300">
            <Award size={14} />
            Pending certificate reviews
          </p>
          <div className="mt-4 space-y-3">
            {pendingReviews.map((review) => (
              <PendingReviewRow key={`${review.userId}-${review.courseSlug}`} review={review} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-6">
        <div className="mm-section-panel">
          <h2 className="text-xl font-bold">Applications — last 14 days</h2>
          <p className="mt-1 text-xs mm-muted">Scroll horizontally on smaller screens to see all days.</p>
          <div className="mt-4">
            <AnalyticsChart data={applicationsByDay} emptyLabel="No applications in this period" />
          </div>
        </div>
        <div className="mm-section-panel">
          <h2 className="text-xl font-bold">Enrollments — last 14 days</h2>
          <p className="mt-1 text-xs mm-muted">Scroll horizontally on smaller screens to see all days.</p>
          <div className="mt-4">
            <AnalyticsChart
              data={enrollmentsByDay}
              emptyLabel="No enrollments in this period"
              barClassName="bg-violet-600"
            />
          </div>
        </div>
        <div className="mm-section-panel">
          <h2 className="text-xl font-bold">Revenue — last 14 days (₹)</h2>
          <p className="mt-1 text-xs mm-muted">Scroll horizontally on smaller screens to see all days.</p>
          <div className="mt-4">
            <AnalyticsChart
              data={revenueByDay}
              emptyLabel="No revenue in this period"
              barClassName="bg-emerald-600"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="mm-section-panel">
          <h2 className="text-xl font-bold">Enrollments by course</h2>
          <div className="mt-6 space-y-4">
            {enrollmentsByCourse.length === 0 ? (
              <p className="text-sm text-zinc-500">No paid enrollments yet.</p>
            ) : (
              enrollmentsByCourse.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm font-bold">
                    <span>{item.label}</span>
                    <span>
                      {item.value} · {formatAmount(item.revenuePaise)}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-violet-600"
                      style={{ width: `${Math.max(item.value > 0 ? 8 : 0, (item.value / courseMax) * 100)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="mm-section-panel">
          <h2 className="text-xl font-bold">Revenue by course (₹)</h2>
          <div className="mt-6 space-y-4">
            {revenueByCourse.length === 0 ? (
              <p className="text-sm text-zinc-500">No revenue yet.</p>
            ) : (
              revenueByCourse.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm font-bold">
                    <span>{item.label}</span>
                    <span>₹{item.value.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${Math.max(item.value > 0 ? 8 : 0, (item.value / revenueMax) * 100)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="mm-section-panel">
        <h2 className="text-xl font-bold">Application status breakdown</h2>
        <div className="mt-6 space-y-4">
          {applicationStatuses.map((item) => (
            <div key={item.label}>
              <div className="mb-2 flex items-center justify-between text-sm font-bold">
                <span>{item.label}</span>
                <span>{item.value}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                <div
                  className={`h-full rounded-full ${
                    item.label === "Approved"
                      ? "bg-emerald-500"
                      : item.label === "Rejected"
                        ? "bg-red-500"
                        : "bg-amber-500"
                  }`}
                  style={{ width: `${Math.max(item.value > 0 ? 8 : 0, (item.value / statusMax) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
