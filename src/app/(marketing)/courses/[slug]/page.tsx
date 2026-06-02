import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Download, Sparkles } from "lucide-react";

import EnrollButton from "@/components/marketing/EnrollButton";
import Button from "@/components/marketing/Button";
import Badge from "@/components/marketing/Badge";
import FAQAccordion from "@/components/marketing/FAQAccordion";
import JsonLd from "@/components/marketing/JsonLd";
import SectionHeader from "@/components/marketing/SectionHeader";
import { isEnrolledInCourse, getCourseProgress } from "@/Services/course-progress";
import { resolveCoursePageSlug } from "@/lib/course-page";
import { getCourseSlugs } from "@/lib/courses";
import { getResolvedCourseBySlug, getResolvedCourseSlugs } from "@/lib/platform-content";
import { isRazorpayConfigured } from "@/lib/razorpay";
import { absoluteUrl, courseJsonLd } from "@/lib/seo";
import { contactUrl, pageTitle, signupUrl, syllabusPdfUrl, syllabusPrintUrl, syllabusUrl } from "@/lib/site";
import { hasSyllabusPdf } from "@/lib/syllabus-files";
import type { Metadata } from "next";

const linkButtonClass =
  "inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15";

export async function generateStaticParams() {
  try {
    const slugs = await getResolvedCourseSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return getCourseSlugs().map((slug) => ({ slug }));
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getResolvedCourseBySlug(slug);

  if (!course) {
    return { title: "Course not found" };
  }

  const path = `/courses/${course.slug}`;

  return {
    title: course.title,
    description: course.shortDescription,
    alternates: { canonical: path },
    openGraph: {
      title: pageTitle(course.title),
      description: course.shortDescription,
      url: absoluteUrl(path),
      type: "website",
      images: [{ url: course.imageUrl, width: 1200, height: 480, alt: course.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle(course.title),
      description: course.shortDescription,
      images: [course.imageUrl],
    },
  };
}

export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await resolveCoursePageSlug(slug, "/courses");
  if (!course) notFound();

  const paymentsEnabled = isRazorpayConfigured();
  const pdfAvailable = hasSyllabusPdf(course.slug);
  const enrolled = await isEnrolledInCourse(course.slug);
  const progress = enrolled ? await getCourseProgress(course.slug) : null;
  const percent = progress?.percent ?? 0;

  return (
    <>
      <JsonLd data={courseJsonLd(course)} />
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
      <div className="relative mb-8 overflow-hidden rounded-[2rem] border mm-border">
        <Image
          src={course.imageUrl}
          alt={course.title}
          width={1200}
          height={480}
          className="aspect-[5/2] w-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="violet">{course.mode}</Badge>
            <Badge tone="neutral">{course.duration}</Badge>
            <Badge tone="neutral">{course.level}</Badge>
            {enrolled ? <Badge tone="violet">Enrolled</Badge> : null}
          </div>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-5xl">{course.title}</h1>
        </div>
      </div>

      <section className="mm-card-premium rounded-3xl p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
          <div>
            <p className="text-sm leading-7 mm-muted">{course.longDescription}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {course.tags.slice(0, 5).map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-600 ring-1 ring-zinc-200 dark:bg-white/5 dark:text-white/70 dark:ring-white/10"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {course.learnOutcomes.slice(0, 4).map((o) => (
                <div key={o} className="flex items-start gap-3 rounded-2xl border mm-border bg-zinc-50/80 p-4 dark:bg-white/[0.02]">
                  <CheckCircle2 size={18} className="mt-0.5 text-emerald-500 dark:text-emerald-400" />
                  <p className="text-sm font-bold text-zinc-800 dark:text-white/80">{o}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="mm-glass-premium rounded-3xl p-5">
              <p className="text-sm font-semibold mm-subtle">Enroll</p>
              <p className="mt-2 text-2xl font-bold mm-heading">{course.priceLabel}</p>

              <div className="mt-5 flex flex-col gap-3">
                {enrolled ? (
                  <>
                    {percent > 0 && percent < 100 ? (
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-400/20 dark:bg-emerald-400/10">
                        <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-200">
                          <span>Your progress</span>
                          <span>{percent}%</span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-emerald-200 dark:bg-emerald-900/40">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    ) : null}
                    <Link
                      href={percent >= 100 ? `/dashboard/my-courses/${course.slug}/certificate` : `/dashboard/my-courses/${course.slug}`}
                      className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-4 text-sm font-bold text-white transition hover:bg-emerald-700"
                    >
                      {percent >= 100 ? "View certificate" : "Continue learning"}
                    </Link>
                    <Link
                      href="/dashboard/my-courses"
                      className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-4 text-sm font-bold mm-heading dark:border-white/15 dark:bg-white/5"
                    >
                      Go to my courses
                    </Link>
                  </>
                ) : paymentsEnabled ? (
                  <EnrollButton
                    courseSlug={course.slug}
                    courseTitle={course.title}
                    amountInPaise={course.priceInPaise}
                    priceLabel={course.priceLabel}
                  />
                ) : (
                  <Button href={signupUrl(course.slug)} variant="primary" size="lg">
                    Apply now
                  </Button>
                )}
                <Button href={contactUrl(course.slug)} variant="secondary" size="lg">
                  Book a call
                </Button>

                <div className="rounded-2xl border mm-border bg-zinc-50/80 p-4 dark:bg-white/[0.02]">
                  <div className="flex items-center gap-2">
                    <Download size={16} className="mm-muted" />
                    <p className="text-sm font-bold text-zinc-800 dark:text-white/80">Course syllabus</p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {pdfAvailable ? (
                      <a
                        href={syllabusPdfUrl(course.slug)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkButtonClass}
                      >
                        <Download size={14} />
                        Download PDF
                      </a>
                    ) : null}
                    <a href={syllabusPrintUrl(course.slug)} className={linkButtonClass}>
                      {pdfAvailable ? "View & print" : "View & print PDF"}
                    </a>
                    <a href={syllabusUrl(course.slug)} download className={linkButtonClass}>
                      <Download size={14} />
                      .txt
                    </a>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs font-bold mm-subtle">
                    <Sparkles size={14} />
                    Weekly mentorship included
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-[0.22em] mm-subtle">What you get</p>
                <ul className="mt-3 space-y-2">
                  {[
                    "Mentor sessions + feedback",
                    "Milestone guidance",
                    "Capstone deliverables",
                    "Portfolio-ready outputs",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm font-bold mm-muted">
                      <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-white/50" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="mt-12 grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-10">
          <div>
            <SectionHeader eyebrow="Overview" title="What you'll learn" />
            <ul className="mt-6 space-y-3">
              {course.learnOutcomes.map((o) => (
                <li key={o} className="flex items-start gap-3 rounded-2xl border mm-border bg-zinc-50/80 p-4 dark:bg-white/[0.02]">
                  <CheckCircle2 size={18} className="mt-0.5 text-emerald-500 dark:text-emerald-400" />
                  <span className="text-sm font-bold text-zinc-700 dark:text-white/75">{o}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionHeader eyebrow="Curriculum outline" title="Weekly milestones" />
            <div className="mt-6 space-y-4">
              {course.curriculum.map((item) => (
                <details
                  key={item.week}
                  className="group rounded-3xl border mm-border bg-zinc-50/80 p-5 open:bg-zinc-100 dark:bg-white/[0.02] dark:open:bg-white/10"
                >
                  <summary className="cursor-pointer list-none">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-bold mm-muted">{item.week}</p>
                      <span className="text-xs font-bold mm-subtle transition group-open:mm-muted">
                        View topics
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.topics.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-600 ring-1 ring-zinc-200 dark:bg-white/5 dark:text-white/65 dark:ring-white/10"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </summary>
                </details>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div>
            <SectionHeader
              eyebrow="Who this is for"
              title={`A best-fit for ${course.level}`}
              description={`This track is built for learners who want ${course.shortDescription.toLowerCase()}. You'll learn with structured milestones and mentor feedback so you always know how to progress.`}
            />

            <div className="mt-6 rounded-3xl border mm-border bg-zinc-50/80 p-6 dark:bg-white/[0.02]">
              <p className="text-sm font-bold text-zinc-800 dark:text-white/80">Mentor support</p>
              <p className="mt-3 text-sm leading-7 mm-muted">
                You'll receive regular touchpoints with mentors for review, guidance, and decision-making coaching.
                The goal is not just completion—it's building proof.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                {["Feedback windows", "Milestone check-ins", "Code review style guidance"].map((s) => (
                  <span key={s} className="rounded-2xl border mm-border bg-white/80 px-4 py-2 text-xs font-semibold mm-muted dark:bg-white/[0.04]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <SectionHeader eyebrow="FAQs" title="Common questions" />
            <div className="mt-6 rounded-3xl border mm-border bg-zinc-50/80 p-4 sm:p-6 dark:bg-white/[0.02]">
              <FAQAccordion items={course.faqs} />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href={signupUrl(course.slug)} variant="primary" size="lg">
                Apply for this course
              </Button>
              <Button href="/courses" variant="secondary" size="lg">
                Back to catalog
              </Button>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
