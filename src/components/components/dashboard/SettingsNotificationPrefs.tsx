"use client";

import { useState, useTransition } from "react";
import { Bell } from "lucide-react";

import { updateNotificationPrefsAction } from "@/actions/updateNotificationPrefs";
import type { NotificationPrefs } from "@/lib/notification-prefs";
import SectionHeader from "@/components/marketing/SectionHeader";

const toggles: { key: keyof NotificationPrefs; label: string; description: string }[] = [
  {
    key: "applicationUpdates",
    label: "Internship application updates",
    description: "Emails when you apply or when an admin changes your application status.",
  },
  {
    key: "enrollmentReceipts",
    label: "Enrollment & payment receipts",
    description: "Confirmation when you enroll in a course or complete checkout.",
  },
  {
    key: "courseReminders",
    label: "Course progress reminders",
    description: "Nudges to continue weekly lessons (when the platform sends them).",
  },
  {
    key: "inquiryUpdates",
    label: "Contact inquiry updates",
    description: "Emails when your contact form inquiry status changes.",
  },
  {
    key: "certificateUpdates",
    label: "Certificate & milestone review",
    description: "Emails when you complete all weeks, receive a certificate, or need more work.",
  },
];

export default function SettingsNotificationPrefs({ initial }: { initial: NotificationPrefs }) {
  const [prefs, setPrefs] = useState(initial);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function save() {
    setMessage("");
    startTransition(async () => {
      const result = await updateNotificationPrefsAction(prefs);
      setMessage(result.ok ? "Notification preferences saved." : result.error);
    });
  }

  return (
    <section className="mm-section-panel">
      <SectionHeader
        title="Email notifications"
        description="Choose which transactional emails you want. Marketing is off by default."
      />
      <ul className="mt-6 space-y-4">
        {toggles.map((item) => (
          <li
            key={item.key}
            className="flex items-start justify-between gap-4 rounded-2xl border mm-border bg-zinc-50/50 px-4 py-4 dark:bg-white/[0.02]"
          >
            <div className="min-w-0">
              <p className="text-sm font-bold mm-heading">{item.label}</p>
              <p className="mt-1 text-xs leading-5 mm-muted">{item.description}</p>
            </div>
            <label className="relative inline-flex shrink-0 cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={prefs[item.key]}
                onChange={(e) => setPrefs((prev) => ({ ...prev, [item.key]: e.target.checked }))}
              />
              <span className="h-7 w-12 rounded-full bg-zinc-300 transition peer-checked:bg-violet-600 peer-focus-visible:ring-2 peer-focus-visible:ring-violet-400/40 dark:bg-zinc-700" />
              <span className="absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
            </label>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={save}
        disabled={isPending}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
      >
        <Bell size={16} />
        {isPending ? "Saving…" : "Save notification preferences"}
      </button>
      {message ? <p className="mt-3 text-sm font-semibold text-violet-600 dark:text-violet-300">{message}</p> : null}
    </section>
  );
}
