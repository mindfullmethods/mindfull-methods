import { createAdminClient } from "@/lib/supabase/admin";

export function adminActorEmail(user: { email?: string | null }) {
  return user.email?.trim() || "admin@unknown";
}

export async function recordAdminAudit(params: {
  actorEmail: string;
  action: string;
  entityType?: string;
  entityId?: string;
  detail?: Record<string, unknown>;
}) {
  try {
    const admin = createAdminClient();
    await admin.from("admin_audit_log").insert({
      actor_email: params.actorEmail,
      action: params.action,
      entity_type: params.entityType ?? null,
      entity_id: params.entityId ?? null,
      detail: params.detail ?? {},
    });
  } catch (err) {
    console.warn("[audit-log]", err);
  }
}
