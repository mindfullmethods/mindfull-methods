"use client";

import { useState, useTransition } from "react";
import { ShieldCheck, UserRound } from "lucide-react";

import { updateUserRole } from "@/actions/updateUserRole";

export default function AdminUsersTable({
  users,
  adminEmails,
}: {
  users: {
    id: string;
    full_name: string | null;
    email: string | null;
    applicationCount: number;
    enrollmentCount: number;
    lastActivity: string | null;
    role?: string | null;
  }[];
  adminEmails: string[];
}) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function formatDate(value: string | null) {
    if (!value) return "—";
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  }

  function isAdmin(user: { email: string | null; role?: string | null }) {
    if (user.role === "admin") return true;
    return user.email ? adminEmails.includes(user.email.toLowerCase()) : false;
  }

  return (
    <>
      <div className="overflow-x-auto rounded-3xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-[#f7f8f5] dark:border-white/10 dark:bg-zinc-950">
            <tr>
              <th className="px-5 py-4 font-black">Name</th>
              <th className="px-5 py-4 font-black">Email</th>
              <th className="px-5 py-4 font-black">Applications</th>
              <th className="px-5 py-4 font-black">Enrollments</th>
              <th className="px-5 py-4 font-black">Last activity</th>
              <th className="px-5 py-4 font-black">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const admin = isAdmin(user);
              return (
                <tr key={user.id} className="border-b border-zinc-100 dark:border-white/5">
                  <td className="px-5 py-4 font-bold">{user.full_name ?? "—"}</td>
                  <td className="px-5 py-4">{user.email ?? "—"}</td>
                  <td className="px-5 py-4">{user.applicationCount}</td>
                  <td className="px-5 py-4">{user.enrollmentCount}</td>
                  <td className="px-5 py-4 text-zinc-500">{formatDate(user.lastActivity)}</td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => {
                        setMessage("");
                        startTransition(async () => {
                          const result = await updateUserRole(user.id, admin ? "student" : "admin");
                          setMessage(result.ok ? "Role updated." : result.error);
                        });
                      }}
                      className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-black ${
                        admin
                          ? "bg-violet-600 text-white"
                          : "border border-zinc-200 bg-white dark:border-white/10"
                      }`}
                    >
                      {admin ? <ShieldCheck size={14} /> : <UserRound size={14} />}
                      {admin ? "Admin" : "Student"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {message ? <p className="mt-4 text-sm font-bold text-violet-600">{message}</p> : null}
    </>
  );
}
