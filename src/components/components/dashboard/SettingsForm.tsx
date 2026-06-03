"use client";

import { useState, useTransition } from "react";

import SectionHeader from "@/components/marketing/SectionHeader";
import { updatePasswordAction, updateProfileAction } from "@/actions/updateProfile";

export default function SettingsForm({
  email,
  initialName,
}: {
  email: string;
  initialName: string;
}) {
  const [fullName, setFullName] = useState(initialName);
  const [password, setPassword] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function saveProfile() {
    setProfileMessage("");
    startTransition(async () => {
      const result = await updateProfileAction(fullName);
      setProfileMessage(result.ok ? "Profile updated." : result.error);
    });
  }

  function savePassword() {
    setPasswordMessage("");
    startTransition(async () => {
      const result = await updatePasswordAction(password);
      if (result.ok) {
        setPassword("");
        setPasswordMessage("Password updated.");
        return;
      }
      setPasswordMessage(result.error);
    });
  }

  return (
    <div className="grid gap-6 lg:col-span-2 lg:grid-cols-2">
      <section className="mm-section-panel">
        <SectionHeader
          title="Profile"
          description="Used on certificates and mentor communications."
        />
        <label className="mt-6 block">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] mm-subtle">Full name</span>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-2 mm-input w-full"
          />
        </label>
        <label className="mt-4 block">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] mm-subtle">Email</span>
          <input
            value={email}
            disabled
            className="mt-2 mm-input w-full opacity-70"
          />
        </label>
        <button
          type="button"
          onClick={saveProfile}
          disabled={isPending}
          className="mt-6 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-bold text-white disabled:opacity-60 dark:bg-white dark:text-zinc-950"
        >
          Save profile
        </button>
        {profileMessage ? <p className="mt-3 text-sm font-semibold text-violet-600 dark:text-violet-300">{profileMessage}</p> : null}
      </section>

      <section className="mm-section-panel">
        <SectionHeader
          title="Password"
          description="Choose a strong password with at least 8 characters."
        />
        <label className="mt-6 block">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] mm-subtle">New password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 mm-input w-full"
          />
        </label>
        <button
          type="button"
          onClick={savePassword}
          disabled={isPending || password.length < 8}
          className="mt-6 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          Update password
        </button>
        {passwordMessage ? <p className="mt-3 text-sm font-semibold text-violet-600 dark:text-violet-300">{passwordMessage}</p> : null}
      </section>
    </div>
  );
}
