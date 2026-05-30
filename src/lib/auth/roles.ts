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
    pathname === "/dashboard/admin-home" ||
    pathname.startsWith("/dashboard/admin-home/") ||
    pathname === "/dashboard/users" ||
    pathname.startsWith("/dashboard/users/") ||
    pathname === "/dashboard/admin" ||
    pathname.startsWith("/dashboard/admin/") ||
    pathname === "/dashboard/applications" ||
    pathname.startsWith("/dashboard/applications/") ||
    pathname === "/dashboard/enrollments" ||
    pathname.startsWith("/dashboard/enrollments/") ||
    pathname === "/dashboard/inquiries" ||
    pathname.startsWith("/dashboard/inquiries/") ||
    pathname === "/dashboard/setup" ||
    pathname.startsWith("/dashboard/setup/") ||
    pathname === "/dashboard/analytics" ||
    pathname.startsWith("/dashboard/analytics/")
  );
}
