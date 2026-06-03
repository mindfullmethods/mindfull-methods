import { createAdminClient } from "@/lib/supabase/admin";

export type AuditRow = {
  id: string;
  actor_email: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  created_at: string;
};

export async function getRecentAuditLog(limit = 12): Promise<AuditRow[]> {
  const { rows } = await getAuditLogPage({ limit, offset: 0 });
  return rows;
}

export async function getAuditLogPage(params: {
  limit?: number;
  offset?: number;
}): Promise<{ rows: AuditRow[]; total: number }> {
  const limit = params.limit ?? 50;
  const offset = params.offset ?? 0;

  try {
    const admin = createAdminClient();
    const { data, error, count } = await admin
      .from("admin_audit_log")
      .select("id, actor_email, action, entity_type, entity_id, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) return { rows: [], total: 0 };
    return { rows: (data ?? []) as AuditRow[], total: count ?? 0 };
  } catch {
    return { rows: [], total: 0 };
  }
}
