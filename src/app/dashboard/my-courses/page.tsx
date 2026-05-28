import Link from "next/link";
import { Award, BookOpen, CheckCircle2, Clock, GraduationCap } from "lucide-react";

import Button from "@/components/marketing/Button";
import EnrollmentsSchemaBanner from "@/components/components/dashboard/EnrollmentsSchemaBanner";
import { getMyEnrollments } from "@/Services/enrollments";
import { getProgressSummariesForSlugs } from "@/Services/course-progress";
import { requireUser } from "@/lib/auth";
import { linkOrphanEnrollmentsByEmail } from "@/lib/enrollments";
import { isEnrollmentsTableReady } from "@/lib/enrollments-schema";
import { isCourseProgressTableReady } from "@/lib/course-progress-schema";
import { hasSyllabusPdf, syllabusPdfPublicUrl } from "@/lib/syllabus-files";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatAmount(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

export default async function MyCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ enrolled?: string; course?: string }>;
}) {
  const user = await requireUser("/dashboard/my-courses");
  const { enrolled, course } = await searchParams;
  const tableReady = await isEnrollmentsTableReady();

  if (tableReady && user.email) {
    await linkOrphanEnrollmentsByEmail(user.id, user.email);
  }

  const enrollments = tableReady ? await getMyEnrollments() : [];
  const progressReady = await isCourseProgressTableReady();
  const progressMap =
    progressReady && enrollments.length > 0
      ? await getProgressSummariesForSlugs(enrollments.map((e) => e.course_slug))
      : new Map();

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-zinc-500">My courses</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Your enrolled programs</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          Courses you&apos;ve paid for appear here with access details and syllabus links.
        </p>
      </section>

      {enrolled === "1" ? (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
          <p className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            Payment confirmed{course ? ` for ${decodeURIComponent(course).replace(/-/g, " ")}` : ""}. Welcome to Mindfull Methods!
          </p>
        </div>
      ) : null}

      {!tableReady ? <EnrollmentsSchemaBanner /> : null}

      <section className="mt-8">
        {enrollments.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-white/10 dark:bg-white/5">
            <GraduationCap className="mx-auto text-zinc-400" size={40} />
            <h2 className="mt-5 text-3xl font-black">No courses yet</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-500">
              Browse mentorship tracks and enroll with Pay &amp; enroll on any course page.
            </p>
            <div className="mt-8">
              <Button href="/courses" variant="gradient" size="lg">
                Browse courses
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {enrollments.map((enrollment) => {
              const courseInfo = enrollment.course;
              const progress = progressMap.get(enrollment.course_slug);
              const percent = progress?.percent ?? 0;

              return (
                <article
                  key={enrollment.id}
                  className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5"
                >
                  {courseInfo?.imageUrl ? (
                    <img
                      src={courseInfo.imageUrl}
                      alt={courseInfo.title}
                      className="h-44 w-full object-cover"
                    />
                  ) : null}
                  <div className="p-6">
                    <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">
                      <BookOpen size={14} />
                      Enrolled · {formatAmount(enrollment.amount_paise)}
                    </p>
                    <h2 className="mt-3 text-2xl font-black">
                      {courseInfo?.title ?? enrollment.course_title}
                    </h2>
                    {courseInfo?.shortDescription ? (
                      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                        {courseInfo.shortDescription}
                      </p>
                    ) : null}
                    <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold text-zinc-500">
                      {courseInfo?.level ? <span>{courseInfo.level}</span> : null}
                      {courseInfo?.duration ? (
                        <span className="inline-flex items-center gap-1">
                          <Clock size={12} />
                          {courseInfo.duration}
                        </span>
                      ) : null}
                      <span>Paid {formatDate(enrollment.created_at)}</span>
                    </div>
                    {progressReady ? (
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs font-bold text-zinc-500">
                          <span>Progress</span>
                          <span>{percent}%</span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-teal-400"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    ) : null}
                    <div className="mt-6 flex flex-wrap gap-3">
                      {percent >= 100 ? (
                        <Link
                          href={`/dashboard/my-courses/${enrollment.course_slug}/certificate`}
                          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-black text-white"
                        >
                          <Award size={14} />
                          Certificate
                        </Link>
                      ) : null}
                      <Link
                        href={`/dashboard/my-courses/${enrollment.course_slug}`}
                        className="inline-flex rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-black text-white"
                      >
                        Track progress
                      </Link>
                      <Link
                        href={`/courses/${enrollment.course_slug}`}
                        className="inline-flex rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-black text-white dark:bg-white dark:text-zinc-950"
                      >
                        View course
                      </Link>
                      {hasSyllabusPdf(enrollment.course_slug) ? (
                        <a
                          href={syllabusPdfPublicUrl(enrollment.course_slug)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-black text-violet-800 dark:border-violet-400/20 dark:bg-violet-400/10 dark:text-violet-200"
                        >
                          Syllabus PDF
                        </a>
                      ) : (
                        <Link
                          href={`/courses/${enrollment.course_slug}/syllabus`}
                          className="inline-flex rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-black dark:border-white/10"
                        >
                          Syllabus
                        </Link>
                      )}
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
