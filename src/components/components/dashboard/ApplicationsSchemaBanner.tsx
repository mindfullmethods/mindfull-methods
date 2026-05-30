"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { APPLICATIONS_STATUS_SQL } from "@/lib/applications-schema-sql";
import type { ApplicationsSchemaIssue } from "@/lib/applications-schema";

export default function ApplicationsSchemaBanner({ issue }: { issue: ApplicationsSchemaIssue }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(APPLICATIONS_STATUS_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (issue === "missing_service_role") {
    return (
      <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-5 dark:border-amber-400/30 dark:bg-amber-400/10">
        <p className="text-sm font-black text-amber-900 dark:text-amber-100">Vercel setup required</p>
        <p className="mt-2 text-sm leading-6 text-amber-800 dark:text-amber-200">
          Your Supabase table is fine — applications already show status. The live site is missing{" "}
          <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/40">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
          on Vercel, so approve/reject buttons stay disabled.
        </p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-amber-800 dark:text-amber-200">
          <li>
            Supabase → <strong>Settings → API</strong> → copy the <strong>service_role</strong> secret key
          </li>
          <li>
            Vercel → <strong>Settings → Environment Variables</strong> → add{" "}
            <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/40">SUPABASE_SERVICE_ROLE_KEY</code>
          </li>
          <li>
            <strong>Redeploy</strong> the site, then refresh this page
          </li>
        </ol>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-5 dark:border-amber-400/30 dark:bg-amber-400/10">
      <p className="text-sm font-black text-amber-900 dark:text-amber-100">One-time Supabase setup required</p>
      <p className="mt-2 text-sm leading-6 text-amber-800 dark:text-amber-200">
        The <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/40">status</code> column is missing on your{" "}
        <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/40">applications</code> table. Copy the SQL below,
        open <strong>Supabase → SQL Editor</strong>, paste, click <strong>Run</strong>, then refresh this page.
      </p>
      <p className="mt-2 text-sm text-amber-800 dark:text-amber-200">
        After running SQL, go to Supabase → <strong>Settings → API</strong> and click{" "}
        <strong>Reload schema cache</strong> if the banner does not clear.
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
