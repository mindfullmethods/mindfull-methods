import { createAdminClient } from "@/lib/supabase/admin";

export type WaitlistRow = {
  id: string;
  course_slug: string;
  email: string;
  full_name: string | null;
  created_at: string;
};

export type NewsletterRow = {
  id: string;
  email: string;
  source: string | null;
  created_at: string;
};

export type GrowthSummary = {
  waitlistTotal: number;
  waitlistByCourse: { course_slug: string; count: number }[];
  newsletterTotal: number;
  openCheckouts: number;
  completedCheckoutsLast7d: number;
  waitlist: WaitlistRow[];
  newsletter: NewsletterRow[];
  tableReady: boolean;
};

export async function getGrowthSummary(courseFilter?: string): Promise<GrowthSummary> {
  const empty: GrowthSummary = {
    waitlistTotal: 0,
    waitlistByCourse: [],
    newsletterTotal: 0,
    openCheckouts: 0,
    completedCheckoutsLast7d: 0,
    waitlist: [],
    newsletter: [],
    tableReady: false,
  };

  try {
    const admin = createAdminClient();
    const probe = await admin.from("course_waitlist").select("id").limit(1);
    if (probe.error) return empty;

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    let waitlistQuery = admin
      .from("course_waitlist")
      .select("id, course_slug, email, full_name, created_at")
      .order("created_at", { ascending: false })
      .limit(100);

    if (courseFilter?.trim()) {
      waitlistQuery = waitlistQuery.eq("course_slug", courseFilter.trim());
    }

    const [
      { data: waitlist },
      { count: waitlistTotal },
      { data: newsletter },
      { count: newsletterTotal },
      { count: openCheckouts },
      { count: completedCheckoutsLast7d },
    ] = await Promise.all([
      waitlistQuery,
      admin.from("course_waitlist").select("id", { count: "exact", head: true }),
      admin
        .from("newsletter_subscribers")
        .select("id, email, source, created_at")
        .order("created_at", { ascending: false })
        .limit(100),
      admin.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
      admin
        .from("checkout_intents")
        .select("id", { count: "exact", head: true })
        .eq("completed", false),
      admin
        .from("checkout_intents")
        .select("id", { count: "exact", head: true })
        .eq("completed", true)
        .gte("created_at", sevenDaysAgo),
    ]);

    const { data: slugRows } = await admin.from("course_waitlist").select("course_slug");
    const counts = new Map<string, number>();
    for (const row of slugRows ?? []) {
      const slug = row.course_slug as string;
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
    const waitlistByCourse = [...counts.entries()]
      .map(([course_slug, count]) => ({ course_slug, count }))
      .sort((a, b) => b.count - a.count);

    return {
      waitlistTotal: waitlistTotal ?? 0,
      waitlistByCourse,
      newsletterTotal: newsletterTotal ?? 0,
      openCheckouts: openCheckouts ?? 0,
      completedCheckoutsLast7d: completedCheckoutsLast7d ?? 0,
      waitlist: (waitlist ?? []) as WaitlistRow[],
      newsletter: (newsletter ?? []) as NewsletterRow[],
      tableReady: true,
    };
  } catch {
    return empty;
  }
}
