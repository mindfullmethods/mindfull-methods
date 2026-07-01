"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { LmsRole } from "@/lib/lms/types";

const studentLinks = [
  { href: "/dashboard/lms", label: "Dashboard" },
  { href: "/dashboard/lms/courses", label: "Courses" },
  { href: "/dashboard/lms/learn", label: "Learn" },
  { href: "/dashboard/lms/quizzes", label: "Quizzes" },
  { href: "/dashboard/lms/assignments", label: "Assignments" },
  { href: "/dashboard/lms/certificates", label: "Certificates" },
];

export default function LmsSubNav({ role }: { role: LmsRole }) {
  const pathname = usePathname();

  const links = [...studentLinks];
  if (role === "instructor" || role === "admin") {
    links.push({ href: "/dashboard/lms/instructor", label: "Instructor" });
  }
  if (role === "admin") {
    links.push({ href: "/dashboard/lms/admin", label: "Admin" });
  }

  return (
    <nav className="lms-portal mb-8 flex flex-wrap gap-2" aria-label="LMS">
      {links.map((link) => {
        const active =
          pathname === link.href ||
          (link.href !== "/dashboard/lms" && pathname.startsWith(`${link.href}/`)) ||
          (link.href === "/dashboard/lms/learn" && pathname.includes("/learn/"));

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
              active
                ? "bg-gradient-to-r from-emerald-500 to-cyan-400 text-zinc-950"
                : "border border-zinc-200 bg-white text-zinc-700 hover:border-emerald-300 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
