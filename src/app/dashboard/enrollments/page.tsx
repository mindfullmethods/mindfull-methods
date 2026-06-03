import { GraduationCap } from "lucide-react";

import DashboardPageHeader from "@/components/components/dashboard/DashboardPageHeader";
import EnrollmentsAdminPanel from "@/components/components/dashboard/EnrollmentsAdminPanel";
import EnrollmentsSchemaBanner from "@/components/components/dashboard/EnrollmentsSchemaBanner";
import ExportCsvButton from "@/components/components/dashboard/ExportCsvButton";
import ManualEnrollmentForm from "@/components/components/dashboard/ManualEnrollmentForm";
import { getAllEnrollments } from "@/Services/admin-enrollments";
import { getAdminProgressForEnrollments } from "@/Services/admin-course-progress";
import { requireAdmin } from "@/lib/auth";
import { isEnrollmentsTableReady } from "@/lib/enrollments-schema";
import { isCourseProgressTableReady } from "@/lib/course-progress-schema";

function formatAmount(paise: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

export default async function AdminEnrollmentsPage() {
  await requireAdmin();
  const tableReady = await isEnrollmentsTableReady();
  const progressReady = await isCourseProgressTableReady();
  const enrollments = tableReady ? await getAllEnrollments() : [];
  const progressMap =
    tableReady && progressReady && enrollments.length > 0
      ? await getAdminProgressForEnrollments(enrollments)
      : new Map();

  const paidEnrollments = enrollments.filter((e) => e.status === "paid");
  const revenue = paidEnrollments.reduce((sum, e) => sum + e.amount_paise, 0);

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <DashboardPageHeader
        eyebrow="Enrollments"
        title="Paid course enrollments"
        description="Filter by course, track student progress, mark courses complete, resend receipts, and handle refunds."
      >
        <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-end">
          {enrollments.length > 0 ? (
            <ExportCsvButton href="/api/admin/export/enrollments" label="Export CSV" />
          ) : null}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-zinc-950 px-6 py-4 text-white dark:bg-white dark:text-zinc-950">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">Paid</p>
              <p className="mt-1 text-3xl font-bold">{paidEnrollments.length}</p>
            </div>
            <div className="rounded-2xl bg-violet-600 px-6 py-4 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">Revenue</p>
              <p className="mt-1 text-3xl font-bold">{formatAmount(revenue)}</p>
            </div>
          </div>
        </div>
      </DashboardPageHeader>

      {!tableReady ? (
        <div className="mt-8">
          <EnrollmentsSchemaBanner />
        </div>
      ) : null}

      {tableReady ? <ManualEnrollmentForm /> : null}

      {enrollments.length === 0 ? (
        <div className="mt-8 mm-card-premium rounded-3xl border border-dashed p-12 text-center">
          <GraduationCap className="mx-auto text-zinc-400" size={40} />
          <h2 className="mt-5 text-3xl font-bold mm-heading">No enrollments yet</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 mm-muted">
            Enrollments appear here after students pay on a course page.
          </p>
        </div>
      ) : (
        <div className="mt-8">
          <EnrollmentsAdminPanel
            enrollments={enrollments}
            progressMap={progressMap}
            progressReady={progressReady}
          />
        </div>
      )}
    </main>
  );
}
