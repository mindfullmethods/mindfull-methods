import { createAdminClient } from "@/lib/supabase/admin";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_EMAIL = 8;

/** Limit contact/newsletter spam by recent rows with same email. */
export async function isEmailRateLimited(email: string, table: "contact_inquiries" | "newsletter_subscribers") {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return true;

  try {
    const admin = createAdminClient();
    const since = new Date(Date.now() - WINDOW_MS).toISOString();
    const { count, error } = await admin
      .from(table)
      .select("id", { count: "exact", head: true })
      .eq("email", normalized)
      .gte("created_at", since);

    if (error) return false;
    return (count ?? 0) >= MAX_PER_EMAIL;
  } catch {
    return false;
  }
}
