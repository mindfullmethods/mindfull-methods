import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  Clock3,
  IndianRupee,
  Sparkles,
} from "lucide-react";

import ApplyButton from "@/components/components/dashboard/ApplyButton";
import { getInternshipById } from "@/Services/internship-details";
import { marketingImages } from "@/lib/images";

function parseTags(tags?: string | null) {
  if (!tags?.trim()) return [];
  return tags.split(",").map((t) => t.trim()).filter(Boolean);
}

export default async function InternshipDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const internship = await getInternshipById(id);

  if (!internship) notFound();

  const tags = parseTags(internship.tags);

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <Link
        href="/dashboard/internships"
        className="inline-flex items-center gap-2 text-sm font-black text-zinc-500 hover:text-zinc-950 dark:hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to internships
      </Link>

      <section className="mt-6 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
        <div className="relative">
          <img
            src={internship.image_url || marketingImages.internshipFallback}
            alt={internship.title}
            className="aspect-[21/9] w-full object-cover sm:aspect-[5/2]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-black text-zinc-950">
                <Building2 size={12} />
                {internship.company}
              </span>
              <span className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-black text-white backdrop-blur">
                <Clock3 size={12} className="mr-1 inline" />
                {internship.duration}
              </span>
            </div>
            <h1 className="mt-4 max-w-3xl text-3xl font-black tracking-tight text-white sm:text-5xl">
              {internship.title}
            </h1>
          </div>
        </div>

        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">
              <BriefcaseBusiness size={14} />
              About this role
            </p>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              {internship.description}
            </p>

            {tags.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-600 dark:bg-white/10 dark:text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "Structured mentorship and feedback",
                "Portfolio-ready deliverables",
                "Weekly milestone check-ins",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-zinc-200 bg-[#f7f8f5] p-4 dark:border-white/10 dark:bg-zinc-950"
                >
                  <p className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                    <Sparkles size={16} className="text-violet-500" />
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="rounded-3xl border border-zinc-200 bg-[#f7f8f5] p-5 dark:border-white/10 dark:bg-zinc-950">
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                <IndianRupee size={14} />
                Stipend
              </p>
              <p className="mt-2 text-3xl font-black">{internship.stipend}</p>
              <p className="mt-2 text-sm text-zinc-500">{internship.duration} · {internship.company}</p>

              <div className="mt-6">
                <ApplyButton internshipId={internship.id} />
              </div>

              <p className="mt-4 text-xs leading-5 text-zinc-500">
                Applications are reviewed in your dashboard. You&apos;ll get email updates when status changes.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
