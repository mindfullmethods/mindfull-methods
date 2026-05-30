import type { Metadata } from "next";

import { pageTitle, siteConfig } from "@/lib/site";

export function absoluteUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalized}`;
}

export function marketingPageMetadata({
  path,
  title,
  description,
}: {
  path: string;
  title?: string;
  description?: string;
}): Metadata {
  const url = absoluteUrl(path);

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: { canonical: path },
    openGraph: {
      ...(title ? { title: pageTitle(title) } : {}),
      ...(description ? { description } : {}),
      url,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      ...(title ? { title: pageTitle(title) } : {}),
      ...(description ? { description } : {}),
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/brand-assets/logo-full.png"),
    email: siteConfig.supportEmail,
    description: siteConfig.description,
  };
}

export function courseJsonLd(course: {
  slug: string;
  title: string;
  shortDescription: string;
  level: string;
  duration: string;
  mode: string;
  priceInPaise: number;
  priceLabel: string;
  imageUrl: string;
  faqs: { question: string; answer: string }[];
}) {
  const courseUrl = absoluteUrl(`/courses/${course.slug}`);

  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: "Courses", item: absoluteUrl("/courses") },
        { "@type": "ListItem", position: 3, name: course.title, item: courseUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Course",
      name: course.title,
      description: course.shortDescription,
      url: courseUrl,
      image: course.imageUrl,
      provider: {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
      },
      educationalLevel: course.level,
      timeRequired: course.duration,
      courseMode: course.mode,
      offers: {
        "@type": "Offer",
        price: (course.priceInPaise / 100).toFixed(0),
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: courseUrl,
        description: course.priceLabel,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: course.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ];
}
