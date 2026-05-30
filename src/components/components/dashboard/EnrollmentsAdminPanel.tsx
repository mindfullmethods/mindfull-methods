"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { BookOpen, CreditCard, Mail, Search, UserRound } from "lucide-react";

import { markEnrollmentRefunded, resendEnrollmentReceipt } from "@/actions/adminEnrollments";
import { getCourses } from "@/lib/courses";
import type { AdminEnrollment } from "@/Services/admin-enrollments";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatAmount(paise: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

export default function EnrollmentsAdminPanel({ enrollments }: { enrollments: AdminEnrollment[] }) {
  const courses = getCourses();
  const [query, setQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enrollments.filter((e) => {
      if (courseFilter !== "All" && e.course_slug !== courseFilter) return false;
      if (!q) return true;
      return (
        e.student_name?.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q) ||
        e.course_title.toLowerCase().includes(q)
      );
    });
  }, [enrollments, query, courseFilter]);

  function runAction(action: "refund" | "receipt", id: string) {
    setMessage("");
    startTransition(async () => {
      const result =
        action === "refund" ? await markEnrollmentRefunded(id) : await resendEnrollmentReceipt(id);
      if (!result.ok) {
        setMessage(result.error);
        return;
      }
      setMessage(action === "refund" ? "Marked as refunded." : "Receipt email sent.");
    });
  }

  return (
    <>
      <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-white/5 sm:p-5">
        <div className="relative">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search student, email, course…"
            className="w-full rounded-2xl border border-zinc-200 bg-[#f7f8f5] py-3 pl-11 pr-4 text-sm font-semibold outline-none dark:border-white/10 dark:bg-zinc-950"
          />
        </div>
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 bg-[#f7f8f5] px-4 py-3 text-sm font-bold dark:border-white/10 dark:bg-zinc-950 sm:max-w-xs"
        >
          <option value="All">All courses</option>
          {courses.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.title}
            </option>
          ))}
        </select>
        {message ? <p className="text-sm font-bold text-violet-700 dark:text-violet-300">{message}</p> : null}
      </div>

      <section className="mt-6 grid gap-4">
        {filtered.map((enrollment) => (
          <article
            key={enrollment.id}
            className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-6"
          >
            <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                    <UserRound size={15} /> Student
                  </p>
                  <p className="mt-2 font-black">{enrollment.student_name ?? "Guest checkout"}</p>
                  <p className="mt-1 flex items-center gap-1 text-sm text-zinc-500">
                    <Mail size={13} /> {enrollment.email ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                    <BookOpen size={15} /> Course
                  </p>
                  <p className="mt-2 font-black">{enrollment.course_title}</p>
                  <Link href={`/courses/${enrollment.course_slug}`} className="mt-1 text-sm font-bold text-violet-600 dark:text-violet-300">
                    View course →
                  </Link>
                </div>
                <div>
                  <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                    <CreditCard size={15} /> Payment
                  </p>
                  <p className="mt-2 text-xl font-black">{formatAmount(enrollment.amount_paise, enrollment.currency)}</p>
                  <p className="mt-1 text-xs text-zinc-500">{formatDate(enrollment.created_at)}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Status</p>
                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-2 text-xs font-black ${
                      enrollment.status === "refunded"
                        ? "bg-red-50 text-red-700 dark:bg-red-400/10 dark:text-red-300"
                        : "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
                    }`}
                  >
                    {enrollment.status}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={isPending || enrollment.status === "refunded"}
                  onClick={() => runAction("receipt", enrollment.id)}
                  className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-black disabled:opacity-60 dark:border-white/15"
                >
                  Resend receipt
                </button>
                <button
                  type="button"
                  disabled={isPending || enrollment.status === "refunded"}
                  onClick={() => runAction("refund", enrollment.id)}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-black text-white disabled:opacity-60"
                >
                  Mark refunded
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
