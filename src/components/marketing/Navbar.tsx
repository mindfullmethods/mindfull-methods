"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Menu, X } from "lucide-react";

import ThemeToggle from "@/components/ThemeToggle";
import NavAuth from "@/components/marketing/NavAuth";
import ThemedBrandLogo from "@/components/marketing/ThemedBrandLogo";

type NavItem = {
  href: string;
  label: string;
};

const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const activeLabel = useMemo(() => {
    const match = navItems.find((item) => isActive(pathname, item.href));
    return match?.label;
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/75 supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-zinc-950/55">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="flex shrink-0 items-center"
          onClick={() => setOpen(false)}
          aria-label="Go to home"
        >
          <ThemedBrandLogo size="md" className="max-w-[min(200px,52vw)]" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => {
            const active = item.label === activeLabel;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "text-sm font-bold text-zinc-950 dark:text-white"
                    : "text-sm font-bold text-zinc-600 transition hover:text-zinc-950 dark:text-white/70 dark:hover:text-white"
                }
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle size="sm" />
          <NavAuth />
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-black text-white transition hover:scale-[1.02] dark:bg-white dark:text-zinc-950"
          >
            Book Free Call
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle size="sm" />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-950 transition hover:bg-zinc-50 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-zinc-200 bg-white/95 px-5 py-4 dark:border-white/10 dark:bg-zinc-950/95 sm:px-8 md:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={
                    active
                      ? "rounded-xl bg-zinc-100 px-4 py-3 text-sm font-bold text-zinc-950 dark:bg-white/10 dark:text-white"
                      : "rounded-xl px-4 py-3 text-sm font-bold text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                  }
                >
                  {item.label}
                </Link>
              );
            })}

            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-bold text-zinc-600 dark:text-white/70"
            >
              Login
            </Link>
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-bold text-zinc-600 dark:text-white/70"
            >
              Sign up
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-bold text-zinc-600 dark:text-white/70"
            >
              Dashboard
            </Link>

            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-zinc-950 px-4 py-3 text-sm font-black text-white dark:bg-white dark:text-zinc-950"
            >
              Book Free Call
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
