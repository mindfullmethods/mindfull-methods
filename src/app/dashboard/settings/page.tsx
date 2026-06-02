import DashboardPageHeader from "@/components/components/dashboard/DashboardPageHeader";
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
      <DashboardPageHeader
        eyebrow="Account"
        title="Settings"
        description="Update your display name for certificates and change your password."
      />

      <SettingsForm email={user?.email ?? ""} initialName={fullName} />
    </main>
  );
}
