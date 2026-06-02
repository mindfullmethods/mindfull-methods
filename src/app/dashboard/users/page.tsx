import { UserRound } from "lucide-react";

import DashboardPageHeader from "@/components/components/dashboard/DashboardPageHeader";
import AdminUsersTable from "@/components/components/dashboard/AdminUsersTable";
import { getAdminUsers } from "@/Services/admin-users";
import { requireAdmin } from "@/lib/auth";

export default async function AdminUsersPage() {
  await requireAdmin();
  const users = await getAdminUsers();
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <DashboardPageHeader
        eyebrow="Students"
        title="Registered users"
        description="Everyone who signed up — toggle admin role or review activity at a glance."
      >
        <div className="mt-6 inline-flex rounded-2xl bg-zinc-950 px-6 py-4 text-white dark:bg-white dark:text-zinc-950">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">Total</p>
          <p className="ml-4 text-3xl font-bold">{users.length}</p>
        </div>
      </DashboardPageHeader>

      <section className="mt-8">
        {users.length === 0 ? (
          <div className="mm-card-premium rounded-3xl border border-dashed p-12 text-center">
            <UserRound className="mx-auto text-zinc-400" size={40} />
            <h2 className="mt-5 text-3xl font-bold mm-heading">No users yet</h2>
            <p className="mt-3 text-sm mm-muted">Profiles appear after students sign up.</p>
          </div>
        ) : (
          <AdminUsersTable users={users} adminEmails={adminEmails} />
        )}
      </section>
    </main>
  );
}
