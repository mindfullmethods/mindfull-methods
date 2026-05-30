import type { Metadata } from "next";

import { marketingPageMetadata } from "@/lib/seo";

export const metadata: Metadata = marketingPageMetadata({
  path: "/terms",
  title: "Terms of Service",
  description: "Terms of service for Mindfull Methods mentorship and certification courses.",
});

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:px-10">
      <p className="mm-eyebrow">Legal</p>
      <h1 className="mt-4 text-4xl font-black tracking-tight mm-heading sm:text-5xl">Terms of Service</h1>
      <p className="mt-4 text-sm mm-subtle">Last updated: May 2026</p>

      <div className="prose prose-zinc dark:prose-invert mt-10 max-w-none space-y-8 text-sm leading-7 mm-muted">
        <section>
          <h2 className="text-xl font-black mm-heading">Agreement</h2>
          <p className="mt-3">
            By accessing Mindfull Methods or enrolling in a program, you agree to these terms. If you do not agree,
            please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black mm-heading">Programs & mentorship</h2>
          <p className="mt-3">
            Course content, schedules, and mentor availability may change to improve learning outcomes. We strive to
            communicate updates in advance whenever possible.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black mm-heading">Accounts</h2>
          <p className="mt-3">
            You are responsible for maintaining the confidentiality of your account credentials and for activity under
            your account. Notify us immediately of unauthorized use.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black mm-heading">Payments & refunds</h2>
          <p className="mt-3">
            Pricing is displayed at enrollment. Refund eligibility depends on the specific cohort policy communicated
            during signup. Contact support for billing questions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black mm-heading">Acceptable use</h2>
          <p className="mt-3">
            You agree not to misuse the platform, harass mentors or peers, share account access, or redistribute
            proprietary course materials without permission.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black mm-heading">Limitation of liability</h2>
          <p className="mt-3">
            Mindfull Methods provides educational services &quot;as is.&quot; We do not guarantee employment outcomes.
            Our liability is limited to the extent permitted by applicable law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black mm-heading">Contact</h2>
          <p className="mt-3">
            For questions about these terms, email{" "}
            <a href="mailto:support@mindfullmethods.com" className="font-bold mm-heading hover:underline">
              support@mindfullmethods.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
