import { createAdminClient } from "@/lib/supabase/admin";

export type PromoUsageStat = {
  code: string;
  checkouts: number;
  completed: number;
};

export async function getPromoUsageStats(): Promise<PromoUsageStat[]> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("checkout_intents")
      .select("promo_code, completed")
      .not("promo_code", "is", null);

    if (error) return [];

    const map = new Map<string, { checkouts: number; completed: number }>();
    for (const row of data ?? []) {
      const code = (row.promo_code as string)?.trim();
      if (!code) continue;
      const current = map.get(code) ?? { checkouts: 0, completed: 0 };
      current.checkouts += 1;
      if (row.completed) current.completed += 1;
      map.set(code, current);
    }

    return [...map.entries()]
      .map(([code, stats]) => ({ code, ...stats }))
      .sort((a, b) => b.completed - a.completed);
  } catch {
    return [];
  }
}
