import { GraduationCap } from "lucide-react";

import EnrollmentsAdminPanel from "@/components/components/dashboard/EnrollmentsAdminPanel";
import EnrollmentsSchemaBanner from "@/components/components/dashboard/EnrollmentsSchemaBanner";
import ExportCsvButton from "@/components/components/dashboard/ExportCsvButton";
import ManualEnrollmentForm from "@/components/components/dashboard/ManualEnrollmentForm";
import { getAllEnrollments } from "@/Services/admin-enrollments";
import { requireAdmin } from "@/lib/auth";
import { isEnrollmentsTableReady } from "@/lib/enrollments-schema";

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
  const enrollments = tableReady ? await getAllEnrollments() : [];

  const paidEnrollments = enrollments.filter((e) => e.status === "paid");
  const revenue = paidEnrollments.reduce((sum, e) => sum + e.amount_paise, 0);

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-zinc-500">Enrollments</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Paid course enrollments</h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              Filter by course, resend receipts, and mark refunds when needed.
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            {enrollments.length > 0 ? (
              <ExportCsvButton href="/api/admin/export/enrollments" label="Export CSV" />
            ) : null}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-zinc-950 px-6 py-4 text-white dark:bg-white dark:text-zinc-950">
                <p className="text-xs font-black uppercase tracking-[0.2em] opacity-60">Paid</p>
                <p className="mt-1 text-3xl font-black">{paidEnrollments.length}</p>
              </div>
              <div className="rounded-2xl bg-violet-600 px-6 py-4 text-white">
                <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80">Revenue</p>
                <p className="mt-1 text-3xl font-black">{formatAmount(revenue)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {!tableReady ? <div className="mt-8"><EnrollmentsSchemaBanner /></div> : null}

      {tableReady ? <ManualEnrollmentForm /> : null}

      {enrollments.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-white/10 dark:bg-white/5">
          <GraduationCap className="mx-auto text-zinc-400" size={40} />
          <h2 className="mt-5 text-3xl font-black">No enrollments yet</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-500">
            Enrollments appear here after students pay on a course page.
          </p>
        </div>
      ) : (
        <EnrollmentsAdminPanel enrollments={enrollments} />
      )}
    </main>
  );
}
