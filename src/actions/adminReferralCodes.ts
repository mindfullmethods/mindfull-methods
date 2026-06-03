"use server";

import { revalidatePath } from "next/cache";

import { adminActorEmail, recordAdminAudit } from "@/lib/audit-log";
import { requireAdmin } from "@/lib/auth";
import type { ReferralCode } from "@/lib/referral-codes";
import { savePlatformSetting } from "@/lib/platform-content";

export async function saveReferralCodes(codes: ReferralCode[]) {
  const admin = await requireAdmin();

  const normalized = codes
    .map((c) => ({
      ...c,
      code: c.code.trim().toUpperCase(),
      label: c.label.trim(),
      referrerName: c.referrerName?.trim() || undefined,
      referrerEmail: c.referrerEmail?.trim().toLowerCase() || undefined,
      active: c.active !== false,
    }))
    .filter((c) => c.code.length > 0);

  if (normalized.some((c) => !c.percentOff && !c.amountOffPaise)) {
    return { ok: false as const, error: "Each referral code needs a percent off or fixed amount off." };
  }

  try {
    await savePlatformSetting("referral_codes", normalized);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not save referral codes.";
    return { ok: false as const, error: message };
  }

  void recordAdminAudit({
    actorEmail: adminActorEmail(admin),
    action: "growth.referral_codes_saved",
    entityType: "platform_settings",
    entityId: "referral_codes",
    detail: { count: normalized.length },
  });

  revalidatePath("/dashboard/growth");
  return { ok: true as const };
}
