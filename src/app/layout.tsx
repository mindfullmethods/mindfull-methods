import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import JsonLd from "@/components/marketing/JsonLd";
import { ThemeProvider } from "@/components/components/theme-provider";
import { organizationJsonLd } from "@/lib/seo";
import { pageTitle, siteConfig } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: pageTitle(),
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/brand-assets/logo-icon.png", sizes: "256x256", type: "image/png" },
    ],
    apple: "/brand-assets/logo-icon.png",
    shortcut: "/favicon.png",
  },
  openGraph: {
    title: pageTitle(),
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle(),
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="font-sans antialiased">
        <JsonLd data={organizationJsonLd()} />
        <ThemeProvider>
          {children}
          <Analytics />
          <SpeedInsights />
          <GoogleAnalytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
