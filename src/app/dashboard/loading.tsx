export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] p-8 dark:bg-zinc-950">
      <div className="animate-pulse space-y-8">
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 dark:border-white/10 dark:bg-white/5">
          <div className="h-4 w-32 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-6 h-12 w-80 max-w-full rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-4 h-4 w-full max-w-lg rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-3xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5"
            >
              <div className="h-44 bg-zinc-200 dark:bg-zinc-800" />
              <div className="space-y-4 p-6">
                <div className="h-4 w-24 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-8 w-3/4 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800" />
                <div className="flex gap-3">
                  <div className="h-10 w-28 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-10 w-28 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
