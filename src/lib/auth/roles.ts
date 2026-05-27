import type { User } from "@supabase/supabase-js";

function adminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminUser(user: User | null | undefined) {
  if (!user?.email) return false;

  const email = user.email.toLowerCase();
  if (adminEmails().includes(email)) return true;

  const role =
    (user.app_metadata?.role as string | undefined) ??
    (user.user_metadata?.role as string | undefined);

  return role === "admin";
}

export function isAdminPath(pathname: string) {
  return (
    pathname === "/dashboard/admin" ||
    pathname.startsWith("/dashboard/admin/") ||
    pathname === "/dashboard/applications" ||
    pathname.startsWith("/dashboard/applications/")
  );
}
