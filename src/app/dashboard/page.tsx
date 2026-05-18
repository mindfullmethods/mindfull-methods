export default function DashboardPage() {
  return (
    <div className="space-y-8">
      
      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        
        <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-lg dark:border-white/10 dark:bg-zinc-900">
          <h2 className="text-sm text-gray-500">
            Active Internships
          </h2>

          <p className="mt-4 text-5xl font-black">
            05
          </p>
        </div>

        <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-lg dark:border-white/10 dark:bg-zinc-900">
          <h2 className="text-sm text-gray-500">
            Certificates
          </h2>

          <p className="mt-4 text-5xl font-black">
            12
          </p>
        </div>

        <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-lg dark:border-white/10 dark:bg-zinc-900">
          <h2 className="text-sm text-gray-500">
            Completed Projects
          </h2>

          <p className="mt-4 text-5xl font-black">
            24
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-lg dark:border-white/10 dark:bg-zinc-900">
        
        <h2 className="text-2xl font-black">
          Recent Activity
        </h2>

        <div className="mt-6 space-y-5">
          
          <div className="rounded-2xl bg-gray-50 p-5 dark:bg-zinc-800">
            Completed Frontend Internship Module
          </div>

          <div className="rounded-2xl bg-gray-50 p-5 dark:bg-zinc-800">
            Certificate Generated Successfully
          </div>

          <div className="rounded-2xl bg-gray-50 p-5 dark:bg-zinc-800">
            New Internship Enrolled
          </div>
        </div>
      </div>
    </div>
  );
}