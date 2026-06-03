"use server";

import { revalidatePath } from "next/cache";

import { adminActorEmail, recordAdminAudit } from "@/lib/audit-log";
import { requireAdmin } from "@/lib/auth";
import type { PromoCode } from "@/lib/promo-codes";
import { savePlatformSetting } from "@/lib/platform-content";
import type { SiteContent } from "@/lib/site-content";

export async function savePromoCodes(codes: PromoCode[]) {
  const admin = await requireAdmin();

  const normalized = codes
    .map((c) => ({
      ...c,
      code: c.code.trim().toUpperCase(),
      label: c.label.trim(),
      active: c.active !== false,
    }))
    .filter((c) => c.code.length > 0);

  if (normalized.some((c) => !c.percentOff && !c.amountOffPaise)) {
    return { ok: false as const, error: "Each code needs a percent off or fixed amount off." };
  }

  try {
    await savePlatformSetting("promo_codes", normalized);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not save promo codes.";
    return { ok: false as const, error: message };
  }

  void recordAdminAudit({
    actorEmail: adminActorEmail(admin),
    action: "site.promo_codes_saved",
    entityType: "platform_settings",
    entityId: "promo_codes",
    detail: { count: normalized.length },
  });

  revalidatePath("/dashboard/admin/site");
  revalidatePath("/courses");
  return { ok: true as const };
}

export async function saveSiteContentAction(content: SiteContent) {
  const admin = await requireAdmin();

  try {
    await savePlatformSetting("site_content", content);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not save site content.";
    return { ok: false as const, error: message };
  }

  void recordAdminAudit({
    actorEmail: adminActorEmail(admin),
    action: "site.content_saved",
    entityType: "platform_settings",
    entityId: "site_content",
  });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/dashboard/admin/site");
  return { ok: true as const };
}
