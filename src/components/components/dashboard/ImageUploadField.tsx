"use client";

import { useRef, useState } from "react";
import { ImageIcon, Loader2, Upload } from "lucide-react";

import { uploadMarketingImageAction } from "@/actions/uploadMarketingImage";

type ImageUploadFieldProps = {
  name?: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
};

export default function ImageUploadField({
  name = "image_url",
  label = "Image URL",
  defaultValue = "",
  placeholder = "/images/marketing/internship-fallback.jpg",
}: ImageUploadFieldProps) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

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
      setUrl(result.url);
      setMessage("Uploaded — URL filled in below.");
    } else {
      setMessage(result.error);
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="block">
      <span className="text-sm font-semibold mm-heading">{label}</span>
      <input type="hidden" name={name} value={url} />
      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-stretch">
        <input
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder={placeholder}
          className="mm-input min-h-11 flex-1"
        />
        <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-bold transition hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploading ? "Uploading…" : "Upload"}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            disabled={uploading}
            onChange={handleFileChange}
          />
        </label>
      </div>
      {url ? (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-2 dark:border-white/10 dark:bg-white/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt=""
            className="h-14 w-20 shrink-0 rounded-lg object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <p className="min-w-0 break-all text-xs font-semibold text-zinc-500">{url}</p>
        </div>
      ) : (
        <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
          <ImageIcon size={14} />
          Paste a URL or upload to Supabase Storage (max 2 MB)
        </p>
      )}
      {message ? (
        <p
          className={`mt-2 text-xs font-bold ${message.includes("Uploaded") ? "text-emerald-600 dark:text-emerald-400" : "text-amber-700 dark:text-amber-300"}`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
