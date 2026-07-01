export const siteConfig = {
  name: "Mindfull Methods",
  description:
    "AI certification courses with live mentorship—Generative AI, agents, prompt engineering, and automation. Build job-ready skills with structured programs.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mindfullmethods.com",
  supportEmail: "rajivshekar@mindfullmethods.com",
  ogImage: "/brand-assets/logo-full.png",
};

export function pageTitle(title?: string) {
  return title ? `${title} | ${siteConfig.name}` : siteConfig.name;
}

export function signupUrl(courseSlug?: string) {
  if (!courseSlug) return "/signup";
  return `/signup?course=${encodeURIComponent(courseSlug)}`;
}

export function contactUrl(courseSlug?: string) {
  if (!courseSlug) return "/contact";
  return `/contact?course=${encodeURIComponent(courseSlug)}`;
}

export function syllabusUrl(courseSlug: string) {
  return `/api/syllabus/${encodeURIComponent(courseSlug)}`;
}

export function syllabusPrintUrl(courseSlug: string) {
  return `/courses/${encodeURIComponent(courseSlug)}/syllabus`;
}

export function syllabusPdfUrl(courseSlug: string) {
  return `/syllabi/${encodeURIComponent(courseSlug)}.pdf`;
}
