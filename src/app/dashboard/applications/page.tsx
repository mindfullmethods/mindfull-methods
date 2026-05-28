import { BriefcaseBusiness, ExternalLink, FileText, Mail, UserRound } from "lucide-react";

import ApplicationStatusControl from "@/components/components/dashboard/ApplicationStatusControl";
import ApplicationsSchemaBanner from "@/components/components/dashboard/ApplicationsSchemaBanner";
import ExportCsvButton from "@/components/components/dashboard/ExportCsvButton";
import { getApplications } from "@/Services/getApplications";
import { requireAdmin } from "@/lib/auth";
import { isApplicationsStatusReady } from "@/lib/applications-schema";

function statusClass(status?: string | null) {
  if (status === "Approved") return "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300";
  if (status === "Rejected") return "bg-red-50 text-red-700 dark:bg-red-400/10 dark:text-red-300";
  if (status === "Submitted") return "bg-sky-50 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300";
  return "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300";
}

export default async function ApplicationsPage() {
  await requireAdmin();
  const [applications, schemaReady] = await Promise.all([getApplications(), isApplicationsStatusReady()]);

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-zinc-500">Applications Dashboard</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Student applications</h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              Review applicants, update status, and keep every submission organized for admin decisions.
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            {applications.length > 0 ? (
              <ExportCsvButton href="/api/admin/export/applications" label="Export CSV" />
            ) : null}
            <div className="rounded-2xl bg-zinc-950 px-6 py-4 text-white dark:bg-white dark:text-zinc-950">
              <p className="text-xs font-black uppercase tracking-[0.2em] opacity-60">Total</p>
              <p className="mt-1 text-4xl font-black">{applications.length}</p>
            </div>
          </div>
        </div>
      </section>

      {!schemaReady ? <ApplicationsSchemaBanner /> : null}

      <section className="mt-8">
        {applications.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-white/10 dark:bg-white/5">
            <FileText className="mx-auto text-zinc-400" size={40} />
            <h2 className="mt-5 text-3xl font-black">No applications yet</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-500">
              Student applications will appear here after they apply from the internships catalog.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {applications.map((application) => (
              <article
                key={application.id}
                className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-6"
              >
                <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                        <UserRound size={15} />
                        Student
                      </p>
                      <h2 className="mt-2 text-xl font-black">
                        {application.student_name || "Dashboard applicant"}
                      </h2>
                    </div>
                    <div>
                      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                        <Mail size={15} />
                        Email
                      </p>
                      <p className="mt-2 text-sm font-bold text-zinc-600 dark:text-zinc-300">
                        {application.email || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                        <BriefcaseBusiness size={15} />
                        Internship
                      </p>
                      <p className="mt-2 text-sm font-bold text-zinc-600 dark:text-zinc-300">
                        {application.internship?.title ?? "—"}
                      </p>
                      {application.internship?.company ? (
                        <p className="mt-1 text-xs text-zinc-500">{application.internship.company}</p>
                      ) : null}
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Current status</p>
                      <span
                        className={`mt-2 inline-flex rounded-full px-3 py-2 text-xs font-black ${statusClass(application.status)}`}
                      >
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
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-black text-white transition hover:scale-[1.01] dark:bg-white dark:text-zinc-950"
                      >
                        View Resume
                        <ExternalLink size={16} />
                      </a>
                    ) : null}
                    <ApplicationStatusControl
                      applicationId={application.id}
                      currentStatus={application.status}
                      disabled={!schemaReady}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
