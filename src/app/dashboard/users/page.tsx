import Link from "next/link";
import { ClipboardList, GraduationCap, UserRound } from "lucide-react";

import { getAdminUsers } from "@/Services/admin-users";
import { requireAdmin } from "@/lib/auth";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default async function AdminUsersPage() {
  await requireAdmin();
  const users = await getAdminUsers();

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-zinc-500">Students</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Registered users</h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          Everyone who signed up — with internship applications and course enrollments at a glance.
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
          <div className="overflow-x-auto rounded-3xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-200 bg-[#f7f8f5] dark:border-white/10 dark:bg-zinc-950">
                <tr>
                  <th className="px-5 py-4 font-black">Name</th>
                  <th className="px-5 py-4 font-black">Email</th>
                  <th className="px-5 py-4 font-black">Applications</th>
                  <th className="px-5 py-4 font-black">Enrollments</th>
                  <th className="px-5 py-4 font-black">Last activity</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-zinc-100 dark:border-white/5">
                    <td className="px-5 py-4 font-bold">{user.full_name ?? "—"}</td>
                    <td className="px-5 py-4">
                      {user.email ? (
                        <a href={`mailto:${user.email}`} className="font-bold text-violet-600 dark:text-violet-300">
                          {user.email}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 font-bold">
                        <ClipboardList size={14} /> {user.applicationCount}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 font-bold">
                        <GraduationCap size={14} /> {user.enrollmentCount}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-zinc-500">{formatDate(user.lastActivity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="mt-6 text-sm text-zinc-500">
        Tip: open{" "}
        <Link href="/dashboard/applications" className="font-bold text-violet-600 dark:text-violet-300">
          applications
        </Link>{" "}
        or{" "}
        <Link href="/dashboard/enrollments" className="font-bold text-violet-600 dark:text-violet-300">
          enrollments
        </Link>{" "}
        for full detail.
      </p>
    </main>
  );
}
