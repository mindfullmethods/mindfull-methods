import { Sparkles } from "lucide-react";

import AdminContentPanel from "@/components/components/dashboard/AdminContentPanel";
import DashboardPageHeader from "@/components/components/dashboard/DashboardPageHeader";
import { requireAdmin } from "@/lib/auth";
import { getBlogPosts } from "@/lib/blog-posts";
import { getCourses } from "@/lib/courses";
import {
  getBlogPostsWithOverrides,
  getCourseOverrides,
  getCustomCourses,
  getCoursesWithOverrides,
  isPlatformSettingsReady,
} from "@/lib/platform-content";

export default async function AdminContentPage() {
  await requireAdmin();

  const tableReady = await isPlatformSettingsReady();
  const courses = tableReady ? await getCoursesWithOverrides() : getCourses();
  const customCourses = tableReady ? await getCustomCourses() : [];
  const blogPosts = tableReady ? await getBlogPostsWithOverrides() : getBlogPosts();
  const courseOverrides = tableReady ? await getCourseOverrides() : {};

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <DashboardPageHeader
        eyebrow="Content studio"
        title="Courses & blog CMS"
        description="Edit courses and blog posts without redeploying code — including new courses, pricing, curriculum, and posts. Requires supabase/content-cms-schema.sql."
      >
        {!tableReady ? (
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200">
            Run supabase/content-cms-schema.sql — edits will save once the platform_settings table exists.
          </p>
        ) : (
          <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            <Sparkles size={14} />
            CMS connected — changes apply on the marketing site immediately.
          </p>
        )}
      </DashboardPageHeader>

      <div className="mt-8">
        <AdminContentPanel
          courses={courses}
          customCourses={customCourses}
          courseOverrides={courseOverrides}
          blogPosts={blogPosts}
          tableReady={tableReady}
        />
      </div>
    </main>
  );
}
