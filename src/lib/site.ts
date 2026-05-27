export const siteConfig = {
  name: "Mindfull Methods",
  description:
    "Online certification courses and live mentorship training. Build career-ready skills with structured programs and expert guidance.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://mindfull-methods.vercel.app",
  supportEmail: "support@mindfullmethods.com",
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
