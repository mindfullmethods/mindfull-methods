import Link from "next/link";
import { ArrowLeft, BriefcaseBusiness } from "lucide-react";

import { createApplication } from "@/actions/createApplications";
import ApplyButton from "@/components/components/dashboard/ApplyButton";
import ApplyResumeField from "@/components/components/dashboard/ApplyResumeField";
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
      <main className="min-h-screen px-5 py-8 sm:px-8">
        <p className="text-lg font-bold">Internship not found.</p>
        <Link href="/dashboard/internships" className="mt-4 inline-flex text-sm font-black text-violet-600">
          ← Back to internships
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <Link
        href={`/dashboard/internships/${id}`}
        className="inline-flex items-center gap-2 text-sm font-black text-zinc-500 hover:text-zinc-950 dark:hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to internship
      </Link>

      <section className="mt-6 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
        <img
          src={internship.image_url || marketingImages.internshipFallback}
          alt={internship.title}
          className="h-48 w-full object-cover sm:h-56"
        />
        <div className="p-6 sm:p-8">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
            <BriefcaseBusiness size={14} />
            Apply
          </p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">{internship.title}</h1>
          <p className="mt-2 text-sm font-bold text-zinc-500">{internship.company}</p>

          {error === "resume" ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300">
              Resume link must be a valid http(s) URL.
            </div>
          ) : null}

          {error === "1" ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300">
              Could not submit the form. Try the quick apply button below.
            </div>
          ) : null}

          {error === "config" ? (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200">
              Add <code className="rounded bg-amber-100 px-1">SUPABASE_SERVICE_ROLE_KEY</code> to{" "}
              <code className="rounded bg-amber-100 px-1">.env.local</code> and restart the dev server.
            </div>
          ) : null}

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-[#f7f8f5] p-5 dark:border-white/10 dark:bg-zinc-950">
            <h2 className="text-lg font-black">Quick apply</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              One click — your account name and email are saved automatically.
            </p>
            <ApplyButton internshipId={internship.id} />
          </div>

          <div className="mt-8 border-t border-zinc-200 pt-8 dark:border-white/10">
            <h2 className="text-lg font-black">Apply with resume link</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Optional — include a Google Drive or portfolio link.
            </p>

            <form action={createApplication} className="mt-6 space-y-5">
              <input type="hidden" name="internship_id" value={internship.id} />

              {[
                { label: "Full name", name: "student_name", type: "text", required: true, defaultValue: defaultName },
                { label: "Email", name: "email", type: "email", required: true, defaultValue: defaultEmail },
              ].map((field) => (
                <label key={field.name} className="block">
                  <span className="text-sm font-black">{field.label}</span>
                  <input
                    type={field.type}
                    name={field.name}
                    required={field.required}
                    defaultValue={field.defaultValue}
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold outline-none dark:border-white/10 dark:bg-zinc-900"
                  />
                </label>
              ))}

              <ApplyResumeField />

              <button
                type="submit"
                className="w-full rounded-xl bg-zinc-950 py-4 text-sm font-black text-white dark:bg-white dark:text-zinc-950"
              >
                Submit with resume
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
