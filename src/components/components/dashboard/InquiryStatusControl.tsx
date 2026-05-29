"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

import { updateInquiryStatus, type InquiryStatus } from "@/actions/updateInquiryStatus";

const statuses: InquiryStatus[] = ["New", "Contacted", "Enrolled", "Closed"];

function statusButtonClass(current: string | undefined, value: InquiryStatus) {
  const active = (current || "New") === value;

  if (value === "Enrolled") {
    return active
      ? "bg-emerald-600 text-white"
      : "border border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-400/20 dark:text-emerald-300 dark:hover:bg-emerald-400/10";
  }

  if (value === "Closed") {
    return active
      ? "bg-zinc-700 text-white"
      : "border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/10";
  }

  if (value === "Contacted") {
    return active
      ? "bg-sky-600 text-white"
      : "border border-sky-200 text-sky-700 hover:bg-sky-50 dark:border-sky-400/20 dark:text-sky-300 dark:hover:bg-sky-400/10";
  }

  return active
    ? "bg-amber-500 text-white"
    : "border border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-400/20 dark:text-amber-300 dark:hover:bg-amber-400/10";
}

export default function InquiryStatusControl({
  inquiryId,
  currentStatus,
  disabled = false,
}: {
  inquiryId: string;
  currentStatus?: string | null;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [status, setStatus] = useState(currentStatus || "New");

  function handleUpdate(next: InquiryStatus) {
    setError("");
    startTransition(async () => {
      const result = await updateInquiryStatus(inquiryId, next);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setStatus(result.status);
      router.refresh();
    });
  }

  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Update status</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {statuses.map((value) => (
          <button
            key={value}
            type="button"
            disabled={isPending || disabled}
            onClick={() => handleUpdate(value)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-black transition disabled:opacity-60 ${statusButtonClass(status, value)}`}
          >
            {isPending && (status || "New") === value ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (status || "New") === value ? (
              <CheckCircle2 size={12} />
            ) : null}
            {value}
          </button>
        ))}
      </div>
      {error ? <p className="mt-2 text-xs font-bold text-red-600">{error}</p> : null}
    </div>
  );
}
