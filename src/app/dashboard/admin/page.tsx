import Link from "next/link";
import { BriefcaseBusiness, Edit3, ImageIcon, Plus, Trash2 } from "lucide-react";

import { deleteInternship } from "@/actions/deleteInternship";
import { createInternship } from "@/actions/createInternships";
import ImageUploadField from "@/components/components/dashboard/ImageUploadField";
import DashboardPageHeader from "@/components/components/dashboard/DashboardPageHeader";
import SectionHeader from "@/components/marketing/SectionHeader";
import { getInternships } from "@/Services/Internships";
import { requireAdmin } from "@/lib/auth";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; created?: string; deleted?: string; updated?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const internships = await getInternships({ includeUnpublished: true });

  const flash =
    params.error
      ? { tone: "error" as const, message: decodeURIComponent(params.error) }
      : params.created
        ? { tone: "success" as const, message: "Internship published successfully." }
        : params.deleted
          ? { tone: "success" as const, message: "Internship deleted." }
          : params.updated
            ? { tone: "success" as const, message: "Internship updated." }
            : null;

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      {flash ? (
        <div
          className={
            flash.tone === "error"
              ? "mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200"
              : "mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-200"
          }
        >
          {flash.message}
        </div>
      ) : null}

      <DashboardPageHeader
        variant="hero"
        eyebrow="Admin Studio"
        title="Create and manage internship programs"
        description="Publish new opportunities, update program details, and keep the student-facing catalog production ready."
      >
        <div className="mt-7 inline-flex rounded-2xl bg-white px-6 py-4 text-zinc-950">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Published</p>
            <p className="mt-1 text-4xl font-bold">{internships.length}</p>
          </div>
        </div>
      </DashboardPageHeader>

      <section className="mt-8 grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <form action={createInternship} className="mm-section-panel">
          <div className="relative flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
              <Plus size={20} />
            </span>
            <SectionHeader eyebrow="New program" title="Internship details" />
          </div>

          <div className="relative mt-8 grid gap-5">
            {[
              { label: "Internship title", name: "title", placeholder: "Frontend Developer Internship" },
              { label: "Company name", name: "company", placeholder: "Mindfull Methods" },
              { label: "Duration", name: "duration", placeholder: "12 weeks" },
              { label: "Stipend", name: "stipend", placeholder: "Rs 25,000/month" },
              { label: "Tags (comma-separated)", name: "tags", placeholder: "remote, frontend, paid" },
            ].map((field) => (
              <label key={field.name} className="block">
                <span className="text-sm font-semibold mm-heading">{field.label}</span>
                <input
                  type="text"
                  name={field.name}
                  placeholder={field.placeholder}
                  className="mt-2 mm-input w-full"
                />
              </label>
            ))}

            <ImageUploadField placeholder="/images/marketing/internship-fallback.jpg" />

            <label className="block">
              <span className="text-sm font-semibold mm-heading">Description</span>
              <textarea
                rows={6}
                name="description"
                placeholder="Describe responsibilities, outcomes, tools, and who should apply."
                className="mt-2 mm-input w-full resize-none"
              />
            </label>

            <label className="flex items-center gap-3 rounded-xl border mm-border bg-zinc-50/80 px-4 py-3 dark:bg-white/[0.02]">
              <input type="checkbox" name="is_published" defaultChecked className="h-4 w-4 rounded" />
              <span className="text-sm font-semibold mm-heading">Publish immediately (visible to students)</span>
            </label>
          </div>

          <button
            type="submit"
            className="relative mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-5 py-4 text-sm font-bold text-white transition hover:scale-[1.01] dark:bg-white dark:text-zinc-950"
          >
            <Plus size={18} />
            Publish Internship
          </button>
        </form>

        <div className="mm-section-panel">
          <div className="relative flex items-center justify-between gap-5">
            <SectionHeader eyebrow="Catalog" title="Published internships" />
            <BriefcaseBusiness className="mm-subtle" size={28} />
          </div>

          <div className="relative mt-7 space-y-4">
            {internships.length === 0 && (
              <div className="rounded-2xl border border-dashed mm-border p-8 text-center">
                <ImageIcon className="mx-auto text-zinc-400" />
                <h3 className="mt-4 text-xl font-bold mm-heading">No internships yet</h3>
                <p className="mt-2 text-sm mm-muted">Create your first listing with the form.</p>
              </div>
            )}

            {internships.map((internship) => (
              <article
                key={internship.id}
                className="rounded-2xl border mm-border bg-zinc-50/80 p-4 dark:bg-white/[0.02]"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-bold mm-heading">{internship.title}</h3>
                      {internship.is_published === false ? (
                        <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold uppercase text-amber-800 dark:bg-amber-400/20 dark:text-amber-200">
                          Draft
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm font-semibold mm-muted">{internship.company}</p>
                    {internship.tags ? (
                      <p className="mt-2 text-xs font-semibold text-violet-600 dark:text-violet-300">
                        {internship.tags}
                      </p>
                    ) : null}
                    <p className="mt-3 text-sm mm-muted">
                      {internship.duration} / {internship.stipend}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/admin/edit/${internship.id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-3 text-sm font-bold text-white transition hover:scale-[1.02] dark:bg-white dark:text-zinc-950"
                    >
                      <Edit3 size={16} />
                      Edit
                    </Link>

                    <form action={deleteInternship.bind(null, internship.id)}>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
