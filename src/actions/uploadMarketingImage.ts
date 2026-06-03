"use server";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const BUCKET = "marketing";

export type UploadMarketingImageResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export async function uploadMarketingImageAction(formData: FormData): Promise<UploadMarketingImageResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Admin access required." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Choose an image file to upload." };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: "Image must be 2 MB or smaller." };
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return { ok: false, error: "Use JPG, PNG, WebP, or GIF." };
  }

  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : file.type === "image/gif"
          ? "gif"
          : "jpg";
  const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;

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
          ? "Create the marketing storage bucket (run supabase/storage-marketing-uploads.sql)."
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
