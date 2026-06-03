"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";

import { uploadMarketingImageAction } from "@/actions/uploadMarketingImage";

export default function MentorImageField({
  value,
  onChange,
  disabled,
  fallbackSrc,
  mentorName,
}: {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  fallbackSrc: string;
  mentorName: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const previewSrc = value?.startsWith("http") || value?.startsWith("/") ? value : fallbackSrc;

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("");
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadMarketingImageAction(formData);
    setUploading(false);

    if (result.ok) {
      onChange(result.url);
      setMessage("Mentor photo uploaded.");
    } else {
      setMessage(result.error);
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl border mm-border bg-white dark:bg-zinc-900">
          <Image src={previewSrc} alt={mentorName} fill className="object-cover" sizes="128px" />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled || uploading}
            className="mm-input w-full"
            placeholder={fallbackSrc}
          />
          <label className="inline-flex min-h-10 w-fit cursor-pointer items-center justify-center gap-2 rounded-xl border mm-border px-4 text-sm font-bold disabled:opacity-60">
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? "Uploading…" : "Upload mentor photo"}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              disabled={disabled || uploading}
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>
      {message ? (
        <p
          className={`mt-2 text-xs font-bold ${message.includes("uploaded") ? "text-emerald-600 dark:text-emerald-400" : "text-amber-700 dark:text-amber-300"}`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
