import DashboardPageHeader from "@/components/components/dashboard/DashboardPageHeader";
import SettingsForm from "@/components/components/dashboard/SettingsForm";
import SettingsNotificationPrefs from "@/components/components/dashboard/SettingsNotificationPrefs";
import { getSessionUser, requireUser } from "@/lib/auth";
import { parseNotificationPrefs } from "@/lib/notification-prefs";

export default async function SettingsPage() {
  await requireUser("/dashboard/settings");
  const user = await getSessionUser();

  const fullName =
    (user?.user_metadata?.full_name as string | undefined) ??
    (user?.user_metadata?.name as string | undefined) ??
    "";

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <DashboardPageHeader
        eyebrow="Account"
        title="Settings"
        description="Profile, password, and which transactional emails you receive."
      />

      <div className="mt-8 grid gap-6">
        <SettingsForm email={user?.email ?? ""} initialName={fullName} />
        <SettingsNotificationPrefs initial={parseNotificationPrefs(user?.user_metadata)} />
      </div>
    </main>
  );
}
