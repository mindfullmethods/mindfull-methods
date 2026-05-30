"use client";

import { useState, useTransition } from "react";
import { Mail } from "lucide-react";

import { sendAdminDigestEmail } from "@/actions/sendAdminDigest";

export default function SendDigestButton() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  return (
    <div>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          setMessage("");
          startTransition(async () => {
            const result = await sendAdminDigestEmail();
            setMessage(result.ok ? "Digest sent to admin inbox." : result.error);
          });
        }}
        className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-black text-white disabled:opacity-60"
      >
        <Mail size={16} />
        {isPending ? "Sending…" : "Send admin digest email"}
      </button>
      {message ? <p className="mt-2 text-sm font-bold text-zinc-600 dark:text-zinc-400">{message}</p> : null}
    </div>
  );
}
