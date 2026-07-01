"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  BarChart3,
  Bell,
  BookOpen,
  PlayCircle,
  BriefcaseBusiness,
  ClipboardList,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  PanelLeftClose,
  Rocket,
  Settings,
  ShieldCheck,
  FileText,
  History,
  Sparkles,
  Tag,
  TrendingUp,
  Users,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import ThemedBrandLogo from "@/components/marketing/ThemedBrandLogo";
import ThemeToggle from "@/components/ThemeToggle";

const studentLinks = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Courses", href: "/dashboard/courses", icon: BookOpen },
  { label: "My courses", href: "/dashboard/my-courses", icon: GraduationCap },
  { label: "LMS portal", href: "/dashboard/lms", icon: PlayCircle },
  { label: "My waitlist", href: "/dashboard/my-waitlist", icon: Bell },
  { label: "Certificates", href: "/dashboard/certificates", icon: Award },
  { label: "Internships", href: "/dashboard/internships", icon: BriefcaseBusiness },
  { label: "My applications", href: "/dashboard/my-applications", icon: ClipboardList },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const adminLinks = [
  { label: "Admin home", href: "/dashboard/admin-home", icon: LayoutDashboard },
  { label: "Launch setup", href: "/dashboard/setup", icon: Rocket },
  { label: "Site & promos", href: "/dashboard/admin/site", icon: Tag },
  { label: "Growth", href: "/dashboard/growth", icon: TrendingUp },
  { label: "Content studio", href: "/dashboard/admin/content", icon: FileText },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Audit log", href: "/dashboard/admin/audit", icon: History },
  { label: "Students", href: "/dashboard/users", icon: Users },
  { label: "All applications", href: "/dashboard/applications", icon: ClipboardList },
  { label: "All enrollments", href: "/dashboard/enrollments", icon: CreditCard },
  { label: "Contact inquiries", href: "/dashboard/inquiries", icon: Mail },
  { label: "Admin Studio", href: "/dashboard/admin", icon: ShieldCheck },
];

type NavLink = (typeof studentLinks)[number];

function SidebarLink({
  link,
  pathname,
  onNavigate,
}: {
  link: NavLink;
  pathname: string;
  onNavigate: () => void;
}) {
  const Icon = link.icon;
  const active =
    pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(`${link.href}/`));

  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      className={`relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
        active
          ? "mm-nav-link-active"
          : "text-zinc-600 hover:bg-white/80 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
      }`}
    >
      <Icon size={18} className={active ? "relative z-[1]" : ""} />
      <span className={active ? "relative z-[1]" : ""}>{link.label}</span>
    </Link>
  );
}

export default function Sidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const [userEmail, setUserEmail] = useState("");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUserEmail(user?.email || "");
    }

    getUser();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          className="fixed left-4 top-[max(1rem,env(safe-area-inset-top,0px))] z-50 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-violet-500 text-white shadow-lg shadow-violet-500/30 lg:hidden"
        >
          <Menu size={20} />
        </button>
      )}

      <aside
        className={`mm-sidebar-panel fixed inset-y-0 left-0 z-40 flex h-screen w-[86vw] max-w-80 flex-col overflow-hidden transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="shrink-0 p-5 pb-0">
          <div className="flex items-start justify-between gap-4">
            <Link href="/dashboard" className="inline-flex min-w-0 flex-1">
              <ThemedBrandLogo size="sm" className="max-w-[170px]" />
            </Link>

            <div className="flex items-center gap-1">
              <ThemeToggle size="sm" />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
                className="rounded-xl p-2 text-zinc-500 transition hover:bg-zinc-200/70 dark:hover:bg-white/10 lg:hidden"
              >
                <PanelLeftClose size={20} />
              </button>
            </div>
          </div>

          <div className="relative mt-8 overflow-hidden rounded-2xl p-[1px]">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/60 via-fuchsia-500/30 to-teal-400/50" />
            <div className="relative rounded-[0.9rem] bg-zinc-950 p-5 text-white dark:bg-zinc-950">
              <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-violet-300/80">
                <Sparkles size={12} />
                Workspace
              </p>
              <p className="mt-3 truncate text-sm font-bold">{userEmail || "Student workspace"}</p>
              <p className="mt-1 text-xs text-white/45">{isAdmin ? "Admin access enabled" : "Learning mode"}</p>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6">
          <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-400 dark:text-white/35">
            Navigation
          </p>
          <nav className="flex flex-col gap-1.5">
            <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-400 dark:text-white/35">
              Learning
            </p>
            {studentLinks.map((link) => (
              <SidebarLink
                key={link.href}
                link={link}
                pathname={pathname}
                onNavigate={() => {
                  if (window.innerWidth < 1024) setOpen(false);
                }}
              />
            ))}

            {isAdmin ? (
              <>
                <p className="mb-1 mt-6 px-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-violet-600 dark:text-violet-300">
                  Admin
                </p>
                {adminLinks.map((link) => (
                  <SidebarLink
                    key={link.href}
                    link={link}
                    pathname={pathname}
                    onNavigate={() => {
                      if (window.innerWidth < 1024) setOpen(false);
                    }}
                  />
                ))}
              </>
            ) : null}
          </nav>

          {isAdmin ? (
            <div className="mt-8 overflow-hidden rounded-2xl border border-violet-200/60 bg-gradient-to-br from-violet-50 to-white p-4 dark:border-violet-400/15 dark:from-violet-950/40 dark:to-zinc-950/80">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-600 dark:text-violet-300">
                Admin pulse
              </p>
              <p className="mt-2 text-sm font-bold text-zinc-900 dark:text-white">Platform operations</p>
              <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-white/50">
                Analytics, enrollments, and mentor reviews in one place.
              </p>
              <Link
                href="/dashboard/analytics"
                className="mt-3 inline-flex text-xs font-semibold text-violet-600 hover:underline dark:text-violet-300"
              >
                Open analytics →
              </Link>
            </div>
          ) : null}
        </div>

        <div className="shrink-0 border-t border-zinc-200/60 p-5 pt-4 dark:border-white/[0.06]">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200/80 bg-red-50/80 px-4 py-3 text-sm font-bold text-red-600 backdrop-blur transition hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
