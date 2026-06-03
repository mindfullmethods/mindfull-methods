import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Download, Sparkles } from "lucide-react";

import DashboardPageHeader from "@/components/components/dashboard/DashboardPageHeader";
import EnrollCheckoutSection from "@/components/marketing/EnrollCheckoutSection";
import FAQAccordion from "@/components/marketing/FAQAccordion";
import { isEnrolledInCourse } from "@/Services/course-progress";
import { requireUser } from "@/lib/auth";
import { resolveCoursePageSlug } from "@/lib/course-page";
import { isRazorpayConfigured } from "@/lib/razorpay";
import { contactUrl, syllabusPdfUrl, syllabusPrintUrl, syllabusUrl } from "@/lib/site";
import { hasSyllabusPdf } from "@/lib/syllabus-files";

export default async function DashboardCourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireUser("/dashboard/courses");
  const { slug } = await params;
  const course = await resolveCoursePageSlug(slug, "/dashboard/courses");
  if (!course) notFound();

  const paymentsEnabled = isRazorpayConfigured();
  const pdfAvailable = hasSyllabusPdf(course.slug);
  const enrolled = await isEnrolledInCourse(course.slug);

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <Link
        href="/dashboard/courses"
        className="inline-flex items-center gap-2 text-sm font-semibold mm-subtle transition hover:text-zinc-950 dark:hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to courses
      </Link>

      <section className="mt-6 overflow-hidden rounded-3xl border mm-border">
        <div className="relative">
          <img src={course.imageUrl} alt={course.title} className="aspect-[5/2] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-zinc-950">{course.mode}</span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                {course.duration}
              </span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                {course.level}
              </span>
              {enrolled ? (
                <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">Enrolled</span>
              ) : null}
            </div>
            <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-5xl">{course.title}</h1>
          </div>
        </div>

        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <p className="text-sm leading-7 mm-muted">{course.longDescription}</p>

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
                <div key={outcome} className="flex items-start gap-3 rounded-2xl border mm-border bg-[#f7f8f5] p-4 dark:bg-zinc-950">
                  <CheckCircle2 size={18} className="mt-0.5 text-emerald-600" />
                  <p className="text-sm font-bold mm-heading">{outcome}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="mm-section-panel">
              <p className="text-sm font-bold mm-subtle">Enroll</p>
              <p className="mt-2 text-2xl font-bold mm-heading">{course.priceLabel}</p>

              <div className="mt-5 flex flex-col gap-3">
                {enrolled ? (
                  <Link
                    href={`/dashboard/my-courses/${course.slug}`}
                    className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-4 text-sm font-bold text-white transition hover:bg-emerald-700"
                  >
                    Track progress
                  </Link>
                ) : paymentsEnabled ? (
                  <EnrollCheckoutSection
                    courseSlug={course.slug}
                    courseTitle={course.title}
                    amountInPaise={course.priceInPaise}
                    priceLabel={course.priceLabel}
                  />
                ) : (
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl bg-zinc-950 px-5 py-4 text-sm font-bold text-white dark:bg-white dark:text-zinc-950"
                  >
                    Contact to enroll
                  </Link>
                )}

                <Link
                  href={contactUrl(course.slug)}
                  className="inline-flex items-center justify-center rounded-xl border mm-border px-5 py-4 text-sm font-bold mm-heading"
                >
                  Book a call
                </Link>

                <div className="rounded-2xl border mm-border p-4">
                  <div className="flex items-center gap-2">
                    <Download size={16} className="mm-subtle" />
                    <p className="text-sm font-bold mm-heading">Course syllabus</p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {pdfAvailable ? (
                      <a
                        href={syllabusPdfUrl(course.slug)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border mm-border px-4 py-2.5 text-sm font-bold mm-heading"
                      >
                        <Download size={14} />
                        Download PDF
                      </a>
                    ) : null}
                    <a
                      href={syllabusPrintUrl(course.slug)}
                      className="inline-flex items-center gap-2 rounded-xl border mm-border px-4 py-2.5 text-sm font-bold mm-heading"
                    >
                      View & print
                    </a>
                    <a
                      href={syllabusUrl(course.slug)}
                      download
                      className="inline-flex items-center gap-2 rounded-xl border mm-border px-4 py-2.5 text-sm font-bold mm-heading"
                    >
                      .txt
                    </a>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs font-bold mm-subtle">
                    <Sparkles size={14} />
                    Weekly mentorship included
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <div className="mt-8">
        <DashboardPageHeader
          eyebrow="Program details"
          title="Curriculum & FAQs"
          description="Weekly milestones and answers before you enroll."
        />
      </div>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="mm-section-panel">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mm-subtle">Curriculum</p>
          <h2 className="mt-2 text-2xl font-bold mm-heading">Weekly milestones</h2>
          <div className="mt-6 space-y-4">
            {course.curriculum.map((item) => (
              <div key={item.week} className="rounded-2xl border mm-border bg-[#f7f8f5] p-4 dark:bg-zinc-950">
                <p className="text-sm font-bold text-violet-600 dark:text-violet-300">{item.week}</p>
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

        <div className="mm-section-panel">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mm-subtle">FAQs</p>
          <h2 className="mt-2 text-2xl font-bold mm-heading">Common questions</h2>
          <div className="mt-6">
            <FAQAccordion items={course.faqs} />
          </div>
        </div>
      </section>
    </main>
  );
}
