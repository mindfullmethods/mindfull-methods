"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Copy, ExternalLink, Printer, Share2 } from "lucide-react";

import { absoluteUrl } from "@/lib/seo";

export default function CertificateActions({
  courseSlug,
  courseTitle,
  certificateId,
}: {
  courseSlug: string;
  courseTitle: string;
  certificateId: string;
}) {
  const [copied, setCopied] = useState(false);
  const verifyUrl = absoluteUrl(`/certificates/verify/${certificateId}`);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(verifyUrl)}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verifyUrl)}`;

  async function copyLink() {
    await navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

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
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-black dark:border-white/10"
          >
            <Copy size={16} />
            {copied ? "Copied!" : "Copy verify link"}
          </button>
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0A66C2] px-4 py-2.5 text-sm font-black text-white"
          >
            <Share2 size={16} />
            Share on LinkedIn
          </a>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-black text-white"
          >
            <Printer size={16} />
            Print / PDF
          </button>
        </div>
      </div>
      <div className="mt-6 flex flex-col items-start gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-zinc-900">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Verify online</p>
          <a
            href={verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-violet-600 hover:underline"
          >
            {verifyUrl}
            <ExternalLink size={14} />
          </a>
          <p className="mt-1 text-xs text-zinc-500">{courseTitle} · {certificateId}</p>
        </div>
        <img
          src={qrUrl}
          alt="Certificate verification QR code"
          width={96}
          height={96}
          className="rounded-lg border border-zinc-200 bg-white p-2"
        />
      </div>
    </div>
  );
}
