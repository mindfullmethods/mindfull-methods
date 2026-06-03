import Link from "next/link";
import { ArrowLeft, Edit3 } from "lucide-react";

import { updateInternship } from "@/actions/updateInternship";
import ImageUploadField from "@/components/components/dashboard/ImageUploadField";
import DashboardPageHeader from "@/components/components/dashboard/DashboardPageHeader";
import SectionHeader from "@/components/marketing/SectionHeader";
import { getInternshipById } from "@/Services/internship-details";
import { requireAdmin } from "@/lib/auth";

export default async function EditInternshipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const internship = await getInternshipById(id);

  if (!internship) {
    return (
      <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
        <p className="text-sm font-semibold mm-muted">Internship not found.</p>
        <Link href="/dashboard/admin" className="mt-4 inline-flex text-sm font-bold text-violet-600 dark:text-violet-300">
          Back to Admin Studio
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <Link
        href="/dashboard/admin"
        className="inline-flex items-center gap-2 text-sm font-semibold mm-subtle transition hover:text-zinc-950 dark:hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to Admin Studio
      </Link>

      <div className="mt-6">
        <DashboardPageHeader
          eyebrow="Admin Studio"
          title="Update internship"
          description={`Editing ${internship.title} at ${internship.company}.`}
        />
      </div>

      <form
        action={async (formData) => {
          "use server";
          await updateInternship(internship.id, formData);
        }}
        className="mt-8 mm-section-panel"
      >
        <div className="relative flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
            <Edit3 size={20} />
          </span>
          <SectionHeader eyebrow="Program" title="Internship details" />
        </div>

        <div className="relative mt-8 grid gap-5">
          {[
            { label: "Internship title", name: "title", defaultValue: internship.title },
            { label: "Company name", name: "company", defaultValue: internship.company },
            { label: "Duration", name: "duration", defaultValue: internship.duration },
            { label: "Stipend", name: "stipend", defaultValue: internship.stipend },
            { label: "Tags (comma-separated)", name: "tags", defaultValue: internship.tags ?? "" },
          ].map((field) => (
            <label key={field.name} className="block">
              <span className="text-sm font-semibold mm-heading">{field.label}</span>
              <input
                type="text"
                name={field.name}
                defaultValue={field.defaultValue}
                className="mt-2 mm-input w-full"
              />
            </label>
          ))}

          <ImageUploadField defaultValue={internship.image_url} placeholder="/images/marketing/internship-fallback.jpg" />

          <label className="block">
            <span className="text-sm font-semibold mm-heading">Description</span>
            <textarea
              rows={6}
              name="description"
              defaultValue={internship.description}
              className="mt-2 mm-input w-full resize-none"
            />
          </label>

          <label className="flex items-center gap-3 rounded-xl border mm-border bg-zinc-50/80 px-4 py-3 dark:bg-white/[0.02]">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={internship.is_published !== false}
              className="h-4 w-4 rounded"
            />
            <span className="text-sm font-semibold mm-heading">Published (visible to students)</span>
          </label>
        </div>

        <button
          type="submit"
          className="relative mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-5 py-4 text-sm font-bold text-white transition hover:scale-[1.01] dark:bg-white dark:text-zinc-950"
        >
          <Edit3 size={18} />
          Update internship
        </button>
      </form>
    </main>
  );
}
