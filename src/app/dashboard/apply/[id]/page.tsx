import Link from "next/link";
import { ArrowLeft, BriefcaseBusiness, CheckCircle2, FileText, Zap } from "lucide-react";

import { createApplication } from "@/actions/createApplications";
import ApplyButton from "@/components/components/dashboard/ApplyButton";
import ApplyResumeField from "@/components/components/dashboard/ApplyResumeField";
import DashboardPageHeader from "@/components/components/dashboard/DashboardPageHeader";
import { getInternshipById } from "@/Services/internship-details";
import { getSessionUser, requireUser } from "@/lib/auth";
import { marketingImages } from "@/lib/images";

export default async function ApplyPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireUser("/dashboard/internships");
  const user = await getSessionUser();
  const { id } = await params;
  const { error } = await searchParams;

  const defaultName =
    (user?.user_metadata?.full_name as string | undefined) ??
    (user?.user_metadata?.name as string | undefined) ??
    "";
  const defaultEmail = user?.email ?? "";

  const internship = await getInternshipById(id);

  if (!internship) {
    return (
      <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
        <p className="text-lg font-bold mm-heading">Internship not found.</p>
        <Link href="/dashboard/internships" className="mt-4 inline-flex text-sm font-bold text-violet-600 dark:text-violet-300">
          ← Back to internships
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <Link
        href={`/dashboard/internships/${id}`}
        className="inline-flex items-center gap-2 text-sm font-semibold mm-subtle transition hover:text-zinc-950 dark:hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to internship
      </Link>

      <div className="mt-6 overflow-hidden rounded-3xl border mm-border">
        <img
          src={internship.image_url || marketingImages.internshipFallback}
          alt={internship.title}
          className="h-48 w-full object-cover sm:h-56"
        />
      </div>

      <div className="mt-6">
        <DashboardPageHeader
          eyebrow="Apply"
          title={internship.title}
          description={`${internship.company} · ${internship.duration ?? "Flexible duration"} · ${internship.stipend ?? "Stipend TBD"}`}
        />
      </div>

      {error === "resume" ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300">
          Resume link must be a valid http(s) URL (Google Drive, Notion, GitHub, or portfolio).
        </div>
      ) : null}

      {error === "1" ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300">
          Could not submit the form. Try quick apply below or contact support.
        </div>
      ) : null}

      {error === "config" ? (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200">
          Add <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/40">SUPABASE_SERVICE_ROLE_KEY</code> to{" "}
          <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/40">.env.local</code> and restart the dev server.
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="mm-section-panel">
          <div className="relative flex items-center gap-2">
            <Zap size={18} className="text-violet-600" />
            <h2 className="text-lg font-bold mm-heading">Quick apply</h2>
          </div>
          <p className="relative mt-2 text-sm leading-6 mm-muted">
            One click — we save your account name and email automatically. Best if your profile is already complete.
          </p>
          <ul className="relative mt-4 space-y-2 text-sm mm-muted">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-600" />
              Confirmation email with next steps
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-600" />
              Track status in My applications
            </li>
          </ul>
          <div className="relative mt-6">
            <ApplyButton internshipId={internship.id} />
          </div>
        </section>

        <section className="mm-section-panel">
          <div className="relative flex items-center gap-2">
            <FileText size={18} className="text-violet-600" />
            <h2 className="text-lg font-bold mm-heading">Apply with resume</h2>
          </div>
          <p className="relative mt-2 text-sm leading-6 mm-muted">
            Add a public link to your resume or portfolio. We accept Google Drive, Notion, GitHub, LinkedIn, or personal
            sites.
          </p>

          <form action={createApplication} className="relative mt-6 space-y-5">
            <input type="hidden" name="internship_id" value={internship.id} />

            {[
              { label: "Full name", name: "student_name", type: "text", required: true, defaultValue: defaultName },
              { label: "Email", name: "email", type: "email", required: true, defaultValue: defaultEmail },
            ].map((field) => (
              <label key={field.name} className="block">
                <span className="text-sm font-semibold mm-heading">{field.label}</span>
                <input
                  type={field.type}
                  name={field.name}
                  required={field.required}
                  defaultValue={field.defaultValue}
                  className="mt-2 mm-input w-full"
                />
              </label>
            ))}

            <ApplyResumeField />

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-5 py-4 text-sm font-bold text-white dark:bg-white dark:text-zinc-950"
            >
              <BriefcaseBusiness size={16} />
              Submit application
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
