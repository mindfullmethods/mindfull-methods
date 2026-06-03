import Link from "next/link";
import { Bell } from "lucide-react";

import DashboardPageHeader from "@/components/components/dashboard/DashboardPageHeader";
import { getMyWaitlistEntries } from "@/Services/my-waitlist";
import { getSessionUser, requireUser } from "@/lib/auth";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default async function MyWaitlistPage() {
  await requireUser("/dashboard/my-waitlist");
  const user = await getSessionUser();
  const entries = await getMyWaitlistEntries(user?.email);

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <DashboardPageHeader
        eyebrow="Courses"
        title="My waitlist"
        description="Courses you've asked to be notified about when enrollment opens."
      />

      <section className="mt-8 mm-section-panel">
        {!entries.length ? (
          <div className="text-center py-8">
            <Bell size={32} className="mx-auto text-zinc-400" />
            <p className="mt-4 text-sm text-zinc-500">You're not on any course waitlists yet.</p>
            <Link
              href="/courses"
              className="mt-4 inline-block text-sm font-bold text-violet-600 dark:text-violet-300"
            >
              Browse courses →
            </Link>
          </div>
        ) : (
          <ul className="divide-y mm-border">
            {entries.map((entry) => (
              <li key={entry.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div>
                  <p className="font-bold mm-heading">{entry.courseTitle}</p>
                  <p className="text-sm text-zinc-500">Joined {formatDate(entry.createdAt)}</p>
                </div>
                <Link
                  href={`/courses/${entry.courseSlug}`}
                  className="rounded-xl border mm-border px-4 py-2 text-sm font-bold mm-heading"
                >
                  View course
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
