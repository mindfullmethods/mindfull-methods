"use client";

import { Download } from "lucide-react";

export default function ExportCsvButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      download
      className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-black text-zinc-950 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
    >
      <Download size={16} />
      {label}
    </a>
  );
}
