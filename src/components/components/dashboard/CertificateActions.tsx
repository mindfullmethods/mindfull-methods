"use client";

import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";

import { absoluteUrl } from "@/lib/seo";

export default function CertificateActions({
  courseSlug,
  certificateId,
}: {
  courseSlug: string;
  certificateId: string;
}) {
  const verifyUrl = absoluteUrl(`/certificates/verify/${certificateId}`);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(verifyUrl)}`;

  return (
    <div className="mb-8 print:hidden">
      <div className="flex flex-wrap items-center justify-between gap-4">
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
      <div className="mt-6 flex flex-col items-start gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-zinc-900">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Verify online</p>
          <a href={verifyUrl} className="mt-1 text-sm font-bold text-violet-600 hover:underline">
            {verifyUrl}
          </a>
        </div>
        <img src={qrUrl} alt="Certificate verification QR code" width={96} height={96} className="rounded-lg border border-zinc-200 bg-white p-2" />
      </div>
    </div>
  );
}
