"use client";

import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";

export default function CertificateActions({ courseSlug }: { courseSlug: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 print:hidden">
      <Link
        href={`/dashboard/my-courses/${courseSlug}`}
        className="inline-flex items-center gap-2 text-sm font-black text-violet-600 hover:underline"
      >
        <ArrowLeft size={16} />
        Back to progress
      </Link>
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-black text-white"
      >
        <Printer size={16} />
        Print / Save as PDF
      </button>
    </div>
  );
}
