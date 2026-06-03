import { MessageSquare } from "lucide-react";

import ContactInquiriesAdminNotesBanner from "@/components/components/dashboard/ContactInquiriesAdminNotesBanner";
import ContactInquiriesLinkedEnrollmentBanner from "@/components/components/dashboard/ContactInquiriesLinkedEnrollmentBanner";
import ContactInquiriesSchemaBanner from "@/components/components/dashboard/ContactInquiriesSchemaBanner";
import ContactInquiriesStatusBanner from "@/components/components/dashboard/ContactInquiriesStatusBanner";
import DashboardPageHeader from "@/components/components/dashboard/DashboardPageHeader";
import ExportCsvButton from "@/components/components/dashboard/ExportCsvButton";
import InquiriesAdminPanel from "@/components/components/dashboard/InquiriesAdminPanel";
import { getAllEnrollments } from "@/Services/admin-enrollments";
import { getContactInquiries } from "@/Services/contact-inquiries";
import { requireAdmin } from "@/lib/auth";
import {
  isContactInquiriesTableReady,
  isContactInquiryAdminNotesReady,
  isContactInquiryLinkedEnrollmentReady,
  isContactInquiryStatusReady,
} from "@/lib/contact-inquiries-schema";

export default async function ContactInquiriesPage() {
  await requireAdmin();
  const [tableReady, statusReady, adminNotesReady, linkedEnrollmentReady] = await Promise.all([
    isContactInquiriesTableReady(),
    isContactInquiryStatusReady(),
    isContactInquiryAdminNotesReady(),
    isContactInquiryLinkedEnrollmentReady(),
  ]);
  const [inquiries, enrollments] = tableReady
    ? await Promise.all([getContactInquiries(), getAllEnrollments()])
    : [[], []];
  const newCount = inquiries.filter((row) => (row.status ?? "New") === "New").length;

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <DashboardPageHeader
        eyebrow="Contact inquiries"
        title="Enrollment & contact forms"
        description="Filter leads, add admin notes, match enrollments by email, and track follow-up status."
      >
        <div className="mt-6 flex flex-wrap items-end gap-3">
          {inquiries.length > 0 ? (
            <ExportCsvButton href="/api/admin/export/inquiries" label="Export CSV" />
          ) : null}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-zinc-950 px-6 py-4 text-white dark:bg-white dark:text-zinc-950">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">Total</p>
              <p className="mt-1 text-3xl font-bold">{inquiries.length}</p>
            </div>
            <div className="rounded-2xl bg-amber-500 px-6 py-4 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">New</p>
              <p className="mt-1 text-3xl font-bold">{newCount}</p>
            </div>
          </div>
        </div>
      </DashboardPageHeader>

      {!tableReady ? (
        <div className="mt-8">
          <ContactInquiriesSchemaBanner />
        </div>
      ) : null}
      {tableReady && !statusReady ? (
        <div className="mt-8">
          <ContactInquiriesStatusBanner />
        </div>
      ) : null}
      {tableReady && !adminNotesReady ? (
        <div className="mt-8">
          <ContactInquiriesAdminNotesBanner />
        </div>
      ) : null}
      {tableReady && !linkedEnrollmentReady ? (
        <div className="mt-8">
          <ContactInquiriesLinkedEnrollmentBanner />
        </div>
      ) : null}

      {inquiries.length === 0 ? (
        <div className="mt-8 mm-card-premium rounded-3xl border border-dashed p-12 text-center">
          <MessageSquare className="mx-auto text-zinc-400" size={40} />
          <h2 className="mt-5 text-3xl font-bold mm-heading">No inquiries yet</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 mm-muted">
            Submissions from /contact and course contact buttons appear here.
          </p>
        </div>
      ) : (
        <div className="mt-8">
          <InquiriesAdminPanel
            inquiries={inquiries}
            enrollments={enrollments}
            statusReady={statusReady}
            adminNotesReady={adminNotesReady}
            linkedEnrollmentReady={linkedEnrollmentReady}
          />
        </div>
      )}
    </main>
  );
}
