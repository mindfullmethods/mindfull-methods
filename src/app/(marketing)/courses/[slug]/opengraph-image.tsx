import { ImageResponse } from "next/og";

import { getCourseBySlug } from "@/lib/courses";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  const title = course?.title ?? "Mindfull Methods Course";
  const subtitle = course?.shortDescription ?? "Structured mentorship programs";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 64,
          background: "linear-gradient(135deg, #18181b 0%, #4c1d95 45%, #0f766e 100%)",
          color: "white",
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 700, opacity: 0.85 }}>Mindfull Methods</div>
        <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1.05, marginTop: 16 }}>{title}</div>
        <div style={{ fontSize: 28, marginTop: 20, maxWidth: 900, opacity: 0.9 }}>{subtitle}</div>
      </div>
    ),
    { ...size }
  );
}
