"use client";

import Link from "next/link";
import { Download, FileText, Printer } from "lucide-react";

export default function SyllabusActions({
  courseSlug,
  txtUrl,
  pdfUrl,
}: {
  courseSlug: string;
  txtUrl: string;
  pdfUrl?: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 print:hidden">
      <Link href={`/courses/${courseSlug}`} className="text-sm font-bold text-violet-600 hover:underline">
        ← Back to course
      </Link>
      <div className="flex flex-wrap gap-3">
        {pdfUrl ? (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-black text-violet-800"
          >
            <FileText size={16} />
            Download PDF
          </a>
        ) : null}
        <a
          href={txtUrl}
          download
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-black"
        >
          <Download size={16} />
          Download .txt
        </a>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2 text-sm font-black text-white"
        >
          <Printer size={16} />
          Save as PDF
        </button>
      </div>
    </div>
  );
}
