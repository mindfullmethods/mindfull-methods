"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Copy, Download, ExternalLink, Share2 } from "lucide-react";

import { absoluteUrl } from "@/lib/seo";

export default function CertificateActions({
  courseSlug,
  courseTitle,
  certificateId,
  pdfEnabled = true,
}: {
  courseSlug: string;
  courseTitle: string;
  certificateId: string;
  pdfEnabled?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const verifyUrl = absoluteUrl(`/certificates/verify/${certificateId}`);
  const pdfUrl = `/api/certificates/${encodeURIComponent(certificateId)}/pdf`;
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
          className="inline-flex items-center gap-2 text-sm font-bold text-violet-600 hover:underline dark:text-violet-300"
        >
          <ArrowLeft size={16} />
          Back to progress
        </Link>
        <div className="flex flex-wrap gap-2">
          {pdfEnabled ? (
            <a
              href={pdfUrl}
              download
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-bold text-white dark:bg-white dark:text-zinc-950"
            >
              <Download size={16} />
              Download PDF
            </a>
          ) : (
            <span
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-zinc-200 px-4 py-2.5 text-sm font-bold text-zinc-500 dark:bg-zinc-800"
              title="Available after mentor approval"
            >
              <Download size={16} />
              PDF after approval
            </span>
          )}
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center gap-2 rounded-xl border mm-border px-4 py-2.5 text-sm font-bold mm-heading"
          >
            <Copy size={16} />
            {copied ? "Copied!" : "Copy verify link"}
          </button>
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0A66C2] px-4 py-2.5 text-sm font-bold text-white"
          >
            <Share2 size={16} />
            Share on LinkedIn
          </a>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-start gap-3 rounded-2xl border mm-border bg-zinc-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:bg-zinc-900">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] mm-subtle">Verify online</p>
          <a
            href={verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-violet-600 hover:underline dark:text-violet-300"
          >
            {verifyUrl}
            <ExternalLink size={14} />
          </a>
          <p className="mt-1 text-xs mm-muted">
            {courseTitle} · {certificateId}
          </p>
        </div>
        <img
          src={qrUrl}
          alt="Certificate verification QR code"
          width={96}
          height={96}
          className="rounded-lg border mm-border bg-white p-2"
        />
      </div>
    </div>
  );
}
