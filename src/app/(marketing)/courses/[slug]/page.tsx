import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2, Download, Sparkles } from "lucide-react";

import EnrollButton from "@/components/marketing/EnrollButton";
import Button from "@/components/marketing/Button";
import Badge from "@/components/marketing/Badge";
import FAQAccordion from "@/components/marketing/FAQAccordion";
import JsonLd from "@/components/marketing/JsonLd";
import { getCourseBySlug, getCourseSlugs } from "@/lib/courses";
import { isRazorpayConfigured } from "@/lib/razorpay";
import { absoluteUrl, courseJsonLd } from "@/lib/seo";
import { contactUrl, pageTitle, signupUrl, syllabusPdfUrl, syllabusPrintUrl, syllabusUrl } from "@/lib/site";
import { hasSyllabusPdf } from "@/lib/syllabus-files";
import type { Metadata } from "next";

const linkButtonClass =
  "inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-2.5 text-sm font-black text-zinc-950 transition hover:bg-zinc-200 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15";

export function generateStaticParams() {
  return getCourseSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) {
    return { title: "Course not found" };
  }

  const path = `/courses/${slug}`;

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
  const course = getCourseBySlug(slug);

  if (!course) notFound();

  const paymentsEnabled = isRazorpayConfigured();
  const pdfAvailable = hasSyllabusPdf(course.slug);

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
          </div>
          <h1 className="mt-4 max-w-3xl text-3xl font-black tracking-tight text-white sm:text-5xl">{course.title}</h1>
        </div>
      </div>

      <section className="mm-card rounded-[2.5rem] p-6 sm:p-8">
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
                <div key={o} className="flex items-start gap-3 mm-card-muted rounded-2xl p-4">
                  <CheckCircle2 size={18} className="mt-0.5 text-emerald-500 dark:text-emerald-400" />
                  <p className="text-sm font-bold text-zinc-800 dark:text-white/80">{o}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="mm-card-muted rounded-3xl p-5 backdrop-blur">
              <p className="text-sm font-black mm-subtle">Enroll</p>
              <p className="mt-2 text-2xl font-black mm-heading">{course.priceLabel}</p>

              <div className="mt-5 flex flex-col gap-3">
                {paymentsEnabled ? (
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

                <div className="mm-card-muted rounded-2xl p-4">
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
            <p className="mm-eyebrow">Overview</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight mm-heading">What you’ll learn</h2>
            <ul className="mt-6 space-y-3">
              {course.learnOutcomes.map((o) => (
                <li key={o} className="flex items-start gap-3 mm-card-muted rounded-2xl p-4">
                  <CheckCircle2 size={18} className="mt-0.5 text-emerald-500 dark:text-emerald-400" />
                  <span className="text-sm font-bold text-zinc-700 dark:text-white/75">{o}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mm-eyebrow">Curriculum outline</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight mm-heading">Weekly milestones</h2>
            <div className="mt-6 space-y-4">
              {course.curriculum.map((item) => (
                <details
                  key={item.week}
                  className="group mm-card-muted rounded-3xl p-5 open:bg-zinc-100 dark:open:bg-white/10"
                >
                  <summary className="cursor-pointer list-none">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-black mm-muted">{item.week}</p>
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
            <p className="mm-eyebrow">Who this is for</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight mm-heading">A best-fit for {course.level}</h2>
            <p className="mt-5 text-sm leading-7 mm-muted">
              This track is built for learners who want {course.shortDescription.toLowerCase()}. You’ll learn with
              structured milestones and mentor feedback so you always know how to progress.
            </p>

            <div className="mt-6 mm-card-muted rounded-3xl p-6">
              <p className="text-sm font-black text-zinc-800 dark:text-white/80">Mentor support</p>
              <p className="mt-3 text-sm leading-7 mm-muted">
                You’ll receive regular touchpoints with mentors for review, guidance, and decision-making coaching.
                The goal is not just completion—it’s building proof.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                {["Feedback windows", "Milestone check-ins", "Code review style guidance"].map((s) => (
                  <span key={s} className="mm-card-muted rounded-2xl px-4 py-2 text-xs font-bold mm-muted">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="mm-eyebrow">FAQs</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight mm-heading">Common questions</h2>
            <div className="mt-6 mm-card-muted rounded-3xl p-4 sm:p-6">
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
