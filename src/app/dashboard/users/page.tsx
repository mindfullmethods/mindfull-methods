import { UserRound } from "lucide-react";

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
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-zinc-500">Students</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Registered users</h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          Everyone who signed up — toggle admin role or review activity at a glance.
        </p>
        <div className="mt-6 inline-flex rounded-2xl bg-zinc-950 px-6 py-4 text-white dark:bg-white dark:text-zinc-950">
          <p className="text-xs font-black uppercase tracking-[0.2em] opacity-60">Total</p>
          <p className="ml-4 text-3xl font-black">{users.length}</p>
        </div>
      </section>

      <section className="mt-8">
        {users.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-white/10 dark:bg-white/5">
            <UserRound className="mx-auto text-zinc-400" size={40} />
            <h2 className="mt-5 text-3xl font-black">No users yet</h2>
            <p className="mt-3 text-sm text-zinc-500">Profiles appear after students sign up.</p>
          </div>
        ) : (
          <AdminUsersTable users={users} adminEmails={adminEmails} />
        )}
      </section>
    </main>
  );
}
