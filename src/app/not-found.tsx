import Link from "next/link";

import Button from "@/components/marketing/Button";
import MarketingShell from "@/components/marketing/MarketingShell";

export default function NotFound() {
  return (
    <MarketingShell>
      <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-5 py-20 text-center sm:px-8">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-white/60">404</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">Page not found</h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-white/70">
          The page you’re looking for doesn’t exist or may have moved. Browse courses or return home to keep exploring
          Mindfull Methods.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/" variant="primary" size="lg">
            Back to home
          </Button>
          <Button href="/courses" variant="secondary" size="lg">
            Browse courses
          </Button>
        </div>
        <p className="mt-8 text-xs font-bold text-white/50">
          Need help?{" "}
          <Link href="/contact" className="text-white/70 underline-offset-4 hover:text-white hover:underline">
            Contact support
          </Link>
        </p>
      </section>
    </MarketingShell>
  );
}
