import Link from "next/link";
import { Award, GraduationCap } from "lucide-react";

import Button from "@/components/marketing/Button";
import DashboardPageHeader from "@/components/components/dashboard/DashboardPageHeader";
import { getMyEnrollments } from "@/Services/enrollments";
import { getProgressSummariesForSlugs } from "@/Services/course-progress";
import { requireUser } from "@/lib/auth";
import { isCourseProgressTableReady } from "@/lib/course-progress-schema";
import { formatCertificateDate } from "@/lib/certificates";

export default async function CertificatesPage() {
  await requireUser("/dashboard/certificates");

  const progressReady = await isCourseProgressTableReady();
  const enrollments = await getMyEnrollments();
  const progressMap =
    progressReady && enrollments.length > 0
      ? await getProgressSummariesForSlugs(enrollments.map((e) => e.course_slug))
      : new Map();

  const earned = enrollments.filter((enrollment) => (progressMap.get(enrollment.course_slug)?.percent ?? 0) >= 100);

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <DashboardPageHeader
        eyebrow="Certificates"
        title="Your achievements"
        description="Completion certificates appear here once you finish all weekly milestones in an enrolled course."
      />

      <section className="mt-8">
        {earned.length === 0 ? (
          <div className="mm-card-premium rounded-3xl border border-dashed p-12 text-center">
            <Award className="mx-auto text-zinc-400" size={40} />
            <h2 className="mt-5 text-3xl font-bold mm-heading">No certificates yet</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-500">
              Complete all weeks in a course to unlock your certificate of completion.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href="/dashboard/my-courses" variant="gradient" size="lg">
                My courses
              </Button>
              <Button href="/dashboard/courses" variant="secondary" size="lg">
                Browse courses
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2 lg:items-stretch">
            {earned.map((enrollment) => {
              const courseInfo = enrollment.course;
              const progress = progressMap.get(enrollment.course_slug);
              const title = courseInfo?.title ?? enrollment.course_title;

              return (
                <article
                  key={enrollment.id}
                  className="relative flex min-h-[220px] flex-col overflow-visible rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/90 via-white to-violet-50/90 p-6 shadow-sm sm:p-7 dark:border-emerald-400/20 dark:from-emerald-400/10 dark:via-zinc-950/80 dark:to-violet-400/10"
                >
                  <div className="relative z-[1] flex min-h-0 flex-1 flex-col">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">
                      <Award size={14} className="shrink-0" />
                      Certificate earned
                    </p>
                    <h2 className="mt-3 text-xl font-bold leading-snug mm-heading sm:text-2xl">{title}</h2>
                    {courseInfo?.level ? (
                      <p className="mt-2 text-sm mm-muted">
                        {courseInfo.level} · {courseInfo.duration}
                      </p>
                    ) : null}
                    {progress?.completedAt ? (
                      <p className="mt-2 text-xs font-semibold mm-subtle">
                        Completed {formatCertificateDate(progress.completedAt)}
                      </p>
                    ) : null}
                    <div className="mt-auto flex flex-wrap gap-3 pt-6">
                      <Link
                        href={`/dashboard/my-courses/${enrollment.course_slug}/certificate`}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
                      >
                        <GraduationCap size={14} />
                        View certificate
                      </Link>
                      <Link
                        href={`/dashboard/my-courses/${enrollment.course_slug}`}
                        className="inline-flex items-center rounded-xl border mm-border bg-white/80 px-4 py-2.5 text-sm font-bold mm-heading backdrop-blur dark:bg-white/[0.06]"
                      >
                        Course progress
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
