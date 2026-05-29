import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Download, Sparkles } from "lucide-react";

import EnrollButton from "@/components/marketing/EnrollButton";
import FAQAccordion from "@/components/marketing/FAQAccordion";
import { isEnrolledInCourse } from "@/Services/course-progress";
import { requireUser } from "@/lib/auth";
import { getCourseBySlug } from "@/lib/courses";
import { isRazorpayConfigured } from "@/lib/razorpay";
import { contactUrl, syllabusPdfUrl, syllabusPrintUrl, syllabusUrl } from "@/lib/site";
import { hasSyllabusPdf } from "@/lib/syllabus-files";

export default async function DashboardCourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireUser("/dashboard/courses");
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) notFound();

  const paymentsEnabled = isRazorpayConfigured();
  const pdfAvailable = hasSyllabusPdf(course.slug);
  const enrolled = await isEnrolledInCourse(slug);

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <Link
        href="/dashboard/courses"
        className="inline-flex items-center gap-2 text-sm font-black text-zinc-500 hover:text-zinc-950 dark:hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to courses
      </Link>

      <section className="mt-6 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
        <div className="relative">
          <img src={course.imageUrl} alt={course.title} className="aspect-[5/2] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-black text-zinc-950">{course.mode}</span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black text-white backdrop-blur">
                {course.duration}
              </span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black text-white backdrop-blur">
                {course.level}
              </span>
              {enrolled ? (
                <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-black text-white">Enrolled</span>
              ) : null}
            </div>
            <h1 className="mt-4 max-w-3xl text-3xl font-black tracking-tight text-white sm:text-5xl">{course.title}</h1>
          </div>
        </div>

        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">{course.longDescription}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {course.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-600 dark:bg-white/10 dark:text-zinc-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {course.learnOutcomes.slice(0, 4).map((outcome) => (
                <div
                  key={outcome}
                  className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-[#f7f8f5] p-4 dark:border-white/10 dark:bg-zinc-950"
                >
                  <CheckCircle2 size={18} className="mt-0.5 text-emerald-600" />
                  <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{outcome}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="rounded-3xl border border-zinc-200 bg-[#f7f8f5] p-5 dark:border-white/10 dark:bg-zinc-950">
              <p className="text-sm font-black text-zinc-500">Enroll</p>
              <p className="mt-2 text-2xl font-black">{course.priceLabel}</p>

              <div className="mt-5 flex flex-col gap-3">
                {enrolled ? (
                  <Link
                    href={`/dashboard/my-courses/${course.slug}`}
                    className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-4 text-sm font-black text-white transition hover:bg-emerald-700"
                  >
                    Track progress
                  </Link>
                ) : paymentsEnabled ? (
                  <EnrollButton
                    courseSlug={course.slug}
                    courseTitle={course.title}
                    amountInPaise={course.priceInPaise}
                    priceLabel={course.priceLabel}
                  />
                ) : (
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl bg-zinc-950 px-5 py-4 text-sm font-black text-white dark:bg-white dark:text-zinc-950"
                  >
                    Contact to enroll
                  </Link>
                )}

                <Link
                  href={contactUrl(course.slug)}
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-4 text-sm font-black dark:border-white/10 dark:bg-white/5"
                >
                  Book a call
                </Link>

                <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
                  <div className="flex items-center gap-2">
                    <Download size={16} className="text-zinc-500" />
                    <p className="text-sm font-bold">Course syllabus</p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {pdfAvailable ? (
                      <a
                        href={syllabusPdfUrl(course.slug)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-black dark:border-white/10"
                      >
                        <Download size={14} />
                        Download PDF
                      </a>
                    ) : null}
                    <a
                      href={syllabusPrintUrl(course.slug)}
                      className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-black dark:border-white/10"
                    >
                      View & print
                    </a>
                    <a
                      href={syllabusUrl(course.slug)}
                      download
                      className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-black dark:border-white/10"
                    >
                      .txt
                    </a>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs font-bold text-zinc-500">
                    <Sparkles size={14} />
                    Weekly mentorship included
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Curriculum</p>
          <h2 className="mt-2 text-2xl font-black">Weekly milestones</h2>
          <div className="mt-6 space-y-4">
            {course.curriculum.map((item) => (
              <div
                key={item.week}
                className="rounded-2xl border border-zinc-200 bg-[#f7f8f5] p-4 dark:border-white/10 dark:bg-zinc-950"
              >
                <p className="text-sm font-black text-violet-600 dark:text-violet-300">{item.week}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full bg-white px-3 py-1 text-xs font-bold text-zinc-600 ring-1 ring-zinc-200 dark:bg-white/5 dark:text-zinc-300 dark:ring-white/10"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">FAQs</p>
          <h2 className="mt-2 text-2xl font-black">Common questions</h2>
          <div className="mt-6">
            <FAQAccordion items={course.faqs} />
          </div>
        </div>
      </section>
    </main>
  );
}
