"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const MAX_BYTES = 5 * 1024 * 1024;
const BUCKET = "resumes";
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export type UploadResumeResult = { ok: true; url: string } | { ok: false; error: string };

export async function uploadResumeAction(formData: FormData): Promise<UploadResumeResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Please sign in to upload a resume." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Choose a PDF or Word file." };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: "Resume must be 5 MB or smaller." };
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return { ok: false, error: "Use PDF or Word (.doc / .docx)." };
  }

  const safeName = file.name.replace(/[^\w.-]+/g, "_").slice(0, 80) || "resume";
  const path = `${user.id}/${Date.now()}-${safeName}`;

  try {
    const admin = createAdminClient();
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error } = await admin.storage.from(BUCKET).upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

    if (error) {
      return {
        ok: false,
        error: error.message.includes("Bucket not found")
          ? "Run supabase/storage-resumes.sql in the Supabase SQL Editor."
          : error.message,
      };
    }

    const { data } = admin.storage.from(BUCKET).getPublicUrl(path);
    return { ok: true, url: data.publicUrl };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed.";
    return { ok: false, error: message };
  }
}
