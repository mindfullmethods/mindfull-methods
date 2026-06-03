/** Central image paths — replace files in /public/images to update site-wide visuals. */
export const marketingImages = {
  hero: "/images/marketing/hero.jpg",
  authCollaboration: "/images/marketing/auth-collaboration.jpg",
  authDashboard: "/images/marketing/auth-dashboard.jpg",
  dashboardPreview: "/images/marketing/dashboard-preview.jpg",
  internshipFallback: "/images/marketing/internship-fallback.jpg",
  /** Replace `public/images/marketing/mentor-rajiv.jpg` with a square portrait (~800×800). */
  mentorPortrait: "/images/marketing/mentor-rajiv.jpg",
} as const;

/** Preferred slug-named assets in `public/images/courses/` (replace with AI art when ready). */
export const courseImages: Record<string, string> = {
  "prompt-engineering": "/images/courses/prompt-engineering.jpg",
  "generative-ai-llms": "/images/courses/generative-ai-llms.jpg",
  "ai-agents": "/images/courses/ai-agents.jpg",
  "ai-automation": "/images/courses/ai-automation.jpg",
};

/** Legacy filenames shipped in the repo — used when slug-named files are missing. */
const courseImageLegacyFallback: Record<string, string> = {
  "prompt-engineering": "/images/courses/machine-learning.jpg",
  "generative-ai-llms": "/images/courses/data-analytics.jpg",
  "ai-agents": "/images/courses/full-stack-development.jpg",
  "ai-automation": "/images/courses/digital-marketing.jpg",
};

export function getCourseImage(slug: string) {
  return (
    courseImages[slug] ??
    courseImageLegacyFallback[slug] ??
    marketingImages.internshipFallback
  );
}

export function getCourseImageFallback(slug: string) {
  return courseImageLegacyFallback[slug] ?? marketingImages.internshipFallback;
}
