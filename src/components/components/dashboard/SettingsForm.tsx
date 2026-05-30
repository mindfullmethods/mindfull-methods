"use client";

import { useState, useTransition } from "react";

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
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
        <h2 className="text-xl font-black">Profile</h2>
        <p className="mt-2 text-sm text-zinc-500">Used on certificates and mentor communications.</p>
        <label className="mt-6 block">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Full name</span>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold dark:border-white/10 dark:bg-zinc-950"
          />
        </label>
        <label className="mt-4 block">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Email</span>
          <input
            value={email}
            disabled
            className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-3 text-sm font-semibold opacity-70 dark:border-white/10 dark:bg-zinc-900"
          />
        </label>
        <button
          type="button"
          onClick={saveProfile}
          disabled={isPending}
          className="mt-6 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-black text-white disabled:opacity-60 dark:bg-white dark:text-zinc-950"
        >
          Save profile
        </button>
        {profileMessage ? <p className="mt-3 text-sm font-bold text-violet-600">{profileMessage}</p> : null}
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
        <h2 className="text-xl font-black">Password</h2>
        <p className="mt-2 text-sm text-zinc-500">Choose a strong password with at least 8 characters.</p>
        <label className="mt-6 block">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">New password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold dark:border-white/10 dark:bg-zinc-950"
          />
        </label>
        <button
          type="button"
          onClick={savePassword}
          disabled={isPending || password.length < 8}
          className="mt-6 rounded-xl bg-violet-600 px-5 py-3 text-sm font-black text-white disabled:opacity-60"
        >
          Update password
        </button>
        {passwordMessage ? <p className="mt-3 text-sm font-bold text-violet-600">{passwordMessage}</p> : null}
      </section>
    </div>
  );
}
