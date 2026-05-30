"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { Mail, MessageSquare, Phone, Search, UserRound } from "lucide-react";

import InquiryStatusControl from "@/components/components/dashboard/InquiryStatusControl";
import { updateInquiryNotes } from "@/actions/updateInquiryNotes";
import type { ContactInquiry } from "@/Services/contact-inquiries";
import type { AdminEnrollment } from "@/Services/admin-enrollments";

const statusFilters = ["All", "New", "Contacted", "Enrolled", "Closed"] as const;

function statusClass(status?: string | null) {
  if (status === "Enrolled") return "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300";
  if (status === "Closed") return "bg-zinc-100 text-zinc-700 dark:bg-white/10 dark:text-zinc-300";
  if (status === "Contacted") return "bg-sky-50 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300";
  return "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function InquiryNotes({ inquiryId, initialNotes }: { inquiryId: string; initialNotes?: string | null }) {
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function save() {
    setError("");
    setSaved(false);
    startTransition(async () => {
      const result = await updateInquiryNotes(inquiryId, notes);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSaved(true);
    });
  }

  return (
    <div className="mt-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Admin notes</p>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
        placeholder="Follow-up notes, call summary, next steps…"
        className="mt-2 w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-zinc-950"
      />
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={isPending}
          className="rounded-xl bg-zinc-950 px-4 py-2 text-xs font-black text-white disabled:opacity-60 dark:bg-white dark:text-zinc-950"
        >
          {isPending ? "Saving…" : "Save notes"}
        </button>
        {saved ? <span className="text-xs font-bold text-emerald-600">Saved</span> : null}
        {error ? <span className="text-xs font-bold text-red-600">{error}</span> : null}
      </div>
    </div>
  );
}

export default function InquiriesAdminPanel({
  inquiries,
  enrollments,
  statusReady,
}: {
  inquiries: ContactInquiry[];
  enrollments: AdminEnrollment[];
  statusReady: boolean;
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof statusFilters)[number]>("All");

  const enrollmentByEmail = useMemo(() => {
    const map = new Map<string, AdminEnrollment>();
    for (const e of enrollments) {
      if (e.email) map.set(e.email.toLowerCase(), e);
    }
    return map;
  }, [enrollments]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inquiries.filter((inquiry) => {
      const status = inquiry.status ?? "New";
      if (statusFilter !== "All" && status !== statusFilter) return false;
      if (!q) return true;
      return (
        inquiry.name.toLowerCase().includes(q) ||
        inquiry.email.toLowerCase().includes(q) ||
        (inquiry.interest_label ?? inquiry.interest).toLowerCase().includes(q)
      );
    });
  }, [inquiries, query, statusFilter]);

  return (
    <>
      <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-white/5 sm:p-5">
        <div className="relative">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, interest…"
            className="w-full rounded-2xl border border-zinc-200 bg-[#f7f8f5] py-3 pl-11 pr-4 text-sm font-semibold outline-none dark:border-white/10 dark:bg-zinc-950"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={
                statusFilter === s
                  ? "rounded-xl bg-zinc-950 px-4 py-2 text-sm font-black text-white dark:bg-white dark:text-zinc-950"
                  : "rounded-xl border border-zinc-200 px-4 py-2 text-sm font-black text-zinc-600 dark:border-white/15 dark:text-white/70"
              }
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <section className="mt-6 grid gap-4">
        {filtered.map((inquiry) => {
          const linkedEnrollment = enrollmentByEmail.get(inquiry.email.toLowerCase());
          return (
            <article
              key={inquiry.id}
              className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-6"
            >
              <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                      <UserRound size={15} /> Name
                    </p>
                    <h2 className="mt-2 text-xl font-black">{inquiry.name}</h2>
                  </div>
                  <div>
                    <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                      <Mail size={15} /> Email
                    </p>
                    <a href={`mailto:${inquiry.email}`} className="mt-2 inline-block text-sm font-bold text-violet-600 dark:text-violet-300">
                      {inquiry.email}
                    </a>
                    {inquiry.phone ? (
                      <p className="mt-2 flex items-center gap-1 text-sm text-zinc-500">
                        <Phone size={13} /> {inquiry.phone}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Interest</p>
                    <p className="mt-2 text-sm font-bold">{inquiry.interest_label ?? inquiry.interest}</p>
                    {linkedEnrollment ? (
                      <Link
                        href="/dashboard/enrollments"
                        className="mt-2 inline-block text-xs font-bold text-emerald-600 hover:underline"
                      >
                        Matched enrollment: {linkedEnrollment.course_title} →
                      </Link>
                    ) : null}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Status</p>
                    <span className={`mt-2 inline-flex rounded-full px-3 py-2 text-xs font-black ${statusClass(inquiry.status)}`}>
                      {inquiry.status ?? "New"}
                    </span>
                    <p className="mt-2 text-xs text-zinc-500">{formatDate(inquiry.created_at)}</p>
                  </div>
                </div>
                <InquiryStatusControl inquiryId={inquiry.id} currentStatus={inquiry.status} disabled={!statusReady} />
              </div>
              <div className="mt-5 rounded-2xl bg-[#f7f8f5] p-4 dark:bg-zinc-950">
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                  <MessageSquare size={14} /> Message
                </p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7">{inquiry.message}</p>
              </div>
              <InquiryNotes inquiryId={inquiry.id} initialNotes={inquiry.admin_notes} />
            </article>
          );
        })}
      </section>
    </>
  );
}
