import { createAdminClient } from "@/lib/supabase/admin";
import { parseNotificationPrefs } from "@/lib/notification-prefs";

export type StudentEmailChannel =
  | "application"
  | "enrollment"
  | "course_reminder"
  | "inquiry"
  | "certificate";

export async function shouldSendStudentEmail(
  studentEmail: string,
  channel: StudentEmailChannel
): Promise<boolean> {
  const email = studentEmail.trim().toLowerCase();
  if (!email) return false;

  try {
    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("id")
      .ilike("email", email)
      .maybeSingle();

    if (!profile?.id) return true;

    const { data: userData, error } = await admin.auth.admin.getUserById(profile.id);
    if (error || !userData.user) return true;

    const prefs = parseNotificationPrefs(userData.user.user_metadata as Record<string, unknown>);

    switch (channel) {
      case "application":
        return prefs.applicationUpdates;
      case "enrollment":
        return prefs.enrollmentReceipts;
      case "course_reminder":
        return prefs.courseReminders;
      case "inquiry":
        return prefs.inquiryUpdates;
      case "certificate":
        return prefs.certificateUpdates;
      default:
        return true;
    }
  } catch {
    return true;
  }
}
