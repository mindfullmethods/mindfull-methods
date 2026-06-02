"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { ChevronRight, Download, Mail, Search, ShieldCheck, UserRound } from "lucide-react";

import { sendBulkStudentEmail } from "@/actions/adminContent";
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
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.full_name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q),
    );
  }, [users, query]);

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

  function toggleAll(checked: boolean) {
    setSelected(checked ? new Set(filtered.map((u) => u.id)) : new Set());
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function exportEmails() {
    const emails = filtered
      .filter((u) => selected.has(u.id))
      .map((u) => u.email)
      .filter(Boolean) as string[];
    if (!emails.length) {
      setMessage("Select students to export.");
      return;
    }
    const csv = ["email", ...emails].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();
    URL.revokeObjectURL(url);
    setMessage(`Exported ${emails.length} email(s).`);
  }

  function sendBulk() {
    setMessage("");
    startTransition(async () => {
      const result = await sendBulkStudentEmail([...selected], subject, body);
      setMessage(result.ok ? `Sent to ${result.sent} student(s).` : result.error);
    });
  }

  const allSelected = filtered.length > 0 && filtered.every((u) => selected.has(u.id));

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or email…"
            className="w-full rounded-xl border border-zinc-200 bg-[#f7f8f5] py-3 pl-11 pr-4 text-sm font-semibold outline-none dark:border-white/10 dark:bg-zinc-950"
          />
        </div>
        <p className="text-sm font-bold text-zinc-500">{filtered.length} students</p>
      </div>

      {selected.size > 0 ? (
        <div className="mb-4 rounded-2xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-400/20 dark:bg-violet-400/10">
          <p className="text-sm font-black text-violet-800 dark:text-violet-200">{selected.size} selected</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={exportEmails}
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2 text-xs font-black text-white dark:bg-white dark:text-zinc-950"
            >
              <Download size={14} />
              Export emails
            </button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
              className="rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm font-semibold dark:border-violet-400/20 dark:bg-zinc-950"
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Message body…"
              rows={2}
              className="rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm font-semibold dark:border-violet-400/20 dark:bg-zinc-950 sm:col-span-2"
            />
          </div>
          <button
            type="button"
            disabled={isPending}
            onClick={sendBulk}
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-xs font-black text-white disabled:opacity-60"
          >
            <Mail size={14} />
            {isPending ? "Sending…" : "Email selected"}
          </button>
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-3xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-[#f7f8f5] dark:border-white/10 dark:bg-zinc-950">
            <tr>
              <th className="px-5 py-4">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => toggleAll(e.target.checked)}
                  aria-label="Select all"
                />
              </th>
              <th className="px-5 py-4 font-black">Name</th>
              <th className="px-5 py-4 font-black">Email</th>
              <th className="px-5 py-4 font-black">Applications</th>
              <th className="px-5 py-4 font-black">Enrollments</th>
              <th className="px-5 py-4 font-black">Last activity</th>
              <th className="px-5 py-4 font-black">Role</th>
              <th className="px-5 py-4 font-black" aria-label="View profile" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => {
              const admin = isAdmin(user);
              return (
                <tr key={user.id} className="border-b border-zinc-100 dark:border-white/5">
                  <td className="px-5 py-4">
                    <input
                      type="checkbox"
                      checked={selected.has(user.id)}
                      onChange={() => toggleOne(user.id)}
                      aria-label={`Select ${user.full_name ?? user.email}`}
                    />
                  </td>
                  <td className="px-5 py-4 font-bold">
                    <Link
                      href={`/dashboard/users/${user.id}`}
                      className="hover:text-violet-600 hover:underline dark:hover:text-violet-300"
                    >
                      {user.full_name ?? "—"}
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/dashboard/users/${user.id}`}
                      className="hover:text-violet-600 hover:underline dark:hover:text-violet-300"
                    >
                      {user.email ?? "—"}
                    </Link>
                  </td>
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
                  <td className="px-5 py-4">
                    <Link
                      href={`/dashboard/users/${user.id}`}
                      className="inline-flex items-center gap-1 text-xs font-black text-violet-600 hover:underline dark:text-violet-300"
                    >
                      View
                      <ChevronRight size={14} />
                    </Link>
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
