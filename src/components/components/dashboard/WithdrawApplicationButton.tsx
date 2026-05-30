"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

import { withdrawApplicationAction } from "@/actions/withdrawApplication";

export function canWithdrawApplication(status?: string | null) {
  return (status ?? "Pending").trim().toLowerCase() !== "withdrawn";
}

function withdrawBlockedReason(status?: string | null) {
  if ((status ?? "").trim().toLowerCase() === "withdrawn") {
    return "You already withdrew this application.";
  }
  return null;
}

export default function WithdrawApplicationButton({
  applicationId,
  status,
}: {
  applicationId: string;
  status?: string | null;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const allowed = canWithdrawApplication(status);
  const blockedReason = withdrawBlockedReason(status);

  return (
    <div className="w-full sm:w-auto">
      <button
        type="button"
        disabled={isPending || !allowed}
        title={blockedReason ?? undefined}
        onClick={() => {
          if (!allowed) return;
          const isApproved = (status ?? "").trim().toLowerCase() === "approved";
          const prompt = isApproved
            ? "This application was approved. Withdraw anyway? The admin team will be notified on next review."
            : "Withdraw this application? You can apply again later if the role reopens.";
          if (!window.confirm(prompt)) return;
          setMessage("");
          startTransition(async () => {
            const result = await withdrawApplicationAction(applicationId);
            if (!result.ok) {
              setMessage(result.error);
              return;
            }
            setMessage("Application withdrawn.");
            router.refresh();
          });
        }}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-black text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20 sm:w-auto"
      >
        <Trash2 size={14} />
        {isPending ? "Withdrawing…" : "Withdraw application"}
      </button>
      {blockedReason && !message ? (
        <p className="mt-2 text-xs font-bold text-zinc-500">{blockedReason}</p>
      ) : null}
      {message ? <p className="mt-2 text-xs font-bold text-zinc-600 dark:text-zinc-400">{message}</p> : null}
    </div>
  );
}
