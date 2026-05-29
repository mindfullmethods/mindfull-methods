import { Mail, MessageSquare, Phone, UserRound } from "lucide-react";

import ContactInquiriesSchemaBanner from "@/components/components/dashboard/ContactInquiriesSchemaBanner";
import ContactInquiriesStatusBanner from "@/components/components/dashboard/ContactInquiriesStatusBanner";
import ExportCsvButton from "@/components/components/dashboard/ExportCsvButton";
import InquiryStatusControl from "@/components/components/dashboard/InquiryStatusControl";
import { getContactInquiries } from "@/Services/contact-inquiries";
import { requireAdmin } from "@/lib/auth";
import { isContactInquiriesTableReady, isContactInquiryStatusReady } from "@/lib/contact-inquiries-schema";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusClass(status?: string | null) {
  if (status === "Enrolled") return "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300";
  if (status === "Closed") return "bg-zinc-100 text-zinc-700 dark:bg-white/10 dark:text-zinc-300";
  if (status === "Contacted") return "bg-sky-50 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300";
  return "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300";
}

export default async function ContactInquiriesPage() {
  await requireAdmin();
  const [tableReady, statusReady] = await Promise.all([
    isContactInquiriesTableReady(),
    isContactInquiryStatusReady(),
  ]);
  const inquiries = tableReady ? await getContactInquiries() : [];
  const newCount = inquiries.filter((row) => (row.status ?? "New") === "New").length;

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-zinc-500">Contact inquiries</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Enrollment & contact forms</h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              Every submission from the contact page and &quot;Contact to enroll&quot; buttons is saved here. Update
              status as you follow up — New, Contacted, Enrolled, or Closed.
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

      <section className="mt-8">
        {inquiries.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-white/10 dark:bg-white/5">
            <MessageSquare className="mx-auto text-zinc-400" size={40} />
            <h2 className="mt-5 text-3xl font-black">No inquiries yet</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-500">
              Submissions from /contact and course &quot;Contact to enroll&quot; will appear here after the Supabase
              table is set up.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {inquiries.map((inquiry) => (
              <article
                key={inquiry.id}
                className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-6"
              >
                <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                        <UserRound size={15} />
                        Name
                      </p>
                      <h2 className="mt-2 text-xl font-black">{inquiry.name}</h2>
                    </div>
                    <div>
                      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                        <Mail size={15} />
                        Email
                      </p>
                      <a
                        href={`mailto:${inquiry.email}`}
                        className="mt-2 inline-block text-sm font-bold text-violet-600 hover:underline dark:text-violet-300"
                      >
                        {inquiry.email}
                      </a>
                      {inquiry.phone ? (
                        <p className="mt-2 flex items-center gap-1 text-sm text-zinc-500">
                          <Phone size={13} />
                          {inquiry.phone}
                        </p>
                      ) : null}
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Interest</p>
                      <p className="mt-2 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                        {inquiry.interest_label ?? inquiry.interest}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Status</p>
                      <span
                        className={`mt-2 inline-flex rounded-full px-3 py-2 text-xs font-black ${statusClass(inquiry.status)}`}
                      >
                        {inquiry.status ?? "New"}
                      </span>
                      <p className="mt-2 text-xs text-zinc-500">{formatDate(inquiry.created_at)}</p>
                    </div>
                  </div>
                  <InquiryStatusControl
                    inquiryId={inquiry.id}
                    currentStatus={inquiry.status}
                    disabled={!statusReady}
                  />
                </div>
                <div className="mt-5 rounded-2xl bg-[#f7f8f5] p-4 dark:bg-zinc-950">
                  <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                    <MessageSquare size={14} />
                    Message
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                    {inquiry.message}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
