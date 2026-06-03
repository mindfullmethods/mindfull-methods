"use server";

import { revalidatePath } from "next/cache";

import { getCourseBySlug } from "@/lib/courses";
import { notifyWaitlistJoined } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase/admin";

export async function joinCourseWaitlistAction(formData: FormData) {
  const courseSlug = String(formData.get("course_slug") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const fullName = String(formData.get("full_name") ?? "").trim();

  if (!courseSlug || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false as const, error: "Enter a valid email to join the waitlist." };
  }

  try {
    const admin = createAdminClient();
    const { error } = await admin.from("course_waitlist").upsert(
      {
        course_slug: courseSlug,
        email,
        full_name: fullName || null,
      },
      { onConflict: "course_slug,email" }
    );

    if (error) {
      if (error.message.includes("course_waitlist")) {
        return {
          ok: false as const,
          error: "Waitlist table missing — run supabase/v2-platform-extensions.sql.",
        };
      }
      return { ok: false as const, error: error.message };
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not save waitlist entry.";
    return { ok: false as const, error: message };
  }

  const course = getCourseBySlug(courseSlug);
  if (course) {
    void notifyWaitlistJoined({
      email,
      fullName: fullName || null,
      courseTitle: course.title,
      courseSlug,
    }).catch((err) => console.error("[joinCourseWaitlist] email", err));
  }

  revalidatePath(`/courses/${courseSlug}`);
  revalidatePath("/dashboard/growth");
  return { ok: true as const };
}
