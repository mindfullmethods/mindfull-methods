"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import type { BlogPost } from "@/lib/blog-posts";
import { getBlogPosts } from "@/lib/blog-posts";
import type { Course, CourseCurriculumItem, CourseFaq } from "@/lib/courses";
import { getCourses } from "@/lib/courses";
import { getCourseImage } from "@/lib/images";
import {
  getCustomCourses,
  getCourseOverrides,
  savePlatformSetting,
  type BlogPostOverride,
  type CourseOverride,
  type CustomCourse,
} from "@/lib/platform-content";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseCurriculumJson(raw: string): CourseCurriculumItem[] | null {
  if (!raw.trim()) return null;
  try {
    const parsed = JSON.parse(raw) as CourseCurriculumItem[];
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function parseFaqsJson(raw: string): CourseFaq[] | null {
  if (!raw.trim()) return null;
  try {
    const parsed = JSON.parse(raw) as CourseFaq[];
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function readBlogOverrides() {
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const admin = createAdminClient();
  const { data } = await admin.from("platform_settings").select("value").eq("key", "blog_posts").maybeSingle();
  return (data?.value as BlogPostOverride[] | undefined) ?? [];
}

export async function saveCourseOverrides(formData: FormData) {
  await requireAdmin();

  const overrides: Record<string, CourseOverride> = {};

  for (const course of getCourses()) {
    const desc = String(formData.get(`desc_${course.slug}`) ?? "").trim();
    const priceLabel = String(formData.get(`price_${course.slug}`) ?? "").trim();
    const featured = formData.get(`featured_${course.slug}`) === "on";

    const patch: CourseOverride = {};
    if (desc && desc !== course.shortDescription) patch.shortDescription = desc;
    if (priceLabel && priceLabel !== course.priceLabel) patch.priceLabel = priceLabel;
    if (featured !== course.featured) patch.featured = featured;

    if (Object.keys(patch).length > 0) overrides[course.slug] = patch;
  }

  try {
    const existing = await getCourseOverrides();
    await savePlatformSetting("course_overrides", { ...existing, ...overrides });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed.";
    return { ok: false as const, error: message };
  }

  revalidatePathsForCourses();
  return { ok: true as const };
}

export async function saveFullCourseOverride(formData: FormData) {
  await requireAdmin();

  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) return { ok: false as const, error: "Course slug is required." };

  const base = getCourses().find((c) => c.slug === slug);
  const custom = (await getCustomCourses()).find((c) => c.slug === slug);
  if (!base && !custom) {
    return { ok: false as const, error: "Unknown course slug." };
  }

  const priceInPaiseRaw = String(formData.get("priceInPaise") ?? "").trim();
  const priceInPaise = priceInPaiseRaw ? Number(priceInPaiseRaw) : undefined;
  const curriculum = parseCurriculumJson(String(formData.get("curriculumJson") ?? ""));
  const faqs = parseFaqsJson(String(formData.get("faqsJson") ?? ""));

  const patch: CourseOverride = {
    title: String(formData.get("title") ?? "").trim() || undefined,
    shortDescription: String(formData.get("shortDescription") ?? "").trim() || undefined,
    longDescription: String(formData.get("longDescription") ?? "").trim() || undefined,
    level: String(formData.get("level") ?? "").trim() || undefined,
    duration: String(formData.get("duration") ?? "").trim() || undefined,
    priceLabel: String(formData.get("priceLabel") ?? "").trim() || undefined,
    priceInPaise: priceInPaise && !Number.isNaN(priceInPaise) ? priceInPaise : undefined,
    featured: formData.get("featured") === "on",
    tags: parseLines(String(formData.get("tags") ?? "")),
    learnOutcomes: parseLines(String(formData.get("learnOutcomes") ?? "")),
    curriculum: curriculum ?? undefined,
    faqs: faqs ?? undefined,
  };

  try {
    const existing = await getCourseOverrides();
    const current = existing[slug] ?? {};
    const merged: CourseOverride = { ...current };

    for (const [key, value] of Object.entries(patch)) {
      if (value === undefined) continue;
      if (Array.isArray(value) && value.length === 0) continue;
      (merged as Record<string, unknown>)[key] = value;
    }

    await savePlatformSetting("course_overrides", { ...existing, [slug]: merged });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed.";
    if (message.includes("platform_settings")) {
      return { ok: false as const, error: "Run supabase/content-cms-schema.sql in Supabase first." };
    }
    return { ok: false as const, error: message };
  }

  revalidatePathsForCourses(slug);
  return { ok: true as const };
}

export async function saveCustomCourse(formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugify(slugInput || title);

  if (!title || !slug) {
    return { ok: false as const, error: "Title and slug are required." };
  }

  const priceInPaise = Number(String(formData.get("priceInPaise") ?? "0"));
  const curriculum = parseCurriculumJson(String(formData.get("curriculumJson") ?? ""));

  const course: CustomCourse = {
    id: `cms-${slug}`,
    slug,
    title,
    shortDescription: String(formData.get("shortDescription") ?? "").trim() || title,
    longDescription: String(formData.get("longDescription") ?? "").trim() || title,
    level: String(formData.get("level") ?? "").trim() || "All levels",
    duration: String(formData.get("duration") ?? "").trim() || "8 weeks",
    mode: "Online",
    priceLabel: String(formData.get("priceLabel") ?? "").trim() || `₹${Math.round(priceInPaise / 100).toLocaleString("en-IN")}`,
    priceInPaise: Number.isFinite(priceInPaise) ? priceInPaise : 0,
    tags: parseLines(String(formData.get("tags") ?? "")),
    imageUrl: getCourseImage(slug),
    featured: formData.get("featured") === "on",
    learnOutcomes: parseLines(String(formData.get("learnOutcomes") ?? "")),
    curriculum: curriculum ?? [{ week: "Week 1", topics: ["Getting started"] }],
    faqs: [],
    cmsOnly: true,
  };

  try {
    const existing = await getCustomCourses();
    if (existing.some((c) => c.slug === slug) || getCourses().some((c) => c.slug === slug)) {
      const without = existing.filter((c) => c.slug !== slug);
      await savePlatformSetting("custom_courses", [...without, course]);
    } else {
      await savePlatformSetting("custom_courses", [...existing, course]);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed.";
    return { ok: false as const, error: message };
  }

  revalidatePathsForCourses(slug);
  return { ok: true as const, slug };
}

export async function hideCourse(slug: string) {
  await requireAdmin();

  try {
    const existing = await getCourseOverrides();
    await savePlatformSetting("course_overrides", {
      ...existing,
      [slug]: { ...existing[slug], hidden: true },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Hide failed.";
    return { ok: false as const, error: message };
  }

  revalidatePathsForCourses(slug);
  return { ok: true as const };
}

export async function saveBlogPostOverride(formData: FormData) {
  await requireAdmin();

  const slug = String(formData.get("slug") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const publishedAt = String(formData.get("publishedAt") ?? "").trim();
  const tags = parseLines(String(formData.get("tags") ?? ""));

  if (!slug || !title || !content) {
    return { ok: false as const, error: "Slug, title, and content are required." };
  }

  const patch: BlogPostOverride = {
    slug,
    title,
    excerpt,
    content,
    publishedAt: publishedAt || new Date().toISOString().slice(0, 10),
    tags,
  };

  try {
    const existing = await readBlogOverrides();
    const next = [...existing.filter((p) => p.slug !== slug), patch];
    await savePlatformSetting("blog_posts", next);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed.";
    if (message.includes("platform_settings") || message.includes("schema cache")) {
      return { ok: false as const, error: "Run supabase/content-cms-schema.sql in Supabase first." };
    }
    return { ok: false as const, error: message };
  }

  revalidatePath("/dashboard/admin/content");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  return { ok: true as const };
}

export async function createBlogPost(formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugify(slugInput || title);
  const content = String(formData.get("content") ?? "").trim();

  if (!title || !slug || !content) {
    return { ok: false as const, error: "Title, slug, and content are required." };
  }

  const patch: BlogPostOverride = {
    slug,
    title,
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    content,
    publishedAt: new Date().toISOString().slice(0, 10),
    author: "Mindfull Methods",
    tags: parseLines(String(formData.get("tags") ?? "")),
  };

  try {
    const existing = await readBlogOverrides();
    await savePlatformSetting("blog_posts", [...existing.filter((p) => p.slug !== slug), patch]);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Create failed.";
    return { ok: false as const, error: message };
  }

  revalidatePath("/dashboard/admin/content");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  return { ok: true as const, slug };
}

export async function deleteBlogPost(slug: string) {
  await requireAdmin();

  try {
    const existing = await readBlogOverrides();
    const isStatic = getBlogPosts().some((p) => p.slug === slug);
    const next = isStatic
      ? [...existing.filter((p) => p.slug !== slug), { slug, hidden: true }]
      : existing.filter((p) => p.slug !== slug);
    await savePlatformSetting("blog_posts", next);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed.";
    return { ok: false as const, error: message };
  }

  revalidatePath("/dashboard/admin/content");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  return { ok: true as const };
}

export async function sendBulkStudentEmail(userIds: string[], subject: string, body: string) {
  await requireAdmin();

  if (!userIds.length) return { ok: false as const, error: "Select at least one student." };
  if (!subject.trim() || !body.trim()) return { ok: false as const, error: "Subject and message are required." };

  const { createAdminClient } = await import("@/lib/supabase/admin");
  const { sendEmail } = await import("@/lib/email");

  let admin;
  try {
    admin = createAdminClient();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Admin client not configured.";
    return { ok: false as const, error: message };
  }

  const { data: profiles } = await admin.from("profiles").select("id, full_name, email").in("id", userIds);
  let sent = 0;

  for (const profile of profiles ?? []) {
    if (!profile.email?.includes("@")) continue;
    const name = (profile.full_name as string | undefined) ?? profile.email.split("@")[0] ?? "Student";
    try {
      await sendEmail({
        to: profile.email,
        subject: subject.trim(),
        text: `Hi ${name},\n\n${body.trim()}\n\n— Mindfull Methods`,
        html: `<p>Hi ${name},</p><p>${body.trim().replace(/\n/g, "<br />")}</p><p>— Mindfull Methods</p>`,
      });
      sent += 1;
    } catch (err) {
      console.error("[sendBulkStudentEmail]", profile.email, err);
    }
  }

  return { ok: true as const, sent };
}

function revalidatePathsForCourses(slug?: string) {
  revalidatePath("/dashboard/admin/content");
  revalidatePath("/courses");
  revalidatePath("/dashboard/courses");
  revalidatePath("/");
  revalidatePath("/dashboard");
  if (slug) {
    revalidatePath(`/courses/${slug}`);
    revalidatePath(`/dashboard/courses/${slug}`);
  }
}
