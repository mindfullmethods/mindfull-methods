import { redirect } from "next/navigation";

import { isAdminUser } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireUser(nextPath?: string) {
  const user = await getSessionUser();
  if (!user) {
    const next = nextPath ? `?next=${encodeURIComponent(nextPath)}` : "";
    redirect(`/login${next}`);
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireUser("/dashboard/admin");
  if (!isAdminUser(user)) {
    redirect("/dashboard");
  }
  return user;
}

export { isAdminUser } from "@/lib/auth/roles";
