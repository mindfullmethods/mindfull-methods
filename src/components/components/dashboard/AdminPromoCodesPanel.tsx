"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";

import { savePromoCodes } from "@/actions/adminSiteSettings";
import SectionHeader from "@/components/marketing/SectionHeader";
import type { PromoCode } from "@/lib/promo-codes";

function emptyRow(): PromoCode {
  return { code: "", label: "", percentOff: 10, active: true };
}

export default function AdminPromoCodesPanel({
  initialCodes,
  tableReady,
}: {
  initialCodes: PromoCode[];
  tableReady: boolean;
}) {
  const [codes, setCodes] = useState(initialCodes);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function updateRow(index: number, patch: Partial<PromoCode>) {
    setCodes((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function save() {
    setMessage("");
    startTransition(async () => {
      const result = await savePromoCodes(codes);
      setMessage(result.ok ? "Promo codes saved." : result.error);
    });
  }

  return (
    <section className="mm-section-panel">
      <SectionHeader
        eyebrow="Checkout"
        title="Promo codes"
        description="Manage discount codes used at Razorpay checkout. Inactive codes are rejected at payment."
      />

      {!tableReady ? (
        <p className="relative mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200">
          Run supabase/content-cms-schema.sql to save codes to the database.
        </p>
      ) : null}

      <div className="relative mt-6 space-y-4">
        {codes.map((row, index) => (
          <div
            key={`${row.code}-${index}`}
            className="grid gap-3 rounded-2xl border mm-border bg-zinc-50/80 p-4 dark:bg-white/[0.02] sm:grid-cols-[1fr_1fr_100px_100px_auto]"
          >
            <input
              value={row.code}
              onChange={(e) => updateRow(index, { code: e.target.value.toUpperCase() })}
              placeholder="LAUNCH10"
              disabled={!tableReady || isPending}
              className="mm-input w-full uppercase"
            />
            <input
              value={row.label}
              onChange={(e) => updateRow(index, { label: e.target.value })}
              placeholder="Label shown at checkout"
              disabled={!tableReady || isPending}
              className="mm-input w-full"
            />
            <input
              type="number"
              min={0}
              max={100}
              value={row.percentOff ?? ""}
              onChange={(e) =>
                updateRow(index, {
                  percentOff: e.target.value ? Number(e.target.value) : undefined,
                  amountOffPaise: undefined,
                })
              }
              placeholder="% off"
              disabled={!tableReady || isPending}
              className="mm-input w-full"
            />
            <input
              type="number"
              min={0}
              step={100}
              value={row.amountOffPaise ? row.amountOffPaise / 100 : ""}
              onChange={(e) =>
                updateRow(index, {
                  amountOffPaise: e.target.value ? Math.round(Number(e.target.value) * 100) : undefined,
                  percentOff: undefined,
                })
              }
              placeholder="₹ off"
              disabled={!tableReady || isPending}
              className="mm-input w-full"
            />
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs font-semibold mm-muted">
                <input
                  type="checkbox"
                  checked={row.active !== false}
                  onChange={(e) => updateRow(index, { active: e.target.checked })}
                  disabled={!tableReady || isPending}
                />
                Active
              </label>
              <button
                type="button"
                onClick={() => setCodes((rows) => rows.filter((_, i) => i !== index))}
                disabled={!tableReady || isPending}
                className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-400/10"
                aria-label="Remove code"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="relative mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setCodes((rows) => [...rows, emptyRow()])}
          disabled={!tableReady || isPending}
          className="inline-flex items-center gap-2 rounded-xl border mm-border px-4 py-2.5 text-sm font-bold"
        >
          <Plus size={16} />
          Add code
        </button>
        <button
          type="button"
          onClick={save}
          disabled={!tableReady || isPending}
          className="rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60 dark:bg-white dark:text-zinc-950"
        >
          {isPending ? "Saving…" : "Save promo codes"}
        </button>
      </div>
      {message ? <p className="relative mt-3 text-sm font-semibold text-violet-600 dark:text-violet-300">{message}</p> : null}
    </section>
  );
}
