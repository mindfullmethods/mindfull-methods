"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export default function ApplyResumeField({ defaultValue = "" }: { defaultValue?: string }) {
  const [resume, setResume] = useState(defaultValue);
  const valid = resume.trim() ? isValidUrl(resume.trim()) : true;

  return (
    <label className="block">
      <span className="text-sm font-black">Resume link</span>
      <input
        type="url"
        name="resume"
        value={resume}
        onChange={(e) => setResume(e.target.value)}
        placeholder="https://drive.google.com/… or portfolio URL"
        className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold outline-none dark:bg-zinc-900 ${
          valid ? "border-zinc-200 dark:border-white/10" : "border-red-400"
        }`}
      />
      {!valid ? (
        <p className="mt-2 text-xs font-bold text-red-600">Enter a valid http(s) URL.</p>
      ) : resume.trim() && valid ? (
        <a
          href={resume.trim()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-violet-600 hover:underline dark:text-violet-300"
        >
          Preview resume
          <ExternalLink size={12} />
        </a>
      ) : (
        <p className="mt-2 text-xs text-zinc-500">Google Drive, Notion, or portfolio links work best.</p>
      )}
    </label>
  );
}
