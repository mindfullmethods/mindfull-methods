import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";

import DashboardPageHeader from "@/components/components/dashboard/DashboardPageHeader";
import { getAuditLogPage } from "@/Services/admin-audit-log";
import { requireAdmin } from "@/lib/auth";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireAdmin();
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const limit = 40;
  const offset = (page - 1) * limit;
  const { rows, total } = await getAuditLogPage({ limit, offset });
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <Link
        href="/dashboard/admin-home"
        className="inline-flex items-center gap-2 text-sm font-semibold mm-subtle transition hover:text-zinc-950 dark:hover:text-white"
      >
        <ArrowLeft size={16} />
        Admin home
      </Link>

      <div className="mt-6">
        <DashboardPageHeader
          eyebrow="Operations"
          title="Admin audit log"
          description="Who changed applications, enrollments, certificates, and site settings."
        >
          <a
            href="/api/admin/export/audit"
            className="mt-4 inline-flex items-center gap-2 rounded-xl border mm-border px-4 py-2 text-sm font-bold mm-heading"
          >
            <Download size={16} />
            Export CSV
          </a>
        </DashboardPageHeader>
      </div>

      {!rows.length ? (
        <p className="mt-8 mm-section-panel text-sm text-zinc-500">
          No audit entries yet. Run migration #13 and perform an admin action (e.g. approve an application).
        </p>
      ) : (
        <section className="mt-8 mm-section-panel overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b mm-border text-xs font-semibold uppercase tracking-wider mm-subtle">
                <th className="pb-3 pr-4">When</th>
                <th className="pb-3 pr-4">Actor</th>
                <th className="pb-3 pr-4">Action</th>
                <th className="pb-3">Entity</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b mm-border/60">
                  <td className="py-3 pr-4 whitespace-nowrap text-zinc-500">{formatDate(row.created_at)}</td>
                  <td className="py-3 pr-4 font-semibold">{row.actor_email}</td>
                  <td className="py-3 pr-4 font-bold">{row.action}</td>
                  <td className="py-3 text-zinc-500">
                    {row.entity_type ? `${row.entity_type}` : "—"}
                    {row.entity_id ? ` · ${row.entity_id}` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 ? (
            <div className="mt-6 flex items-center justify-between gap-4 text-sm font-semibold">
              <span className="mm-subtle">
                Page {page} of {totalPages} ({total} events)
              </span>
              <div className="flex gap-2">
                {page > 1 ? (
                  <Link
                    href={`/dashboard/admin/audit?page=${page - 1}`}
                    className="rounded-lg border mm-border px-3 py-1.5 mm-heading"
                  >
                    Previous
                  </Link>
                ) : null}
                {page < totalPages ? (
                  <Link
                    href={`/dashboard/admin/audit?page=${page + 1}`}
                    className="rounded-lg border mm-border px-3 py-1.5 mm-heading"
                  >
                    Next
                  </Link>
                ) : null}
              </div>
            </div>
          ) : null}
        </section>
      )}
    </main>
  );
}
