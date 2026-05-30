import { Settings } from "lucide-react";

import SettingsForm from "@/components/components/dashboard/SettingsForm";
import { getSessionUser, requireUser } from "@/lib/auth";

export default async function SettingsPage() {
  await requireUser("/dashboard/settings");
  const user = await getSessionUser();

  const fullName =
    (user?.user_metadata?.full_name as string | undefined) ??
    (user?.user_metadata?.name as string | undefined) ??
    "";

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
        <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.28em] text-zinc-500">
          <Settings size={16} />
          Account
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Settings</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          Update your display name for certificates and change your password.
        </p>
      </section>

      <SettingsForm email={user?.email ?? ""} initialName={fullName} />
    </main>
  );
}
