import { Sparkles } from "lucide-react";

import AdminContentPanel from "@/components/components/dashboard/AdminContentPanel";
import { requireAdmin } from "@/lib/auth";
import { getBlogPosts } from "@/lib/blog-posts";
import { getCourses } from "@/lib/courses";
import { getBlogPostsWithOverrides, getCourseOverrides, getCustomCourses, getCoursesWithOverrides, isPlatformSettingsReady } from "@/lib/platform-content";

export default async function AdminContentPage() {
  await requireAdmin();

  const tableReady = await isPlatformSettingsReady();
  const courses = tableReady ? await getCoursesWithOverrides() : getCourses();
  const customCourses = tableReady ? await getCustomCourses() : [];
  const blogPosts = tableReady ? await getBlogPostsWithOverrides() : getBlogPosts();
  const courseOverrides = tableReady ? await getCourseOverrides() : {};

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
        <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.28em] text-zinc-500">
          <Sparkles size={16} />
          Content studio
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Courses & blog CMS</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          Edit courses and blog posts without redeploying code — including new courses, pricing, curriculum, and posts.
          Requires{" "}
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">supabase/content-cms-schema.sql</code>.
        </p>
        {!tableReady ? (
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200">
            Run supabase/content-cms-schema.sql — edits will save once the platform_settings table exists.
          </p>
        ) : null}
      </section>

      <AdminContentPanel
        courses={courses}
        customCourses={customCourses}
        courseOverrides={courseOverrides}
        blogPosts={blogPosts}
        tableReady={tableReady}
      />
    </main>
  );
}
