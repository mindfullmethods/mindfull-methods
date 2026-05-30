import { notFound, redirect } from "next/navigation";

import BrandWordmark from "@/components/marketing/BrandWordmark";
import CertificateActions from "@/components/components/dashboard/CertificateActions";
import { getCourseProgress, isEnrolledInCourse } from "@/Services/course-progress";
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

  const issuedDate = formatCertificateDate(progress.completedAt ?? new Date());
  const certificateId = user?.id ? formatCertificateId(user.id, slug) : null;

  return (
    <div className="min-h-screen bg-white text-zinc-950 print:bg-white">
      <div className="certificate-print mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <CertificateActions courseSlug={slug} />

        <article className="rounded-[2rem] border-4 border-violet-200 bg-gradient-to-br from-violet-50 via-white to-teal-50 p-8 shadow-xl sm:p-12 print:border-violet-300 print:shadow-none">
          <div className="flex flex-col items-center text-center">
            <BrandWordmark size="md" />
            <p className="mt-8 text-xs font-black uppercase tracking-[0.35em] text-violet-600">
              Certificate of completion
            </p>
            <p className="mt-6 text-sm font-bold text-zinc-500">This certifies that</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{studentName}</h1>
            <p className="mt-8 max-w-xl text-sm leading-7 text-zinc-600">
              has successfully completed all milestones in the mentorship program
            </p>
            <h2 className="mt-4 text-2xl font-black text-violet-700 sm:text-3xl">{course.title}</h2>
            <p className="mt-3 text-sm font-bold text-zinc-500">
              {course.duration} · {course.level}
            </p>
            <div className="mt-10 grid w-full max-w-md gap-2 border-t border-violet-200 pt-8 text-sm text-zinc-600">
              {certificateId ? (
                <p>
                  <span className="font-black text-zinc-900">Certificate ID:</span> {certificateId}
                </p>
              ) : null}
              <p>
                <span className="font-black text-zinc-900">Issued:</span> {issuedDate}
              </p>
              <p>
                <span className="font-black text-zinc-900">Issued by:</span> {siteConfig.name}
              </p>
            </div>
          </div>
        </article>

        <p className="mt-6 text-center text-xs text-zinc-500 print:hidden">
          Use Print → Save as PDF to download your certificate.
        </p>
      </div>
    </div>
  );
}
