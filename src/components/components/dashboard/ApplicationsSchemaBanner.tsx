"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { APPLICATIONS_STATUS_SQL } from "@/lib/applications-schema-sql";

export default function ApplicationsSchemaBanner() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(APPLICATIONS_STATUS_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-5 dark:border-amber-400/30 dark:bg-amber-400/10">
      <p className="text-sm font-black text-amber-900 dark:text-amber-100">One-time Supabase setup required</p>
      <p className="mt-2 text-sm leading-6 text-amber-800 dark:text-amber-200">
        The <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/40">status</code> column is missing on your{" "}
        <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/40">applications</code> table. Copy the SQL below,
        open <strong>Supabase → SQL Editor</strong>, paste, click <strong>Run</strong>, then refresh this page.
      </p>
      <pre className="mt-4 overflow-x-auto rounded-xl bg-zinc-950 p-4 text-xs leading-6 text-emerald-300">
        {APPLICATIONS_STATUS_SQL}
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
