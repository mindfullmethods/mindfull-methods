import Link from "next/link";

import ThemedBrandLogo from "@/components/marketing/ThemedBrandLogo";
import { siteConfig } from "@/lib/site";

const exploreLinks = [
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const studentLinks = [
  { href: "/signup", label: "Sign up" },
  { href: "/login", label: "Login" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/internships", label: "Internships" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-zinc-200 bg-white px-5 py-12 text-sm text-zinc-600 dark:border-white/10 dark:bg-zinc-950 dark:text-white/70 sm:px-8 lg:px-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
        <div className="max-w-sm">
          <Link href="/" className="inline-flex">
            <ThemedBrandLogo size="lg" />
          </Link>

          <p className="mt-4 leading-6 text-zinc-600 dark:text-white/60">
            Build career-ready skills with structured courses, mentor support, and practical projects.
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-white/55">Explore</p>
          <ul className="mt-4 flex flex-col gap-3">
            {exploreLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="font-bold text-zinc-700 transition hover:text-zinc-950 dark:text-white/70 dark:hover:text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-white/55">Students</p>
          <ul className="mt-4 flex flex-col gap-3">
            {studentLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="font-bold text-zinc-700 transition hover:text-zinc-950 dark:text-white/70 dark:hover:text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-white/55">Contact</p>
          <ul className="mt-4 flex flex-col gap-3">
            <li>
              <a
                href={`mailto:${siteConfig.supportEmail}`}
                className="font-bold text-zinc-700 transition hover:text-zinc-950 dark:text-white/70 dark:hover:text-white"
              >
                {siteConfig.supportEmail}
              </a>
            </li>
            <li className="font-bold text-zinc-700 dark:text-white/70">Mon–Fri, 10am–6pm IST</li>
          </ul>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-white/55">Legal</p>
          <ul className="mt-3 flex flex-col gap-3">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="font-bold text-zinc-700 transition hover:text-zinc-950 dark:text-white/70 dark:hover:text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-zinc-200 pt-6 text-xs font-bold text-zinc-500 dark:border-white/10 dark:text-white/50">
        © {new Date().getFullYear()} Mindfull Methods. All rights reserved.
      </div>
    </footer>
  );
}
