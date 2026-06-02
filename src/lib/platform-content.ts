import { cache } from "react";

import type { BlogPost } from "@/lib/blog-posts";
import { getBlogPosts as getStaticBlogPosts } from "@/lib/blog-posts";
import type { Course, CourseCurriculumItem, CourseFaq } from "@/lib/courses";
import { getCourseBySlug as getStaticCourseBySlug, getCourses as getStaticCourses, normalizeCourseSlug } from "@/lib/courses";
import { createAdminClient } from "@/lib/supabase/admin";

export type CourseOverride = {
  title?: string;
  shortDescription?: string;
  longDescription?: string;
  level?: string;
  duration?: string;
  priceLabel?: string;
  priceInPaise?: number;
  featured?: boolean;
  tags?: string[];
  learnOutcomes?: string[];
  curriculum?: CourseCurriculumItem[];
  faqs?: CourseFaq[];
  hidden?: boolean;
};

export type BlogPostOverride = Partial<BlogPost> & { slug: string; hidden?: boolean };

export type CustomCourse = Course & { cmsOnly?: true };

export const isPlatformSettingsReady = cache(async () => {
  try {
    const admin = createAdminClient();
    const { error } = await admin.from("platform_settings").select("key").limit(1);
    return !error;
  } catch {
    return false;
  }
});

async function readSetting<T>(key: string, fallback: T): Promise<T> {
  try {
    const admin = createAdminClient();
    const { data } = await admin.from("platform_settings").select("value").eq("key", key).maybeSingle();
    if (!data?.value) return fallback;
    return data.value as T;
  } catch {
    return fallback;
  }
}

export async function getCourseOverrides(): Promise<Record<string, CourseOverride>> {
  return readSetting("course_overrides", {});
}

export async function getCustomCourses(): Promise<CustomCourse[]> {
  return readSetting("custom_courses", []);
}

function mergeCourse(base: Course, patch?: CourseOverride): Course {
  if (!patch) return base;
  return {
    ...base,
    ...patch,
    featured: patch.featured ?? base.featured,
    tags: patch.tags ?? base.tags,
    learnOutcomes: patch.learnOutcomes ?? base.learnOutcomes,
    curriculum: patch.curriculum ?? base.curriculum,
    faqs: patch.faqs ?? base.faqs,
  };
}

export async function getCoursesWithOverrides(): Promise<Course[]> {
  const [overrides, customCourses] = await Promise.all([getCourseOverrides(), getCustomCourses()]);

  const staticCourses = getStaticCourses()
    .filter((course) => !overrides[course.slug]?.hidden)
    .map((course) => mergeCourse(course, overrides[course.slug]));

  const staticSlugs = new Set(staticCourses.map((c) => c.slug));
  const extra = customCourses.filter((c) => !staticSlugs.has(c.slug) && !overrides[c.slug]?.hidden);

  return [...staticCourses, ...extra.map((c) => mergeCourse(c, overrides[c.slug]))].sort((a, b) =>
    a.title.localeCompare(b.title)
  );
}

export const getResolvedCourses = cache(getCoursesWithOverrides);

export async function getResolvedCourseBySlug(slug: string): Promise<Course | null> {
  const normalized = normalizeCourseSlug(slug);
  const courses = await getResolvedCourses();
  return courses.find((c) => c.slug === normalized) ?? null;
}

export async function getResolvedCourseSlugs(): Promise<string[]> {
  const courses = await getResolvedCourses();
  return courses.map((c) => c.slug);
}

export async function getBlogPostsWithOverrides(): Promise<BlogPost[]> {
  const overrides = await readSetting<BlogPostOverride[]>("blog_posts", []);
  if (!overrides.length) return getStaticBlogPosts();

  const staticPosts = getStaticBlogPosts();
  const bySlug = new Map(staticPosts.map((p) => [p.slug, p]));

  for (const patch of overrides) {
    if (patch.hidden) {
      bySlug.delete(patch.slug);
      continue;
    }

    const base = bySlug.get(patch.slug);
    if (base) {
      bySlug.set(patch.slug, { ...base, ...patch, slug: patch.slug });
    } else if (patch.title && patch.content) {
      bySlug.set(patch.slug, {
        slug: patch.slug,
        title: patch.title,
        excerpt: patch.excerpt ?? "",
        content: patch.content,
        publishedAt: patch.publishedAt ?? new Date().toISOString().slice(0, 10),
        author: patch.author ?? "Mindfull Methods",
        tags: patch.tags ?? [],
      });
    }
  }

  return [...bySlug.values()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getBlogPostWithOverrides(slug: string) {
  const posts = await getBlogPostsWithOverrides();
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function savePlatformSetting(key: string, value: unknown) {
  const admin = createAdminClient();
  const { error } = await admin.from("platform_settings").upsert(
    { key, value, updated_at: new Date().toISOString() },
    { onConflict: "key" },
  );
  if (error) throw new Error(error.message);
}

/** Sync fallback for code paths that cannot await CMS (uses static catalog only). */
export function getCourseBySlugSync(slug: string) {
  return getStaticCourseBySlug(slug);
}
