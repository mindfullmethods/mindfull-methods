"use server";

import { revalidatePath } from "next/cache";

import type { NotificationPrefs } from "@/lib/notification-prefs";
import { createClient } from "@/lib/supabase/server";

export async function updateNotificationPrefsAction(prefs: NotificationPrefs) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false as const, error: "Please sign in." };
  }

  const { error } = await supabase.auth.updateUser({
    data: {
      notify_application_updates: prefs.applicationUpdates,
      notify_enrollment_receipts: prefs.enrollmentReceipts,
      notify_course_reminders: prefs.courseReminders,
      notify_inquiry_updates: prefs.inquiryUpdates,
      notify_certificate_updates: prefs.certificateUpdates,
    },
  });

  if (error) {
    return { ok: false as const, error: error.message };
  }

  revalidatePath("/dashboard/settings");
  return { ok: true as const };
}
