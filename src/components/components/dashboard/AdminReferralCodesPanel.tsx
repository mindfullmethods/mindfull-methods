"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";

import { saveReferralCodes } from "@/actions/adminReferralCodes";
import SectionHeader from "@/components/marketing/SectionHeader";
import type { ReferralCode } from "@/lib/referral-codes";
import type { ReferralStat } from "@/lib/referral-events";

function emptyRow(): ReferralCode {
  return { code: "", label: "", percentOff: 10, active: true };
}

export default function AdminReferralCodesPanel({
  initialCodes,
  stats,
  tableReady,
  v3Ready,
}: {
  initialCodes: ReferralCode[];
  stats: ReferralStat[];
  tableReady: boolean;
  v3Ready: boolean;
}) {
  const [codes, setCodes] = useState(initialCodes);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function updateRow(index: number, patch: Partial<ReferralCode>) {
    setCodes((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function save() {
    setMessage("");
    startTransition(async () => {
      const result = await saveReferralCodes(codes);
      setMessage(result.ok ? "Referral codes saved." : result.error);
    });
  }

  return (
    <section className="mm-section-panel">
      <SectionHeader
        eyebrow="Referrals"
        title="Referral codes"
        description='Share links like /courses/generative-ai-llms?ref=PARTNER10. Referral discount overrides promo at checkout.'
      />

      {!tableReady ? (
        <p className="relative mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
          Run supabase/content-cms-schema.sql to persist referral codes.
        </p>
      ) : null}

      {!v3Ready ? (
        <p className="relative mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
          Run supabase/v3-growth-and-referrals.sql to track referral conversions.
        </p>
      ) : null}

      {stats.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {stats.map((s) => (
            <li
              key={s.code}
              className="rounded-full border mm-border px-3 py-1 text-xs font-bold mm-heading"
            >
              {s.code}: {s.completed}/{s.attempts} paid
            </li>
          ))}
        </ul>
      ) : null}

      <div className="relative mt-6 space-y-4">
        {codes.map((row, index) => (
          <div
            key={`${row.code}-${index}`}
            className="grid gap-3 rounded-2xl border mm-border bg-zinc-50/80 p-4 dark:bg-white/[0.02]"
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <input
                value={row.code}
                onChange={(e) => updateRow(index, { code: e.target.value.toUpperCase() })}
                placeholder="PARTNER10"
                disabled={!tableReady || isPending}
                className="mm-input w-full uppercase"
              />
              <input
                value={row.label}
                onChange={(e) => updateRow(index, { label: e.target.value })}
                placeholder="Partner discount"
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
                value={row.referrerEmail ?? ""}
                onChange={(e) => updateRow(index, { referrerEmail: e.target.value })}
                placeholder="Partner email (optional)"
                disabled={!tableReady || isPending}
                className="mm-input w-full"
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <label className="flex items-center gap-2 text-sm font-semibold">
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
                disabled={!tableReady || isPending}
                onClick={() => setCodes((rows) => rows.filter((_, i) => i !== index))}
                className="text-zinc-400 hover:text-red-600"
                aria-label="Remove code"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          disabled={!tableReady || isPending}
          onClick={() => setCodes((rows) => [...rows, emptyRow()])}
          className="inline-flex items-center gap-1 rounded-lg border mm-border px-3 py-1.5 text-xs font-bold"
        >
          <Plus size={14} />
          Add referral code
        </button>
      </div>

      <button
        type="button"
        onClick={save}
        disabled={!tableReady || isPending}
        className="relative mt-4 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save referral codes"}
      </button>
      {message ? <p className="relative mt-3 text-sm font-semibold text-violet-600">{message}</p> : null}
    </section>
  );
}
