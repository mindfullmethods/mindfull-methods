import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Mindfull Methods mentorship and certification courses.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:px-10">
      <p className="text-sm font-black uppercase tracking-[0.28em] text-white/60">Legal</p>
      <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">Privacy Policy</h1>
      <p className="mt-4 text-sm text-white/50">Last updated: May 2026</p>

      <div className="prose prose-invert mt-10 max-w-none space-y-8 text-sm leading-7 text-white/70">
        <section>
          <h2 className="text-xl font-black text-white">Overview</h2>
          <p className="mt-3">
            Mindfull Methods (&quot;we&quot;, &quot;us&quot;) respects your privacy. This policy explains what information we
            collect when you use our website, enroll in courses, or contact us—and how we use it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-white">Information we collect</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Account details such as name and email when you sign up</li>
            <li>Course preferences and application information you submit</li>
            <li>Messages sent through our contact form</li>
            <li>Basic usage analytics to improve the site experience</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-black text-white">How we use your information</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Provide access to courses, mentorship, and dashboard features</li>
            <li>Respond to inquiries and send program-related updates</li>
            <li>Improve our platform, content, and student experience</li>
            <li>Comply with legal obligations when required</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-black text-white">Third-party services</h2>
          <p className="mt-3">
            We use trusted providers for authentication (Supabase), email delivery (Resend), and analytics (Vercel).
            These services process data according to their own privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-white">Your choices</h2>
          <p className="mt-3">
            You may request access, correction, or deletion of your personal data by emailing{" "}
            <a href="mailto:support@mindfullmethods.com" className="font-bold text-white hover:underline">
              support@mindfullmethods.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-white">Contact</h2>
          <p className="mt-3">
            Questions about this policy? Reach us at{" "}
            <a href="mailto:support@mindfullmethods.com" className="font-bold text-white hover:underline">
              support@mindfullmethods.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
