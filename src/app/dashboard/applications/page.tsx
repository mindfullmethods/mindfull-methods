import { FileText } from "lucide-react";

import ApplicationsAdminPanel from "@/components/components/dashboard/ApplicationsAdminPanel";
import ApplicationsSchemaBanner from "@/components/components/dashboard/ApplicationsSchemaBanner";
import DashboardPageHeader from "@/components/components/dashboard/DashboardPageHeader";
import ExportCsvButton from "@/components/components/dashboard/ExportCsvButton";
import { getApplications } from "@/Services/getApplications";
import { requireAdmin } from "@/lib/auth";
import { getApplicationsSchemaIssue } from "@/lib/applications-schema";

export default async function ApplicationsPage() {
  await requireAdmin();
  const [applications, schemaIssue] = await Promise.all([getApplications(), getApplicationsSchemaIssue()]);

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <DashboardPageHeader
        eyebrow="Applications"
        title="Student applications"
        description="Search, filter, bulk-update status, and export — all internship submissions in one place."
      >
        <div className="mt-6 flex flex-wrap items-end gap-3">
          {applications.length > 0 ? (
            <ExportCsvButton href="/api/admin/export/applications" label="Export CSV" />
          ) : null}
          <div className="rounded-2xl bg-zinc-950 px-6 py-4 text-white dark:bg-white dark:text-zinc-950">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">Total</p>
            <p className="mt-1 text-4xl font-bold">{applications.length}</p>
          </div>
        </div>
      </DashboardPageHeader>

      {schemaIssue ? (
        <div className="mt-8">
          <ApplicationsSchemaBanner issue={schemaIssue} />
        </div>
      ) : null}

      {applications.length === 0 ? (
        <div className="mt-8 mm-card-premium rounded-3xl border border-dashed p-12 text-center">
          <FileText className="mx-auto text-zinc-400" size={40} />
          <h2 className="mt-5 text-3xl font-bold mm-heading">No applications yet</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 mm-muted">
            Student applications will appear here after they apply from the internships catalog.
          </p>
        </div>
      ) : (
        <div className="mt-8">
          <ApplicationsAdminPanel applications={applications} schemaIssue={schemaIssue} />
        </div>
      )}
    </main>
  );
}
