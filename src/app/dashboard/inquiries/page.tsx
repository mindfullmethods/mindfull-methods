import { MessageSquare } from "lucide-react";

import ContactInquiriesSchemaBanner from "@/components/components/dashboard/ContactInquiriesSchemaBanner";
import ContactInquiriesStatusBanner from "@/components/components/dashboard/ContactInquiriesStatusBanner";
import ExportCsvButton from "@/components/components/dashboard/ExportCsvButton";
import InquiriesAdminPanel from "@/components/components/dashboard/InquiriesAdminPanel";
import { getAllEnrollments } from "@/Services/admin-enrollments";
import { getContactInquiries } from "@/Services/contact-inquiries";
import { requireAdmin } from "@/lib/auth";
import { isContactInquiriesTableReady, isContactInquiryStatusReady } from "@/lib/contact-inquiries-schema";

export default async function ContactInquiriesPage() {
  await requireAdmin();
  const [tableReady, statusReady] = await Promise.all([
    isContactInquiriesTableReady(),
    isContactInquiryStatusReady(),
  ]);
  const [inquiries, enrollments] = tableReady
    ? await Promise.all([getContactInquiries(), getAllEnrollments()])
    : [[], []];
  const newCount = inquiries.filter((row) => (row.status ?? "New") === "New").length;

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-zinc-500">Contact inquiries</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Enrollment & contact forms</h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              Filter leads, add admin notes, match enrollments by email, and track follow-up status.
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            {inquiries.length > 0 ? (
              <ExportCsvButton href="/api/admin/export/inquiries" label="Export CSV" />
            ) : null}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-zinc-950 px-6 py-4 text-white dark:bg-white dark:text-zinc-950">
                <p className="text-xs font-black uppercase tracking-[0.2em] opacity-60">Total</p>
                <p className="mt-1 text-3xl font-black">{inquiries.length}</p>
              </div>
              <div className="rounded-2xl bg-amber-500 px-6 py-4 text-white">
                <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80">New</p>
                <p className="mt-1 text-3xl font-black">{newCount}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {!tableReady ? <div className="mt-8"><ContactInquiriesSchemaBanner /></div> : null}
      {tableReady && !statusReady ? <div className="mt-8"><ContactInquiriesStatusBanner /></div> : null}

      {inquiries.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-white/10 dark:bg-white/5">
          <MessageSquare className="mx-auto text-zinc-400" size={40} />
          <h2 className="mt-5 text-3xl font-black">No inquiries yet</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-500">
            Submissions from /contact and course contact buttons appear here.
          </p>
        </div>
      ) : (
        <InquiriesAdminPanel inquiries={inquiries} enrollments={enrollments} statusReady={statusReady} />
      )}
    </main>
  );
}
