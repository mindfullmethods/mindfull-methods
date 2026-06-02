"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Award, CheckCircle2, XCircle } from "lucide-react";

import { approveCompletionVerification, rejectCompletionVerification } from "@/actions/completionVerification";
import AnalyticsChart from "@/components/components/dashboard/AnalyticsChart";
import type { AdminAnalytics } from "@/Services/admin-analytics";

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
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-black">{review.courseTitle}</p>
        <p className="text-sm text-zinc-500">
          Requested {formatDate(review.requestedAt)} ·{" "}
          <Link href={`/dashboard/users/${review.userId}`} className="font-bold text-violet-600 hover:underline">
            View student
          </Link>
        </p>
        {message ? <p className="mt-2 text-xs font-bold text-violet-600">{message}</p> : null}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              const result = await approveCompletionVerification(review.userId, review.courseSlug);
              setMessage(result.ok ? `Approved · ${result.certificateId ?? ""}` : result.error);
            });
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-black text-white disabled:opacity-60"
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
          className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-black text-red-600 disabled:opacity-60"
        >
          <XCircle size={14} />
          Reject
        </button>
      </div>
    </div>
  );
}

export default function AdminAnalyticsPanel({ analytics }: { analytics: AdminAnalytics }) {
  const {
    totals,
    applicationsByDay,
    enrollmentsByDay,
    revenueByDay,
    applicationStatuses,
    enrollmentsByCourse,
    revenueByCourse,
    pendingReviews,
  } = analytics;
  const statusMax = Math.max(1, ...applicationStatuses.map((s) => s.value));
  const courseMax = Math.max(1, ...enrollmentsByCourse.map((s) => s.value));
  const revenueMax = Math.max(1, ...revenueByCourse.map((s) => s.value));

  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Applications", value: totals.applications, helper: `${totals.pendingApplications} pending` },
          { label: "Paid enrollments", value: totals.paidEnrollments, helper: `${totals.inquiries} inquiries total` },
          { label: "Revenue", value: formatAmount(totals.revenuePaise), helper: `${totals.inquiryToEnrollmentRate}% inquiry → enrolled` },
          { label: "Certificates", value: totals.certificatesIssued, helper: `${totals.pendingCertificateReviews} pending review` },
        ].map((card) => (
          <article
            key={card.label}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5"
          >
            <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">{card.label}</p>
            <p className="mt-3 text-3xl font-black">{card.value}</p>
            <p className="mt-2 text-sm text-zinc-500">{card.helper}</p>
          </article>
        ))}
      </section>

      {pendingReviews.length > 0 ? (
        <section className="rounded-3xl border border-violet-200 bg-violet-50 p-6 shadow-sm dark:border-violet-400/20 dark:bg-violet-400/10">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-violet-700 dark:text-violet-300">
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

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <h2 className="text-xl font-black">Applications — last 7 days</h2>
          <div className="mt-6">
            <AnalyticsChart data={applicationsByDay} emptyLabel="No applications this week" />
          </div>
        </div>
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <h2 className="text-xl font-black">Enrollments — last 7 days</h2>
          <div className="mt-6">
            <AnalyticsChart data={enrollmentsByDay} emptyLabel="No enrollments this week" barClassName="bg-violet-600" />
          </div>
        </div>
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <h2 className="text-xl font-black">Revenue — last 7 days (₹)</h2>
          <div className="mt-6">
            <AnalyticsChart data={revenueByDay} emptyLabel="No revenue this week" barClassName="bg-emerald-600" />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <h2 className="text-xl font-black">Enrollments by course</h2>
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
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <h2 className="text-xl font-black">Revenue by course (₹)</h2>
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

      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
        <h2 className="text-xl font-black">Application status breakdown</h2>
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
