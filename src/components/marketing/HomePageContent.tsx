import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

import Badge from "@/components/marketing/Badge";
import ThemedBrandLogo from "@/components/marketing/ThemedBrandLogo";
import Button from "@/components/marketing/Button";
import CourseCard from "@/components/marketing/CourseCard";
import FAQAccordion from "@/components/marketing/FAQAccordion";
import SectionHeader from "@/components/marketing/SectionHeader";
import StatsStrip from "@/components/marketing/StatsStrip";
import StepsTimeline, { type StepModel } from "@/components/marketing/StepsTimeline";
import TestimonialCard from "@/components/marketing/TestimonialCard";

import { getCourses, getFeaturedCourses } from "@/lib/courses";
import { getFaqs } from "@/lib/faqs";
import { marketingImages } from "@/lib/images";
import { getTestimonials } from "@/lib/testimonials";
import { signupUrl } from "@/lib/site";

const trustBadges = ["10K+ learners", "Weekly mentorship", "Portfolio projects", "Career support"];

const benefits = [
  {
    title: "Real mentor feedback",
    description: "Weekly coaching and targeted reviews so you improve fast.",
    icon: ShieldCheck,
    accent: "from-violet-600/15 to-violet-600/5",
  },
  {
    title: "Structured milestones",
    description: "Clear outcomes and step-by-step guidance from day one.",
    icon: Sparkles,
    accent: "from-violet-600/15 to-violet-600/5",
  },
  {
    title: "Practical projects",
    description: "Ship guided work and build proof with a capstone result.",
    icon: BriefcaseBusiness,
    accent: "from-violet-600/15 to-violet-600/5",
  },
  {
    title: "Career-ready delivery",
    description: "Present your outcomes in a portfolio format recruiters understand.",
    icon: BarChart3,
    accent: "from-violet-600/15 to-violet-600/5",
  },
];

export default function HomePageContent() {
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
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b mm-border px-5 pb-12 pt-8 sm:px-8 sm:pb-20 sm:pt-12 lg:px-10 lg:pb-28 lg:pt-16">
        <div className="pointer-events-none absolute inset-0 mm-grid-bg opacity-40" />
        <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-violet-600/15 blur-[100px]" />
        <div className="pointer-events-none absolute -right-16 top-24 h-72 w-72 rounded-full bg-violet-600/10 blur-[110px]" />

        <div className="relative mx-auto grid max-w-7xl items-start gap-8 sm:gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          {/* Copy */}
          <div>
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <Badge tone="violet">Mentorship-first learning</Badge>
              <span className="inline-flex items-center gap-2 rounded-full mm-pill px-3 py-1.5 text-xs font-bold">
                <Star size={12} className="fill-amber-300 text-amber-300" />
                4.9 learner rating
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-bold leading-[1.12] tracking-tight text-zinc-950 sm:mt-6 sm:text-5xl lg:text-[3.25rem] dark:text-white">
              Learn courses{" "}
              <span className="mm-gradient-text">the way mentors teach</span>
            </h1>

            <p className="mt-4 max-w-xl text-[15px] leading-7 mm-muted sm:mt-5 sm:text-base sm:leading-8">
              Mindfull Methods offers structured certification programs with live mentorship, milestone
              guidance, and practical outcomes—so you finish with proof, not just certificates.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
              <Button href={signupUrl()} variant="gradient" size="lg">
                Get started free <ArrowRight size={18} />
              </Button>
              <Button href="/courses" variant="secondary" size="lg">
                Browse courses
              </Button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-6 sm:gap-5">
              <div className="flex -space-x-3">
                {["A", "M", "J", "S"].map((initial) => (
                  <span
                    key={initial}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#f7f8f5] bg-gradient-to-br from-violet-500 to-teal-400 text-xs font-black text-white sm:h-10 sm:w-10 dark:border-zinc-950"
                  >
                    {initial}
                  </span>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold mm-heading">Trusted by ambitious learners</p>
                <p className="text-xs font-medium mm-subtle">Cohorts · Projects · Career support</p>
              </div>
            </div>

            <div className="mt-5 hidden gap-3 sm:mt-8 sm:grid sm:grid-cols-3">
              {[
                { label: "Mentor sessions", value: "Weekly" },
                { label: "Project-based", value: "Yes" },
                { label: "Career support", value: "Included" },
              ].map((s) => (
                <div key={s.label} className="mm-glass-premium rounded-2xl p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] mm-subtle">{s.label}</p>
                  <p className="mt-1 text-lg font-bold mm-heading">{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="pointer-events-none absolute -inset-4 hidden rounded-[2rem] bg-violet-600/10 blur-2xl sm:block lg:-inset-8" />

            <div className="relative">
              <div className="mm-gradient-border mm-hero-frame relative overflow-hidden rounded-2xl p-0.5 sm:p-1 sm:rounded-[2rem]">
                <div className="overflow-hidden rounded-[0.85rem] bg-zinc-100 p-1.5 dark:bg-zinc-950/80 sm:rounded-[1.85rem] sm:p-2.5">
                  <img
                    src={marketingImages.hero}
                    alt="Students collaborating during a mentorship session"
                    className="aspect-[16/10] w-full rounded-xl object-cover ring-1 ring-white/30 sm:aspect-[4/3] sm:rounded-2xl dark:ring-white/10"
                  />
                </div>
              </div>

              {/* Logo — floats off top-left of frame (outside overflow-hidden) */}
              <div className="absolute -left-2 top-5 z-20 sm:-left-3 sm:top-8 lg:-left-6">
                <div className="mm-animate-float mm-glass-premium rounded-xl px-3 py-2.5 shadow-lg sm:rounded-2xl sm:px-4 sm:py-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <ThemedBrandLogo size="sm" />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold mm-heading">Mindfull Methods</p>
                      <p className="text-[10px] font-medium uppercase tracking-[0.14em] mm-subtle sm:tracking-[0.18em]">
                        Live cohorts
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating — floats off bottom-right of frame */}
              <div className="absolute -bottom-3 -right-2 z-20 sm:-bottom-4 sm:-right-4 lg:-right-6">
                <div className="mm-glass-premium rounded-xl px-3 py-2.5 shadow-lg sm:rounded-2xl sm:px-4 sm:py-3">
                  <p className="text-[10px] font-medium uppercase tracking-[0.14em] mm-subtle sm:tracking-[0.16em]">
                    Avg. rating
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-base font-bold mm-heading sm:mt-1 sm:text-lg">
                    4.9 <Star size={14} className="fill-amber-300 text-amber-300 sm:h-4 sm:w-4" />
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 grid gap-2 sm:mt-4 sm:grid-cols-2 sm:gap-3">
              {[
                {
                  title: "Structured track",
                  copy: "Milestones and guided projects so you always know what to do next.",
                  icon: ShieldCheck,
                },
                {
                  title: "Measurable progress",
                  copy: "Track outcomes and present proof in a portfolio-ready format.",
                  icon: BarChart3,
                },
              ].map((card) => (
                <div key={card.title} className="mm-glass-premium rounded-xl p-3.5 sm:rounded-2xl sm:p-4">
                  <div className="flex items-center gap-2">
                    <card.icon size={16} className="shrink-0 text-violet-600 dark:text-violet-300" />
                    <p className="text-sm font-semibold mm-heading">{card.title}</p>
                  </div>
                  <p className="mt-1.5 text-xs leading-5 mm-muted sm:mt-2 sm:text-sm sm:leading-6">{card.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b mm-border bg-zinc-50/80 px-5 py-4 dark:bg-zinc-950/50 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {trustBadges.map((badge, i) => (
            <span key={badge} className="inline-flex items-center gap-6">
              {i > 0 ? <span className="hidden text-zinc-300 sm:inline dark:text-zinc-700">|</span> : null}
              {badge}
            </span>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute right-0 top-10 h-56 w-56 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            eyebrow="Trusted mentorship"
            title="Built for outcomes, not just content"
            description="From enrollment to final capstone, you'll get coaching designed to move you forward."
          />
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
      <section className="relative overflow-hidden border-y mm-border px-5 py-20 sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-violet-100/50 via-transparent to-teal-100/30 dark:from-violet-950/20 dark:to-teal-950/10" />
        <div className="relative mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Why our mentorship works"
            title="A learning system that sticks"
            gradientTitle
          />

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((f) => (
              <article
                key={f.title}
                className="group mm-card-premium rounded-3xl p-6 transition hover:-translate-y-1"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${f.accent} text-violet-700 ring-1 ring-violet-200 dark:text-white dark:ring-white/10`}
                >
                  <f.icon size={22} />
                </div>
                <h3 className="mt-5 text-base font-semibold mm-heading">{f.title}</h3>
                <p className="mt-3 text-sm leading-6 mm-muted">{f.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow="Featured courses"
            title="Programs you can finish with proof"
            description="Pick a track, follow milestones, and leave with work you can show."
          />
          <Button href="/courses" variant="secondary" size="md">
            View all courses <ArrowRight size={16} />
          </Button>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      <section className="relative overflow-hidden border-y mm-border px-5 py-20 sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute inset-0 mm-grid-bg opacity-30" />
        <div className="relative mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="How it works"
            title="From apply to finished work"
            description="A simple rhythm: apply, learn with milestones, and get mentored as you build proof."
            gradientTitle
          />
          <div className="mt-12">
            <StepsTimeline steps={steps} />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <SectionHeader
          eyebrow="What learners say"
          title="Mentorship that feels personal"
          description="Real feedback, real projects, and outcomes learners are proud to share."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} quote={t.quote} name={t.name} role={t.role} rating={t.rating} />
          ))}
        </div>
      </section>

      {/* Blog */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="mm-card-premium flex flex-col items-start justify-between gap-6 rounded-3xl p-8 sm:flex-row sm:items-center">
          <div>
            <p className="mm-pro-eyebrow">From the blog</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
              Guides for your next step
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-7 mm-muted">
              Choosing a track, week-one expectations, and how mentorship accelerates outcomes.
            </p>
          </div>
          <Button href="/blog" variant="gradient" size="lg" className="shrink-0">
            Read the blog <ArrowRight size={18} />
          </Button>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-y mm-border mm-section-muted px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeader
            eyebrow="FAQ"
            title="Questions, answered"
            description="If you're deciding between tracks, these answers will help you choose confidently."
          />
          <div className="mm-glass-premium rounded-3xl p-6 sm:p-8">
            <FAQAccordion items={faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 py-20 sm:px-8 lg:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-950 shadow-xl dark:border-white/10">
          <div className="relative overflow-hidden px-8 py-12 sm:px-12 sm:py-14">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-600/15 blur-3xl" />

            <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                  <Users size={14} />
                  Join the next cohort
                </div>
                <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Get matched to the right course in{" "}
                  <span className="text-violet-300">minutes</span>
                </h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-white/70">
                  Share your goals and we'll recommend the best track. No pressure, just mentorship
                  guidance.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
                <Button href={signupUrl()} variant="gradient" size="lg">
                  Get started free <ArrowRight size={18} />
                </Button>
                <Button
                  href="/contact"
                  variant="secondary"
                  size="lg"
                  className="border-white/20 bg-white/10 text-white hover:bg-white/15"
                >
                  Book a free call
                </Button>
              </div>
            </div>

            <div className="relative mt-10 flex flex-wrap items-center gap-4 text-sm font-bold text-white/70">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <Star size={16} className="fill-amber-300 text-amber-300" />
                4.9 average rating
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <ShieldCheck size={16} className="text-violet-300" />
                Mentor-guided cohorts
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
