import Link from "next/link";

export default function LmsSchemaBanner() {
  return (
    <div className="lms-card mb-6 border-amber-300/40 bg-amber-50 text-amber-950 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-100">
      <p className="text-sm font-bold">LMS database not connected</p>
      <p className="mt-2 text-sm opacity-90">
        Lesson progress, quizzes, and submissions use catalog demo mode. Run{" "}
        <code className="rounded bg-black/10 px-1 dark:bg-white/10">supabase/lms-portal-schema.sql</code> in Supabase,
        then refresh.
      </p>
      <Link href="/dashboard/setup" className="mt-3 inline-block text-sm font-bold text-emerald-700 dark:text-emerald-300">
        Open setup checklist →
      </Link>
    </div>
  );
}
