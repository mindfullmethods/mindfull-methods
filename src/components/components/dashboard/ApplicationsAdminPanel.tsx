"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { BriefcaseBusiness, ExternalLink, Mail, Search, UserRound } from "lucide-react";

import ApplicationStatusControl from "@/components/components/dashboard/ApplicationStatusControl";
import {
  bulkUpdateApplicationStatus,
} from "@/actions/bulkUpdateApplicationStatus";
import type { ApplicationStatus } from "@/actions/updateApplicationStatus";
import type { AdminApplication } from "@/Services/getApplications";
import type { ApplicationsSchemaIssue } from "@/lib/applications-schema";

const statusFilters = ["All", "Pending", "Submitted", "Approved", "Rejected", "Withdrawn"] as const;

function statusClass(status?: string | null) {
  if (status === "Approved") return "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300";
  if (status === "Rejected") return "bg-red-50 text-red-700 dark:bg-red-400/10 dark:text-red-300";
  if (status === "Withdrawn") return "bg-zinc-100 text-zinc-600 dark:bg-white/10 dark:text-zinc-400";
  if (status === "Submitted") return "bg-sky-50 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300";
  return "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300";
}

export default function ApplicationsAdminPanel({
  applications,
  schemaIssue,
}: {
  applications: AdminApplication[];
  schemaIssue: ApplicationsSchemaIssue | null;
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof statusFilters)[number]>("All");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkError, setBulkError] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return applications.filter((app) => {
      const status = app.status ?? "Pending";
      const statusMatch =
        statusFilter === "All" ||
        status === statusFilter ||
        (statusFilter === "Pending" && status === "Submitted");
      if (!statusMatch) return false;
      if (!q) return true;
      return (
        app.student_name?.toLowerCase().includes(q) ||
        app.email?.toLowerCase().includes(q) ||
        app.internship?.title?.toLowerCase().includes(q) ||
        app.internship?.company?.toLowerCase().includes(q)
      );
    });
  }, [applications, query, statusFilter]);

  function toggleAll(checked: boolean) {
    setSelected(checked ? new Set(filtered.map((a) => a.id)) : new Set());
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function runBulk(status: ApplicationStatus) {
    setBulkError("");
    startTransition(async () => {
      const result = await bulkUpdateApplicationStatus([...selected], status);
      if (!result.ok) {
        setBulkError(result.error);
        return;
      }
      setSelected(new Set());
    });
  }

  const disabled = Boolean(schemaIssue);

  return (
    <>
      <div className="mm-section-panel flex flex-col gap-4">
        <div className="relative">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, internship…"
            className="w-full rounded-2xl border border-zinc-200 bg-[#f7f8f5] py-3 pl-11 pr-4 text-sm font-semibold outline-none dark:border-white/10 dark:bg-zinc-950"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {statusFilters.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={
                statusFilter === s
                  ? "rounded-xl bg-zinc-950 px-4 py-2 text-sm font-bold text-white dark:bg-white dark:text-zinc-950"
                  : "rounded-xl border border-zinc-200 px-4 py-2 text-sm font-bold text-zinc-600 dark:border-white/15 dark:text-white/70"
              }
            >
              {s}
            </button>
          ))}
          <span className="ml-auto text-sm font-bold text-zinc-500">{filtered.length} shown</span>
        </div>
        {selected.size > 0 ? (
          <div className="flex flex-wrap items-center gap-2 border-t border-zinc-200 pt-4 dark:border-white/10">
            <span className="text-sm font-bold">{selected.size} selected</span>
            {(["Approved", "Rejected", "Pending"] as ApplicationStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                disabled={disabled || isPending}
                onClick={() => runBulk(s)}
                className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
              >
                Mark {s}
              </button>
            ))}
            {bulkError ? <p className="text-sm font-bold text-red-600">{bulkError}</p> : null}
          </div>
        ) : null}
      </div>

      <section className="mt-6">
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-white/10 dark:bg-white/5">
            <p className="text-sm font-bold text-zinc-500">No applications match your filters.</p>
          </div>
        ) : (
          <div className="mb-3 flex items-center gap-2">
            <input
              type="checkbox"
              checked={selected.size === filtered.length && filtered.length > 0}
              onChange={(e) => toggleAll(e.target.checked)}
              className="h-4 w-4 rounded"
            />
            <span className="text-xs font-bold text-zinc-500">Select all on this page</span>
          </div>
        )}
        <div className="grid gap-4">
          {filtered.map((application) => (
            <article
              key={application.id}
              className="rounded-2xl border mm-border bg-zinc-50/80 p-5 dark:bg-white/[0.02] sm:p-6"
            >
              <div className="grid gap-6 lg:grid-cols-[auto_1fr_auto] lg:items-start">
                <input
                  type="checkbox"
                  checked={selected.has(application.id)}
                  onChange={() => toggleOne(application.id)}
                  className="mt-2 h-4 w-4 rounded"
                />
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                      <UserRound size={15} />
                      Student
                    </p>
                    <h2 className="mt-2 text-xl font-bold">{application.student_name || "Dashboard applicant"}</h2>
                  </div>
                  <div>
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                      <Mail size={15} />
                      Email
                    </p>
                    <p className="mt-2 text-sm font-bold text-zinc-600 dark:text-zinc-300">{application.email || "—"}</p>
                  </div>
                  <div>
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                      <BriefcaseBusiness size={15} />
                      Internship
                    </p>
                    <p className="mt-2 text-sm font-bold text-zinc-600 dark:text-zinc-300">
                      {application.internship?.title ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Current status</p>
                    <span className={`mt-2 inline-flex rounded-full px-3 py-2 text-xs font-bold ${statusClass(application.status)}`}>
                      {application.status || "Pending"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-4 lg:items-end">
                  {application.resume ? (
                    <a
                      href={application.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-bold text-white dark:bg-white dark:text-zinc-950"
                    >
                      View Resume <ExternalLink size={16} />
                    </a>
                  ) : null}
                  <ApplicationStatusControl
                    applicationId={application.id}
                    currentStatus={application.status}
                    disabled={disabled}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
