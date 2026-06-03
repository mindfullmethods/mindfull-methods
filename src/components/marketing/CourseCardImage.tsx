"use client";

import { useState } from "react";

import { getCourseImageFallback, marketingImages } from "@/lib/images";

export default function CourseCardImage({
  src,
  slug,
  alt,
  className,
}: {
  src: string;
  slug: string;
  alt: string;
  className?: string;
}) {
  const [url, setUrl] = useState(src);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt}
      className={className}
      onError={() => {
        const fallback = getCourseImageFallback(slug);
        if (url !== fallback) setUrl(fallback);
        else if (url !== marketingImages.internshipFallback) setUrl(marketingImages.internshipFallback);
      }}
    />
  );
}
