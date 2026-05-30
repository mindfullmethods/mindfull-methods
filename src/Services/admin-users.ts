import { createAdminClient } from "@/lib/supabase/admin";
import { getApplications } from "@/Services/getApplications";
import { getAllEnrollments } from "@/Services/admin-enrollments";

export type AdminUserRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  applicationCount: number;
  enrollmentCount: number;
  lastActivity: string | null;
  role: string | null;
};

export async function getAdminUsers(): Promise<AdminUserRow[]> {
  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return [];
  }

  const [profilesResult, applications, enrollments, authUsersResult] = await Promise.all([
    admin.from("profiles").select("id, full_name, email").order("full_name", { ascending: true }),
    getApplications(),
    getAllEnrollments(),
    admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ]);

  const roleById = new Map<string, string | null>();
  for (const authUser of authUsersResult.data.users) {
    const role =
      (authUser.app_metadata?.role as string | undefined) ??
      (authUser.user_metadata?.role as string | undefined) ??
      null;
    roleById.set(authUser.id, role);
  }

  const profiles = profilesResult.data ?? [];
  const appCounts = new Map<string, number>();
  const enrollCounts = new Map<string, number>();
  const lastActivity = new Map<string, string>();

  for (const app of applications) {
    if (!app.user_id) continue;
    appCounts.set(app.user_id, (appCounts.get(app.user_id) ?? 0) + 1);
    if (app.created_at) {
      const prev = lastActivity.get(app.user_id);
      if (!prev || app.created_at > prev) lastActivity.set(app.user_id, app.created_at);
    }
  }

  for (const en of enrollments) {
    if (!en.user_id) continue;
    enrollCounts.set(en.user_id, (enrollCounts.get(en.user_id) ?? 0) + 1);
    if (en.created_at) {
      const prev = lastActivity.get(en.user_id);
      if (!prev || en.created_at > prev) lastActivity.set(en.user_id, en.created_at);
    }
  }

  return profiles.map((p) => ({
    id: p.id,
    full_name: p.full_name,
    email: p.email,
    applicationCount: appCounts.get(p.id) ?? 0,
    enrollmentCount: enrollCounts.get(p.id) ?? 0,
    lastActivity: lastActivity.get(p.id) ?? null,
    role: roleById.get(p.id) ?? null,
  }));
}
