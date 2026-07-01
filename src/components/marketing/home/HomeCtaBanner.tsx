import { ArrowRight, Phone } from "lucide-react";

import Button from "@/components/marketing/Button";
import { getBookingUrl, isExternalBooking } from "@/lib/booking-url";
import { signupUrl } from "@/lib/site";

export default function HomeCtaBanner() {
  const bookingUrl = getBookingUrl();
  const bookingExternal = isExternalBooking();

  return (
    <section className="mm-landing-section px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-violet-400/20 px-6 py-14 text-center sm:px-12 sm:py-16">
        <div className="pointer-events-none absolute inset-0 mm-landing-cta-glow" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />

        <div className="relative">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
            Supercharge your AI career with{" "}
            <span className="bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
              mentorship
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
            Join a cohort, follow weekly milestones, and finish with mentor-reviewed capstone work and a
            verifiable certificate.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              href={signupUrl()}
              variant="gradient"
              size="lg"
              className="rounded-full px-8 shadow-[0_0_40px_-8px_rgba(139,92,246,0.7)]"
            >
              Get started free <ArrowRight size={18} />
            </Button>
            <a
              href={bookingUrl}
              {...(bookingExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-400/40 bg-white/5 px-8 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <Phone size={16} /> Talk to our team
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
