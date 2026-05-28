"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

import {
  updateApplicationStatus,
  type ApplicationStatus,
} from "@/actions/updateApplicationStatus";

const statuses: ApplicationStatus[] = ["Pending", "Approved", "Rejected"];

function statusButtonClass(current: string | undefined, value: ApplicationStatus) {
  const active = (current || "Pending") === value;

  if (value === "Approved") {
    return active
      ? "bg-emerald-600 text-white"
      : "border border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-400/20 dark:text-emerald-300 dark:hover:bg-emerald-400/10";
  }

  if (value === "Rejected") {
    return active
      ? "bg-red-600 text-white"
      : "border border-red-200 text-red-700 hover:bg-red-50 dark:border-red-400/20 dark:text-red-300 dark:hover:bg-red-400/10";
  }

  return active
    ? "bg-amber-500 text-white"
    : "border border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-400/20 dark:text-amber-300 dark:hover:bg-amber-400/10";
}

export default function ApplicationStatusControl({
  applicationId,
  currentStatus,
  disabled = false,
}: {
  applicationId: string;
  currentStatus?: string | null;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [status, setStatus] = useState(currentStatus || "Pending");

  function handleUpdate(next: ApplicationStatus) {
    setError("");
    startTransition(async () => {
      const result = await updateApplicationStatus(applicationId, next);

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
            {isPending && (status || "Pending") === value ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (status || "Pending") === value ? (
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
