import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2, Download, Sparkles } from "lucide-react";

import Button from "@/components/marketing/Button";
import Badge from "@/components/marketing/Badge";
import FAQAccordion from "@/components/marketing/FAQAccordion";
import { getCourseBySlug, getCourseSlugs } from "@/lib/courses";
import { contactUrl, signupUrl, syllabusUrl } from "@/lib/site";
import type { Metadata } from "next";

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

  return {
    title: course.title,
    description: course.shortDescription,
    openGraph: {
      title: course.title,
      description: course.shortDescription,
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

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
      <div className="relative mb-8 overflow-hidden rounded-[2rem] border border-white/10">
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

      {/* Hero */}
      <section className="rounded-[2.5rem] border border-white/10 bg-zinc-950 p-6 shadow-2xl sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
          <div>
            <p className="text-sm leading-7 text-white/70">{course.longDescription}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {course.tags.slice(0, 5).map((t) => (
                <span key={t} className="rounded-full bg-white/5 px-3 py-1 text-xs font-bold text-white/70 ring-1 ring-white/10">
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {course.learnOutcomes.slice(0, 4).map((o) => (
                <div key={o} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <CheckCircle2 size={18} className="mt-0.5 text-emerald-400" />
                  <p className="text-sm font-bold text-white/80">{o}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-sm font-black text-white/60">Enroll</p>
              <p className="mt-2 text-2xl font-black text-white">{course.priceLabel}</p>

              <div className="mt-5 flex flex-col gap-3">
                <Button href={signupUrl(course.slug)} variant="primary" size="lg">
                  Apply now
                </Button>
                <Button href={contactUrl(course.slug)} variant="secondary" size="lg">
                  Book a call
                </Button>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2">
                    <Download size={16} className="text-white/70" />
                    <p className="text-sm font-bold text-white/80">Download syllabus</p>
                  </div>
                  <a
                    href={syllabusUrl(course.slug)}
                    download
                    className="mt-3 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-black text-white transition hover:bg-white/15"
                  >
                    <Download size={14} />
                    Get syllabus (.txt)
                  </a>
                  <div className="mt-3 flex items-center gap-2 text-xs font-bold text-white/50">
                    <Sparkles size={14} />
                    Weekly mentorship included
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/50">
                  What you get
                </p>
                <ul className="mt-3 space-y-2">
                  {[
                    "Mentor sessions + feedback",
                    "Milestone guidance",
                    "Capstone deliverables",
                    "Portfolio-ready outputs",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm font-bold text-white/70">
                      <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Content */}
      <section className="mt-12 grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-10">
          {/* Overview */}
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-white/60">Overview</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white">What you’ll learn</h2>
            <ul className="mt-6 space-y-3">
              {course.learnOutcomes.map((o) => (
                <li key={o} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <CheckCircle2 size={18} className="mt-0.5 text-emerald-400" />
                  <span className="text-sm font-bold text-white/75">{o}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Curriculum */}
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-white/60">Curriculum outline</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white">Weekly milestones</h2>
            <div className="mt-6 space-y-4">
              {course.curriculum.map((item) => (
                <details
                  key={item.week}
                  className="group rounded-3xl border border-white/10 bg-white/5 p-5 open:bg-white/10"
                >
                  <summary className="cursor-pointer list-none">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-black text-white/70">{item.week}</p>
                      <span className="text-xs font-bold text-white/50 transition group-open:text-white/70">
                        View topics
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.topics.map((t) => (
                        <span key={t} className="rounded-full bg-white/5 px-3 py-1 text-xs font-bold text-white/65 ring-1 ring-white/10">
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
          {/* Who this is for */}
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-white/60">Who this is for</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white">A best-fit for {course.level}</h2>
            <p className="mt-5 text-sm leading-7 text-white/70">
              This track is built for learners who want {course.shortDescription.toLowerCase()}. You’ll learn with
              structured milestones and mentor feedback so you always know how to progress.
            </p>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-black text-white/80">Mentor support</p>
              <p className="mt-3 text-sm leading-7 text-white/70">
                You’ll receive regular touchpoints with mentors for review, guidance, and decision-making coaching.
                The goal is not just completion—it’s building proof.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                {["Feedback windows", "Milestone check-ins", "Code review style guidance"].map((s) => (
                  <span key={s} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white/70">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-white/60">FAQs</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white">Common questions</h2>
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6">
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
  );
}

