/** Central image paths — replace files in /public/images to update site-wide visuals. */
export const marketingImages = {
  hero: "/images/marketing/hero.jpg",
  authCollaboration: "/images/marketing/auth-collaboration.jpg",
  authDashboard: "/images/marketing/auth-dashboard.jpg",
  dashboardPreview: "/images/marketing/dashboard-preview.jpg",
  internshipFallback: "/images/marketing/internship-fallback.jpg",
} as const;

export const courseImages: Record<string, string> = {
  "frontend-engineering": "/images/courses/frontend-engineering.jpg",
  "product-design": "/images/courses/product-design.jpg",
  "data-analytics": "/images/courses/data-analytics.jpg",
  "full-stack-development": "/images/courses/full-stack-development.jpg",
  "digital-marketing": "/images/courses/digital-marketing.jpg",
  "machine-learning": "/images/courses/machine-learning.jpg",
};

export function getCourseImage(slug: string) {
  return courseImages[slug] ?? marketingImages.internshipFallback;
}
