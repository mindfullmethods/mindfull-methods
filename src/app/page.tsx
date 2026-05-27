import { BarChart3, BriefcaseBusiness, GraduationCap, ShieldCheck, Sparkles, Star } from "lucide-react";

import Badge from "@/components/marketing/Badge";
import Button from "@/components/marketing/Button";
import CourseCard from "@/components/marketing/CourseCard";
import FAQAccordion from "@/components/marketing/FAQAccordion";
import Footer from "@/components/marketing/Footer";
import Navbar from "@/components/marketing/Navbar";
import StatsStrip from "@/components/marketing/StatsStrip";
import StepsTimeline, { type StepModel } from "@/components/marketing/StepsTimeline";
import TestimonialCard from "@/components/marketing/TestimonialCard";

import { getCourses, getFeaturedCourses } from "@/lib/courses";
import { getFaqs } from "@/lib/faqs";
import { getTestimonials } from "@/lib/testimonials";

export default function HomePage() {
  const featured = getFeaturedCourses();
  const courses = getCourses();
  const testimonials = getTestimonials();
  const faqs = getFaqs();

  const steps: StepModel[] = [
    {
      title: "Apply & pick your track",
      description: "Tell us your goals. We match you to the right structured mentorship course.",
      icon: BriefcaseBusiness,
    },
    {
      title: "Learn with weekly milestones",
      description: "Cohort-based learning with clear outcomes, exercises, and mentor touchpoints.",
      icon: Sparkles,
    },
    {
      title: "Get mentored & build proof",
      description: "Ship guided projects, receive feedback, and leave with a portfolio-ready result.",
      icon: GraduationCap,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f8f5] text-zinc-950 dark:bg-zinc-950 dark:text-white">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-white/10 bg-zinc-950 px-5 py-16 text-white sm:px-8 lg:px-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.35),transparent_55%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(20,184,166,0.25),transparent_50%)]" />

          <div className="relative mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.95fr_1.05fr] md:items-center">
            <div>
              <Badge tone="violet">Mentorship-first learning</Badge>
              <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Learn courses the way mentors teach
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
                A curated catalog of structured programs with real mentorship, milestone guidance, and practical
                outcomes.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button href="/courses" variant="primary" size="lg">
                  Browse courses
                </Button>
                <Button href="/contact" variant="secondary" size="lg">
                  Book a free call
                </Button>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Mentor sessions", value: "Weekly" },
                  { label: "Project-based", value: "Yes" },
                  { label: "Career support", value: "Included" },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-bold text-white/60">{s.label}</p>
                    <p className="mt-1 text-xl font-black">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-10 -z-10 rounded-[3rem] bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.35),transparent_60%)] blur-2xl" />

              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur">
                <img
                  src="/brand-assets/deployment-linkedin-post.png"
                  alt="Mindfull Methods preview"
                  className="aspect-[16/10] w-full rounded-2xl object-cover"
                />
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={18} className="text-white/80" />
                    <p className="text-sm font-black text-white/80">Structured track</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/70">
                    Milestones, feedback windows, and guided projects—so you always know what to do next.
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-3">
                    <BarChart3 size={18} className="text-white/80" />
                    <p className="text-sm font-black text-white/80">Measurable progress</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/70">
                    You track outcomes as you learn—then present proof in a portfolio-ready format.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust / Stats */}
        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="text-sm font-black uppercase tracking-[0.28em] text-white/60">Trusted mentorship</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
                Built for outcomes, not just content
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-white/70">
                From enrollment to final capstone, you’ll get coaching designed to move you forward.
              </p>
            </div>
            <div className="w-full max-w-2xl">
              <StatsStrip
                stats={[
                  { label: "Courses available", value: String(courses.length) },
                  { label: "Student outcomes", value: "Portfolio-ready" },
                  { label: "Mentor touchpoints", value: "Weekly" },
                  { label: "Average rating", value: "4.9" },
                ]}
              />
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="border-y border-white/10 bg-[#f7f8f5] px-5 py-16 text-zinc-950 sm:px-8 lg:px-10 dark:bg-zinc-950 dark:text-white">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.28em] text-violet-700 dark:text-violet-300">
                Why our mentorship works
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">A learning system that sticks</h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Real mentor feedback",
                  description: "Weekly coaching and targeted reviews so you improve fast.",
                  icon: ShieldCheck,
                },
                {
                  title: "Structured milestones",
                  description: "Clear outcomes and step-by-step guidance from day one.",
                  icon: Sparkles,
                },
                {
                  title: "Practical projects",
                  description: "Ship guided work and build proof with a capstone result.",
                  icon: BriefcaseBusiness,
                },
                {
                  title: "Career-ready delivery",
                  description: "Present your outcomes in a portfolio format recruiters understand.",
                  icon: BarChart3,
                },
              ].map((f) => (
                <article
                  key={f.title}
                  className="rounded-3xl border border-black/10 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                      <f.icon size={18} />
                    </span>
                    <p className="text-sm font-black">{f.title}</p>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-zinc-700 dark:text-white/70">{f.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Courses */}
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.28em] text-white/60">Featured courses</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-zinc-950 dark:text-white sm:text-5xl">
                Programs you can finish with proof
              </h2>
            </div>
            <Button href="/courses" variant="secondary" size="md">
              View all courses
            </Button>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => (
              <CourseCard
                key={c.slug}
                course={{
                  slug: c.slug,
                  title: c.title,
                  shortDescription: c.shortDescription,
                  level: c.level,
                  duration: c.duration,
                  mode: c.mode,
                  tags: c.tags,
                  priceLabel: c.priceLabel,
                  imageUrl: c.imageUrl,
                }}
              />
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="border-y border-white/10 bg-zinc-950 px-5 py-16 text-white sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.28em] text-white/60">How it works</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">From apply to finished work</h2>
              <p className="mt-4 text-sm leading-7 text-white/70">
                A simple rhythm: apply, learn with milestones, and get mentored as you build proof.
              </p>
            </div>

            <div className="mt-10">
              <StepsTimeline steps={steps} />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-white/60">What learners say</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-zinc-950 dark:text-white sm:text-5xl">
              Mentorship that feels personal
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <TestimonialCard key={t.name} quote={t.quote} name={t.name} role={t.role} rating={t.rating} />
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="border-y border-white/10 bg-zinc-950 px-5 py-16 text-white sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.28em] text-white/60">FAQ</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Questions, answered</h2>
              <p className="mt-4 text-sm leading-7 text-white/70">
                If you’re deciding between tracks, these answers will help you choose confidently.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm">
              <FAQAccordion items={faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-5 py-16 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-zinc-950 p-8 text-white shadow-2xl sm:p-12">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.28em] text-white/60">Ready?</p>
                <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                  Get matched to the right course in minutes
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/70">
                  Share your goals and we’ll recommend the best track. No pressure, just mentorship guidance.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end lg:flex-col lg:justify-start">
                <Button href="/contact" variant="primary" size="lg">
                  Book a free call
                </Button>
                <Button href="/courses" variant="secondary" size="lg">
                  Browse courses
                </Button>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4 text-sm font-bold text-white/70">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <Star size={16} className="fill-white/80 text-white/80" />
                4.9 average rating
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <ShieldCheck size={16} className="text-white/80" />
                Mentor-guided cohorts
              </span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

