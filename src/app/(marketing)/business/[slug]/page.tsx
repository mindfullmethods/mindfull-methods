import type { Metadata } from "next";
import { notFound } from "next/navigation";

import BusinessServiceDetail from "@/components/marketing/BusinessServiceDetail";
import HomeLandingWrapper from "@/components/marketing/home/HomeLandingWrapper";
import { businessServices, getBusinessService } from "@/lib/business-services";
import { marketingPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return businessServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getBusinessService(slug);
  if (!service) return {};
  return marketingPageMetadata({
    path: `/business/${service.slug}`,
    title: service.card.title,
    description: service.metaDescription,
  });
}

export default async function BusinessServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getBusinessService(slug);
  if (!service) notFound();

  return (
    <HomeLandingWrapper>
      <BusinessServiceDetail service={service} />
    </HomeLandingWrapper>
  );
}
