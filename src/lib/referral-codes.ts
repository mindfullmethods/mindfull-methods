import { cache } from "react";

import { createAdminClient } from "@/lib/supabase/admin";
import { isPlatformSettingsReady } from "@/lib/platform-content";

export type ReferralCode = {
  code: string;
  label: string;
  referrerName?: string;
  referrerEmail?: string;
  percentOff?: number;
  amountOffPaise?: number;
  active?: boolean;
};

function normalizeCode(code: string) {
  return code.trim().toUpperCase();
}

async function readReferralCodesRaw(): Promise<ReferralCode[] | null> {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("platform_settings")
      .select("value")
      .eq("key", "referral_codes")
      .maybeSingle();
    if (!data?.value || !Array.isArray(data.value)) return null;
    return data.value as ReferralCode[];
  } catch {
    return null;
  }
}

export const getReferralCodes = cache(async (): Promise<ReferralCode[]> => {
  const ready = await isPlatformSettingsReady();
  if (!ready) return [];
  const stored = await readReferralCodesRaw();
  return stored ?? [];
});

export function getActiveReferralCodes(codes: ReferralCode[]) {
  return codes.filter((c) => c.active !== false);
}

export function applyReferralCodeWithList(code: string | undefined, priceInPaise: number, codes: ReferralCode[]) {
  if (!code?.trim()) {
    return { finalAmount: priceInPaise, discountPaise: 0, label: null as string | null };
  }

  const normalized = normalizeCode(code);
  const referral = getActiveReferralCodes(codes).find((item) => item.code === normalized);

  if (!referral) {
    return { finalAmount: priceInPaise, discountPaise: 0, label: null, error: "Invalid referral code." as const };
  }

  let discountPaise = 0;
  if (referral.percentOff) {
    discountPaise = Math.round((priceInPaise * referral.percentOff) / 100);
  } else if (referral.amountOffPaise) {
    discountPaise = referral.amountOffPaise;
  } else {
    return { finalAmount: priceInPaise, discountPaise: 0, label: null, error: "Referral code has no discount configured." as const };
  }

  discountPaise = Math.min(discountPaise, priceInPaise - 100);
  const finalAmount = Math.max(100, priceInPaise - discountPaise);

  return {
    finalAmount,
    discountPaise,
    label: referral.label,
    code: referral.code,
  };
}

export async function applyReferralCode(code: string | undefined, priceInPaise: number) {
  const codes = await getReferralCodes();
  return applyReferralCodeWithList(code, priceInPaise, codes);
}
