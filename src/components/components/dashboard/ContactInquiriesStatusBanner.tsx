"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { CONTACT_INQUIRIES_STATUS_SQL } from "@/lib/contact-inquiries-schema-sql";

export default function ContactInquiriesStatusBanner() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(CONTACT_INQUIRIES_STATUS_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-5 dark:border-amber-400/30 dark:bg-amber-400/10">
      <p className="text-sm font-black text-amber-900 dark:text-amber-100">Status column required</p>
      <p className="mt-2 text-sm leading-6 text-amber-800 dark:text-amber-200">
        Add the <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/40">status</code> column to track inquiry
        progress. Run the SQL below in <strong>Supabase → SQL Editor</strong>, then refresh.
      </p>
      <pre className="mt-4 overflow-x-auto rounded-xl bg-zinc-950 p-4 text-xs leading-6 text-emerald-300">
        {CONTACT_INQUIRIES_STATUS_SQL}
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-black text-white dark:bg-white dark:text-zinc-950"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? "Copied!" : "Copy SQL"}
      </button>
    </div>
  );
}
