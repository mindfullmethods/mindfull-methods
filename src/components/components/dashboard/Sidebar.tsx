"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  LayoutDashboard,
  FileText,
  LogOut,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function Sidebar() {
  const pathname = usePathname();

  async function handleLogout() {
    await supabase.auth.signOut();

    window.location.href = "/login";
  }

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Applications",
      href: "/dashboard/applications",
      icon: FileText,
    },
    {
      label: "Admin Panel",
      href: "/dashboard/admin",
      icon: Briefcase,
    },
  ];
   
  return (
    <aside className="flex min-h-screen w-72 flex-col border-r border-black/10 bg-white p-6">

      <div className="mb-10">
        <h1 className="text-3xl font-black">
          Unified
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Internship Platform
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-3">

        {links.map((link) => {
          const Icon = link.icon;

          const active =
            pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-2xl px-5 py-4 transition ${
                active
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
              }`}
            >

              <Icon size={20} />

              <span className="font-medium">
                {link.label}
              </span>

            </Link>
          );
        })}

      </nav>

      <button
        onClick={handleLogout}
        className="mt-6 flex items-center gap-3 rounded-2xl border border-red-200 px-5 py-4 text-red-500 transition hover:bg-red-50"
      >

        <LogOut size={20} />

        <span className="font-medium">
          Logout
        </span>

      </button>
    </aside>
  );
}