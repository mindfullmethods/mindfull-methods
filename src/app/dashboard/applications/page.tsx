import { FileText } from "lucide-react";

import ApplicationsAdminPanel from "@/components/components/dashboard/ApplicationsAdminPanel";
import ApplicationsSchemaBanner from "@/components/components/dashboard/ApplicationsSchemaBanner";
import ExportCsvButton from "@/components/components/dashboard/ExportCsvButton";
import { getApplications } from "@/Services/getApplications";
import { requireAdmin } from "@/lib/auth";
import { getApplicationsSchemaIssue } from "@/lib/applications-schema";

export default async function ApplicationsPage() {
  await requireAdmin();
  const [applications, schemaIssue] = await Promise.all([getApplications(), getApplicationsSchemaIssue()]);

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-zinc-500">Applications Dashboard</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Student applications</h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              Search, filter, bulk-update status, and export — all internship submissions in one place.
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

      {schemaIssue ? <div className="mt-8"><ApplicationsSchemaBanner issue={schemaIssue} /></div> : null}

      {applications.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-white/10 dark:bg-white/5">
          <FileText className="mx-auto text-zinc-400" size={40} />
          <h2 className="mt-5 text-3xl font-black">No applications yet</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-500">
            Student applications will appear here after they apply from the internships catalog.
          </p>
        </div>
      ) : (
        <ApplicationsAdminPanel applications={applications} schemaIssue={schemaIssue} />
      )}
    </main>
  );
}
