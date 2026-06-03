import { cache } from "react";

import { createAdminClient } from "@/lib/supabase/admin";
import { isPlatformSettingsReady } from "@/lib/platform-content";

export type PromoCode = {
  code: string;
  label: string;
  percentOff?: number;
  amountOffPaise?: number;
  active?: boolean;
};

export const DEFAULT_PROMO_CODES: PromoCode[] = [
  { code: "LAUNCH10", label: "10% off launch offer", percentOff: 10, active: true },
  { code: "MENTOR500", label: "₹500 off", amountOffPaise: 50000, active: true },
  { code: "STUDENT15", label: "15% student discount", percentOff: 15, active: true },
];

function normalizeCode(code: string) {
  return code.trim().toUpperCase();
}

async function readPromoCodesRaw(): Promise<PromoCode[] | null> {
  try {
    const admin = createAdminClient();
    const { data } = await admin.from("platform_settings").select("value").eq("key", "promo_codes").maybeSingle();
    if (!data?.value || !Array.isArray(data.value)) return null;
    return data.value as PromoCode[];
  } catch {
    return null;
  }
}

export const getPromoCodes = cache(async (): Promise<PromoCode[]> => {
  const ready = await isPlatformSettingsReady();
  if (!ready) return DEFAULT_PROMO_CODES;
  const stored = await readPromoCodesRaw();
  if (!stored?.length) return DEFAULT_PROMO_CODES;
  return stored;
});

export function getActivePromoCodes(codes: PromoCode[]) {
  return codes.filter((c) => c.active !== false);
}

export function applyPromoCodeWithList(code: string | undefined, priceInPaise: number, codes: PromoCode[]) {
  if (!code?.trim()) {
    return { finalAmount: priceInPaise, discountPaise: 0, label: null as string | null };
  }

  const normalized = normalizeCode(code);
  const promo = getActivePromoCodes(codes).find((item) => item.code === normalized);

  if (!promo) {
    return { finalAmount: priceInPaise, discountPaise: 0, label: null, error: "Invalid promo code." as const };
  }

  let discountPaise = 0;
  if (promo.percentOff) {
    discountPaise = Math.round((priceInPaise * promo.percentOff) / 100);
  } else if (promo.amountOffPaise) {
    discountPaise = promo.amountOffPaise;
  }

  discountPaise = Math.min(discountPaise, priceInPaise - 100);
  const finalAmount = Math.max(100, priceInPaise - discountPaise);

  return {
    finalAmount,
    discountPaise,
    label: promo.label,
    code: promo.code,
  };
}

export async function applyPromoCode(code: string | undefined, priceInPaise: number) {
  const codes = await getPromoCodes();
  return applyPromoCodeWithList(code, priceInPaise, codes);
}

/** @deprecated Use getPromoCodes() — sync fallback for client bundles */
export function getPromoCodesSync() {
  return DEFAULT_PROMO_CODES;
}
