import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Clock3 } from "lucide-react";

import BrandWordmark from "@/components/marketing/BrandWordmark";
import CertificateActions from "@/components/components/dashboard/CertificateActions";
import DashboardPageHeader from "@/components/components/dashboard/DashboardPageHeader";
import { getCertificateById, issueCertificateIfComplete } from "@/Services/certificates";
import { getCompletionVerification } from "@/Services/completion-verifications";
import { getCourseProgress, getMyProgressRows, isEnrolledInCourse } from "@/Services/course-progress";
import { getSessionUser, requireUser } from "@/lib/auth";
import { formatCertificateDate, formatCertificateId } from "@/lib/certificates";
import { getCourseBySlug } from "@/lib/courses";
import { isCourseProgressTableReady } from "@/lib/course-progress-schema";
import { siteConfig } from "@/lib/site";

export default async function CourseCertificatePage({ params }: { params: Promise<{ slug: string }> }) {
  await requireUser("/dashboard/my-courses");
  const user = await getSessionUser();
  const { slug } = await params;

  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const enrolled = await isEnrolledInCourse(slug);
  if (!enrolled) redirect("/dashboard/my-courses");

  const tableReady = await isCourseProgressTableReady();
  const progress = tableReady ? await getCourseProgress(slug) : null;

  if (!progress || progress.percent < 100) {
    redirect(`/dashboard/my-courses/${slug}`);
  }

  const studentName =
    (user?.user_metadata?.full_name as string | undefined) ??
    (user?.user_metadata?.name as string | undefined) ??
    user?.email?.split("@")[0] ??
    "Student";

  const verification = user?.id ? await getCompletionVerification(user.id, slug) : null;
  const rows = await getMyProgressRows();
  const progressRows = rows.filter((row) => row.course_slug === slug);

  const existingCert = user?.id ? await getCertificateById(formatCertificateId(user.id, slug)) : null;

  const stored =
    user?.id && !existingCert
      ? await issueCertificateIfComplete({
          userId: user.id,
          courseSlug: slug,
          studentName,
          progressRows,
        })
      : existingCert;

  if (!stored && verification?.status !== "approved") {
    return (
      <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
        <DashboardPageHeader
          eyebrow="Certificate"
          title="Under mentor review"
          description={`You completed all milestones in ${course.title}.`}
        />
        <div className="mt-6 mm-section-panel border-violet-200/80 bg-violet-50/80 text-center dark:border-violet-400/20 dark:bg-violet-400/5">
          <Clock3 className="mx-auto text-violet-600" size={40} />
          <p className="mt-4 text-sm leading-7 mm-muted">
            Your certificate will appear here once approved (usually within 1–2 business days). You will receive an
            email when it is ready to download.
          </p>
          <p className="mt-3 text-xs font-semibold mm-subtle">
            Local test: complete all weeks → check off final milestone → approve as admin on Users or Analytics.
          </p>
          {verification?.status === "rejected" ? (
            <p className="mx-auto mt-4 max-w-md rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200">
              Your submission needs more work. Check your email or contact support for details.
            </p>
          ) : null}
          <Link
            href={`/dashboard/my-courses/${slug}`}
            className="mt-6 inline-flex rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white"
          >
            Back to course progress
          </Link>
        </div>
      </main>
    );
  }

  const certificateId = stored?.id ?? (user?.id ? formatCertificateId(user.id, slug) : "MM-UNKNOWN");
  const issuedDate = formatCertificateDate(stored?.issued_at ?? progress.completedAt ?? new Date());

  return (
    <div className="min-h-screen bg-white text-zinc-950 print:bg-white">
      <div className="certificate-print mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <div className="print:hidden">
          <DashboardPageHeader
            eyebrow="Certificate"
            title={course.title}
            description="Download PDF or share your public verify link."
          />
        </div>

        <CertificateActions
          courseSlug={slug}
          courseTitle={course.title}
          certificateId={certificateId}
          pdfEnabled={Boolean(stored)}
        />

        <article className="mt-6 rounded-[2rem] border-4 border-violet-200 bg-gradient-to-br from-violet-50 via-white to-teal-50 p-8 shadow-xl sm:p-12 print:mt-0 print:border-violet-300 print:shadow-none">
          <div className="flex flex-col items-center text-center">
            <BrandWordmark size="md" />
            <p className="mt-8 text-xs font-bold uppercase tracking-[0.35em] text-violet-600">
              Certificate of completion
            </p>
            <p className="mt-6 text-sm font-bold mm-subtle">This certifies that</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{studentName}</h1>
            <p className="mt-8 max-w-xl text-sm leading-7 text-zinc-600">
              has successfully completed all milestones in the mentorship program
            </p>
            <h2 className="mt-4 text-2xl font-bold text-violet-700 sm:text-3xl">{course.title}</h2>
            <p className="mt-3 text-sm font-bold mm-subtle">
              {course.duration} · {course.level}
            </p>
            <div className="mt-10 grid w-full max-w-md gap-2 border-t border-violet-200 pt-8 text-sm text-zinc-600">
              {certificateId ? (
                <p>
                  <span className="font-bold text-zinc-900">Certificate ID:</span> {certificateId}
                </p>
              ) : null}
              <p>
                <span className="font-bold text-zinc-900">Issued:</span> {issuedDate}
              </p>
              <p>
                <span className="font-bold text-zinc-900">Issued by:</span> {siteConfig.name}
              </p>
            </div>
          </div>
        </article>

        <p className="mt-6 text-center text-xs mm-subtle print:hidden">
          Download your certificate as a PDF from the button above, or share the public verify link.
        </p>
      </div>
    </div>
  );
}
