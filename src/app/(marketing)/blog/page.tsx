import Link from "next/link";

import Badge from "@/components/marketing/Badge";
import MarketingPageHero from "@/components/marketing/MarketingPageHero";
import { getBlogPostsWithOverrides } from "@/lib/platform-content";
import { marketingPageMetadata } from "@/lib/seo";

export const metadata = marketingPageMetadata({
  path: "/blog",
  title: "Blog",
  description: "Mentorship tips, course guides, and student success stories from Mindfull Methods.",
});

export default async function BlogPage() {
  const posts = await getBlogPostsWithOverrides();

  return (
    <>
      <MarketingPageHero
        eyebrow="Blog"
        title="Insights & guides"
        description="Practical articles on choosing tracks, week-one expectations, and getting the most from mentorship."
      />

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.slug} className="mm-card-premium rounded-3xl p-6 transition hover:-translate-y-1">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} tone="neutral">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h2 className="mt-4 text-2xl font-bold mm-heading">
                <Link href={`/blog/${post.slug}`} className="hover:text-violet-600 dark:hover:text-violet-300">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-3 text-sm leading-7 mm-muted">{post.excerpt}</p>
              <p className="mt-5 text-xs font-semibold mm-subtle">
                {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(post.publishedAt))}
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
