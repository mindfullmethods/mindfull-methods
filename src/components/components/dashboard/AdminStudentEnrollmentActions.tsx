"use client";

import { useState, useTransition } from "react";
import { CreditCard, Mail } from "lucide-react";

import { markEnrollmentRefunded, resendEnrollmentReceipt } from "@/actions/adminEnrollments";
import EnrollmentCompleteButton from "@/components/components/dashboard/EnrollmentCompleteButton";

export default function AdminStudentEnrollmentActions({
  enrollmentId,
  status,
  percent,
}: {
  enrollmentId: string;
  status: string;
  percent: number;
}) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function runAction(action: "refund" | "receipt") {
    setMessage("");
    startTransition(async () => {
      const result =
        action === "refund" ? await markEnrollmentRefunded(enrollmentId) : await resendEnrollmentReceipt(enrollmentId);
      setMessage(result.ok ? (action === "refund" ? "Marked refunded." : "Receipt sent.") : result.error);
    });
  }

  if (status !== "paid") {
    return <p className="text-xs font-bold text-zinc-500">Refunded — no actions available</p>;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <EnrollmentCompleteButton enrollmentId={enrollmentId} percent={percent} />
      <button
        type="button"
        disabled={isPending}
        onClick={() => runAction("receipt")}
        className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 px-3 py-2 text-xs font-black disabled:opacity-60 dark:border-white/15"
      >
        <Mail size={12} />
        Receipt
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => runAction("refund")}
        className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3 py-2 text-xs font-black text-white disabled:opacity-60"
      >
        <CreditCard size={12} />
        Refund
      </button>
      {message ? <p className="w-full text-xs font-bold text-violet-600">{message}</p> : null}
    </div>
  );
}
