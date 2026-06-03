import { cache } from "react";

import type { Testimonial } from "@/lib/testimonials";
import { marketingImages } from "@/lib/images";
import { getCourses } from "@/lib/courses";
import { isPlatformSettingsReady } from "@/lib/platform-content";
import { createAdminClient } from "@/lib/supabase/admin";

export type SiteStat = { label: string; value: string };

export type MentorProfile = {
  name: string;
  title: string;
  bio: string;
  email: string;
  imageUrl: string;
};

export type SiteContent = {
  trustBadges: string[];
  stats: SiteStat[];
  mentor: MentorProfile;
  testimonials: Testimonial[];
};

export const defaultSiteContent: SiteContent = {
  trustBadges: ["4 AI career tracks", "Weekly mentorship", "Hands-on capstones", "Verified certificates"],
  stats: [
    { label: "Courses available", value: "6" },
    { label: "Mentor touchpoints", value: "Weekly" },
    { label: "Certificate verification", value: "Public" },
    { label: "Average rating", value: "4.9" },
  ],
  mentor: {
    name: "Rajiv Shekar",
    title: "Lead mentor & founder",
    bio: "Rajiv helps learners ship practical AI skills—prompts, RAG apps, agents, and automations—with weekly milestones and mentor review until capstone work holds up in interviews and on the job.",
    email: "rajivshekar@mindfullmethods.com",
    imageUrl: marketingImages.mentorPortrait,
  },
  testimonials: [
    {
      quote:
        "Prompt structure finally clicked. My capstone playbook is something I reuse at work every week.",
      name: "Aarav S.",
      role: "Prompt Engineering",
      rating: 5,
    },
    {
      quote:
        "RAG week was the turning point—I built a doc Q&A demo I could actually show in interviews.",
      name: "Meera K.",
      role: "Generative AI & LLMs",
      rating: 5,
    },
    {
      quote:
        "Agent traces and tool boundaries made our internal pilot safe enough to ship to the team.",
      name: "Jordan P.",
      role: "AI Agents",
      rating: 5,
    },
    {
      quote:
        "I automated lead routing with n8n + an LLM step. Mentor review caught edge cases I would have missed.",
      name: "Samira R.",
      role: "AI Automation",
      rating: 5,
    },
  ],
};

async function readSiteContentRaw(): Promise<SiteContent | null> {
  try {
    const admin = createAdminClient();
    const { data } = await admin.from("platform_settings").select("value").eq("key", "site_content").maybeSingle();
    if (!data?.value || typeof data.value !== "object") return null;
    return data.value as SiteContent;
  } catch {
    return null;
  }
}

function mergeSiteContent(patch: SiteContent | null): SiteContent {
  if (!patch) return defaultSiteContent;
  return {
    trustBadges: patch.trustBadges?.length ? patch.trustBadges : defaultSiteContent.trustBadges,
    stats: patch.stats?.length ? patch.stats : defaultSiteContent.stats,
    mentor: { ...defaultSiteContent.mentor, ...patch.mentor },
    testimonials: patch.testimonials?.length ? patch.testimonials : defaultSiteContent.testimonials,
  };
}

export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const ready = await isPlatformSettingsReady();
  if (!ready) {
    const courseCount = getCourses().length;
    return {
      ...defaultSiteContent,
      stats: defaultSiteContent.stats.map((s) =>
        s.label === "Courses available" ? { ...s, value: String(courseCount) } : s
      ),
    };
  }
  const patch = await readSiteContentRaw();
  const merged = mergeSiteContent(patch);
  const courseCount = getCourses().length;
  return {
    ...merged,
    stats: merged.stats.map((s) =>
      s.label === "Courses available" ? { ...s, value: String(courseCount) } : s
    ),
  };
});
