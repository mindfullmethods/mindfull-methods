import Link from "next/link";
import { notFound } from "next/navigation";

import Badge from "@/components/marketing/Badge";
import Button from "@/components/marketing/Button";
import MarketingPageHero from "@/components/marketing/MarketingPageHero";
import { getBlogPostWithOverrides } from "@/lib/platform-content";
import { getBlogSlugs } from "@/lib/blog-posts";
import { marketingPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostWithOverrides(slug);
  if (!post) return { title: "Post not found" };

  return marketingPageMetadata({
    path: `/blog/${slug}`,
    title: post.title,
    description: post.excerpt,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostWithOverrides(slug);
  if (!post) notFound();

  return (
    <>
      <MarketingPageHero
        eyebrow="Blog"
        title={post.title}
        description={`${post.author} · ${new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(new Date(post.publishedAt))}`}
      >
        <div className="mt-6 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} tone="neutral">
              {tag}
            </Badge>
          ))}
        </div>
        <Link
          href="/blog"
          className="mt-6 inline-block text-sm font-semibold text-violet-600 hover:underline dark:text-violet-300"
        >
          ← Back to blog
        </Link>
      </MarketingPageHero>

      <article className="mx-auto max-w-3xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="prose prose-zinc dark:prose-invert max-w-none whitespace-pre-wrap text-[15px] leading-8 mm-muted">
          {post.content}
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          <Button href="/courses" variant="gradient">
            Browse courses
          </Button>
          <Button href="/contact" variant="secondary">
            Book a free call
          </Button>
        </div>
      </article>
    </>
  );
}
