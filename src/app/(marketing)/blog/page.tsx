import Link from "next/link";

import Badge from "@/components/marketing/Badge";
import { getBlogPosts } from "@/lib/blog-posts";
import { marketingPageMetadata } from "@/lib/seo";

export const metadata = marketingPageMetadata({
  path: "/blog",
  title: "Blog",
  description: "Mentorship tips, course guides, and student success stories from Mindfull Methods.",
});

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
      <p className="mm-eyebrow">Blog</p>
      <h1 className="mt-4 text-4xl font-black tracking-tight mm-heading sm:text-5xl">Insights & guides</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 mm-muted">
        Practical articles on choosing tracks, week-one expectations, and getting the most from mentorship.
      </p>

      <section className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article key={post.slug} className="mm-card rounded-3xl p-6">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} tone="neutral">
                  {tag}
                </Badge>
              ))}
            </div>
            <h2 className="mt-4 text-2xl font-black mm-heading">
              <Link href={`/blog/${post.slug}`} className="hover:text-violet-600 dark:hover:text-violet-300">
                {post.title}
              </Link>
            </h2>
            <p className="mt-3 text-sm leading-7 mm-muted">{post.excerpt}</p>
            <p className="mt-5 text-xs font-bold mm-subtle">
              {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(post.publishedAt))}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
