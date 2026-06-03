import type { Metadata } from "next";
import Image from "next/image";
import { BarChart3, BriefcaseBusiness, GraduationCap, Mail, Sparkles } from "lucide-react";

import Button from "@/components/marketing/Button";
import MarketingPageHero from "@/components/marketing/MarketingPageHero";
import SectionHeader from "@/components/marketing/SectionHeader";
import StepsTimeline, { type StepModel } from "@/components/marketing/StepsTimeline";
import { getBookingUrl } from "@/lib/booking-url";
import { marketingPageMetadata } from "@/lib/seo";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = marketingPageMetadata({
  path: "/about",
  title: "About",
  description:
    "Mindfull Methods helps learners build career-ready skills through structured mentorship, milestone guidance, and portfolio projects.",
});

export default async function AboutPage() {
  const { mentor } = await getSiteContent();
  const bookingUrl = getBookingUrl();

  const steps: StepModel[] = [
    {
      title: "Apply & align",
      description: "Share your goals. We match you to the track that fits your starting point.",
      icon: BriefcaseBusiness,
    },
    {
      title: "Learn by shipping",
      description: "Weekly milestones turn learning into proof you can show.",
      icon: Sparkles,
    },
    {
      title: "Mentored delivery",
      description: "You receive feedback windows and mentor coaching until you're ready to present.",
      icon: GraduationCap,
    },
  ];

  return (
    <>
      <MarketingPageHero
        eyebrow="About Mindfull Methods"
        title="A mentorship model built for outcomes"
        description="We believe learning should feel guided, structured, and practical. Instead of scattered content, you'll follow a clear path with mentor touchpoints and portfolio-ready deliverables."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/courses" variant="primary" size="lg">
            Explore courses
          </Button>
          <Button href={bookingUrl} variant="secondary" size="lg">
            Book a free call
          </Button>
        </div>
      </MarketingPageHero>

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <section className="mm-card-premium rounded-3xl p-6 sm:p-8">
          <p className="mm-pro-eyebrow">Our mission</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              { title: "Clarity", desc: 'You always know the next milestone—and what "good" looks like.', icon: Sparkles },
              { title: "Feedback", desc: "Mentor support focuses on decisions, not just completion.", icon: GraduationCap },
              { title: "Proof", desc: "Ship work you can present with confidence and measurable outcomes.", icon: BarChart3 },
            ].map((c) => (
              <div key={c.title} className="flex items-start gap-4 rounded-2xl border mm-border bg-zinc-50/80 p-4 dark:bg-white/[0.02]">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-zinc-950 text-white dark:bg-zinc-950">
                  <c.icon size={18} />
                </span>
                <div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white/85">{c.title}</p>
                  <p className="mt-2 text-sm leading-6 mm-muted">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <SectionHeader
            eyebrow="Who we are"
            title="Built by practitioners, for career switchers and upskillers"
            description="Mindfull Methods started with a simple idea: learners do not need more videos — they need structure, feedback, and proof."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="mm-card-premium overflow-hidden rounded-3xl">
              <div className="relative aspect-[4/5] w-full sm:aspect-[3/4]">
                <Image
                  src={mentor.imageUrl}
                  alt={mentor.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 480px"
                  priority
                />
              </div>
              <div className="p-6 sm:p-8">
                <p className="mm-pro-eyebrow">Lead mentor</p>
                <h3 className="mt-2 text-2xl font-bold mm-heading">{mentor.name}</h3>
                <p className="mt-1 text-sm font-semibold text-violet-600 dark:text-violet-300">{mentor.title}</p>
                <a
                  href={`mailto:${mentor.email}`}
                  className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-violet-600 hover:underline dark:text-violet-300"
                >
                  <Mail size={14} />
                  {mentor.email}
                </a>
              </div>
            </div>
            <div className="mm-section-panel">
              <p className="text-sm leading-7 mm-muted">{mentor.bio}</p>
              <ul className="mt-6 space-y-4 text-sm leading-7 mm-muted">
                <li>
                  <strong className="mm-heading">Weekly clarity</strong> — always know the next milestone and what good
                  looks like.
                </li>
                <li>
                  <strong className="mm-heading">Mentor reviews</strong> — feedback on real deliverables, not quizzes.
                </li>
                <li>
                  <strong className="mm-heading">Portfolio proof</strong> — capstones and verified certificates.
                </li>
                <li>
                  <strong className="mm-heading">Career momentum</strong> — internships and applications in your
                  dashboard.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <SectionHeader
            eyebrow="How we teach"
            title="A simple rhythm you can follow"
            description="Apply, learn through weekly milestones, and build proof with mentor guidance until you're ready for your next step."
          />
          <div className="mt-10">
            <StepsTimeline steps={steps} />
          </div>
        </section>

        <section className="mt-12">
          <div className="mm-card-premium overflow-hidden rounded-3xl p-8 sm:p-12">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <SectionHeader
                eyebrow="Ready?"
                title="Book a free call and get matched"
                description="If you're unsure which track fits, tell us your goals. We'll recommend the best path forward."
              />
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end lg:flex-col lg:justify-start">
                <Button href={bookingUrl} variant="primary" size="lg">
                  Book Free Call
                </Button>
                <Button href="/courses" variant="secondary" size="lg">
                  Browse courses
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
