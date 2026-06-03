export type NotificationPrefs = {
  applicationUpdates: boolean;
  enrollmentReceipts: boolean;
  courseReminders: boolean;
  inquiryUpdates: boolean;
  certificateUpdates: boolean;
};

export function parseNotificationPrefs(metadata: Record<string, unknown> | undefined): NotificationPrefs {
  const bool = (key: string, defaultValue: boolean) => {
    const value = metadata?.[key];
    if (typeof value === "boolean") return value;
    return defaultValue;
  };

  return {
    applicationUpdates: bool("notify_application_updates", true),
    enrollmentReceipts: bool("notify_enrollment_receipts", true),
    courseReminders: bool("notify_course_reminders", true),
    inquiryUpdates: bool("notify_inquiry_updates", true),
    certificateUpdates: bool("notify_certificate_updates", true),
  };
}
