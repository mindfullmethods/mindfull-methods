"use client";

import { useRef, useState } from "react";
import { ExternalLink, Link2, Loader2, Upload } from "lucide-react";

import { uploadResumeAction } from "@/actions/uploadResume";

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

const hints = [
  { label: "Google Drive", example: "https://drive.google.com/file/d/…" },
  { label: "Notion", example: "https://notion.so/…" },
  { label: "GitHub", example: "https://github.com/username" },
  { label: "Portfolio", example: "https://yoursite.dev" },
];

export default function ApplyResumeField({ defaultValue = "" }: { defaultValue?: string }) {
  const [resume, setResume] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [uploadNote, setUploadNote] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const trimmed = resume.trim();
  const valid = trimmed ? isValidUrl(trimmed) : true;

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadNote("");
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadResumeAction(formData);
    setUploading(false);

    if (result.ok) {
      setResume(result.url);
      setUploadNote("Resume uploaded — link saved with your application.");
    } else {
      setUploadNote(result.error);
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="space-y-4">
      <input type="hidden" name="resume" value={resume} />

      <label className="block">
        <span className="flex items-center gap-2 text-sm font-semibold mm-heading">
          <Link2 size={14} />
          Resume or portfolio link
          <span className="font-normal text-zinc-500">(optional)</span>
        </span>
        <input
          type="url"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          placeholder="https://drive.google.com/… or https://github.com/you"
          className={`mt-2 mm-input w-full ${!valid ? "border-red-400" : ""}`}
        />
        {!valid ? (
          <p className="mt-2 text-xs font-semibold text-red-600">Enter a valid http(s) URL.</p>
        ) : trimmed && valid ? (
          <a
            href={trimmed}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-violet-600 hover:underline dark:text-violet-300"
          >
            Preview link
            <ExternalLink size={12} />
          </a>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {hints.map((hint) => (
              <span
                key={hint.label}
                className="rounded-lg border mm-border bg-zinc-50/80 px-2.5 py-1 text-[11px] font-semibold mm-muted dark:bg-white/[0.02]"
                title={hint.example}
              >
                {hint.label}
              </span>
            ))}
          </div>
        )}
      </label>

      <div className="rounded-2xl border border-dashed mm-border bg-zinc-50/60 px-4 py-4 dark:bg-white/[0.02]">
        <p className="text-sm font-bold mm-heading">Or upload a file</p>
        <p className="mt-1 text-xs mm-muted">PDF or Word, max 5 MB. Stored securely and linked on your application.</p>
        <label className="mt-3 inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border mm-border bg-white px-4 text-sm font-bold transition hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-white/5">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploading ? "Uploading…" : "Choose resume file"}
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="sr-only"
            disabled={uploading}
            onChange={handleFileChange}
          />
        </label>
        {uploadNote ? (
          <p
            className={`mt-2 text-xs font-bold ${uploadNote.includes("uploaded") ? "text-emerald-600 dark:text-emerald-400" : "text-amber-700 dark:text-amber-300"}`}
          >
            {uploadNote}
          </p>
        ) : null}
      </div>
    </div>
  );
}
