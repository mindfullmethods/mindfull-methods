import type { MetadataRoute } from "next";

import { getBlogSlugs } from "@/lib/blog-posts";
import { businessServices } from "@/lib/business-services";
import { getCourseSlugs } from "@/lib/courses";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/courses`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/business`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/business/data-annotation`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/signup`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const courseRoutes: MetadataRoute.Sitemap = getCourseSlugs().map((slug) => ({
    url: `${base}/courses/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = getBlogSlugs().map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const businessRoutes: MetadataRoute.Sitemap = businessServices.map((s) => ({
    url: `${base}/business/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...courseRoutes, ...blogRoutes, ...businessRoutes];
}
