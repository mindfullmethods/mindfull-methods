import Link from "next/link";
import { Award, GraduationCap } from "lucide-react";

import Button from "@/components/marketing/Button";
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
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-zinc-500">Certificates</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Your achievements</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          Completion certificates appear here once you finish all weekly milestones in an enrolled course.
        </p>
      </section>

      <section className="mt-8">
        {earned.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-white/10 dark:bg-white/5">
            <Award className="mx-auto text-zinc-400" size={40} />
            <h2 className="mt-5 text-3xl font-black">No certificates yet</h2>
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
          <div className="grid gap-4 lg:grid-cols-2">
            {earned.map((enrollment) => {
              const courseInfo = enrollment.course;
              const progress = progressMap.get(enrollment.course_slug);
              const title = courseInfo?.title ?? enrollment.course_title;

              return (
                <article
                  key={enrollment.id}
                  className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-violet-50 p-6 shadow-sm dark:border-emerald-400/20 dark:from-emerald-400/10 dark:via-white/5 dark:to-violet-400/10"
                >
                  <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                    <Award size={14} />
                    Certificate earned
                  </p>
                  <h2 className="mt-3 text-2xl font-black">{title}</h2>
                  {courseInfo?.level ? (
                    <p className="mt-2 text-sm font-bold text-zinc-500">
                      {courseInfo.level} · {courseInfo.duration}
                    </p>
                  ) : null}
                  {progress?.completedAt ? (
                    <p className="mt-3 text-xs font-bold text-zinc-500">
                      Completed {formatCertificateDate(progress.completedAt)}
                    </p>
                  ) : null}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href={`/dashboard/my-courses/${enrollment.course_slug}/certificate`}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-black text-white"
                    >
                      <GraduationCap size={14} />
                      View certificate
                    </Link>
                    <Link
                      href={`/dashboard/my-courses/${enrollment.course_slug}`}
                      className="inline-flex rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-black dark:border-white/10"
                    >
                      Course progress
                    </Link>
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
