import AnalyticsChart from "@/components/components/dashboard/AnalyticsChart";
import { getMyApplications } from "@/Services/applications";
import InternshipCard from "@/components/components/dashboard/InternshipCard";
import InternshipList from "@/components/components/dashboard/InternshipList";
import { getInternships } from "@/Services/Internships";
import ModeToggle from "@/components/components/mode-toggle";

export default async function DashboardPage() {

  const internships =
    await getInternships();

  const applications =
  await getMyApplications();

  return (
  <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-24 px-5 py-8 sm:px-8 xl:px-12 lg:pt-10 transition-colors duration-500 dark:from-black dark:via-zinc-950 dark:to-zinc-900">

    <div className="mb-14 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">

      <div>

        

        
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
            Mindfull Methods Platform
          </p>

          <h1 className="text-6xl font-black tracking-tight text-black dark:text-white sm:text-5xl xl:text-6xl">
             Explore{" "}
             <span className="ml-4 bg-gradient-to-r from-zinc-900 to-gray-500 bg-clip-text text-transparent dark:from-white dark:to-gray-400">
                  Internships
            </span>
          </h1>
        

        <p className="mt-6 max-w-2xl text-base sm:text-lg leading-8 text-gray-500 dark:text-gray-400">
          Discover curated premium internship
          opportunities from top companies
          around the world.
        </p>

      </div>

      <div className="hidden items-center gap-5 lg:flex">

  <ModeToggle />

  <div className="rounded-[28px] border border-white/20 bg-white/60 px-8 py-6 shadow-xl backdrop-blur-xl dark:bg-zinc-900">

    <p className="text-sm font-medium text-gray-400">
      Total Opportunities
    </p>

    <h2 className="mt-2 text-5xl font-black text-black dark:text-white">
      {internships.length}
    </h2>

  </div>

</div>

    </div>

    <div className="mb-14 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">

  <div className="rounded-[32px] border border-white/20 bg-gradient-to-br from-black to-gray-800 p-8 text-white shadow-2xl">

    <p className="text-sm uppercase tracking-[0.3em] text-gray-400">
      Total Internships
    </p>

    <h2 className="mt-4 text-6xl font-black text-black dark:text-white">
      {internships.length}
    </h2>

    <p className="mt-4 text-sm leading-7 text-gray-300">
      Premium internship opportunities
      available on the platform.
    </p>

  </div>

  <div className="rounded-[32px] border border-white/20 bg-white/70 p-8 shadow-2xl backdrop-blur-xl transition duration-500 dark:border-white/10 dark:bg-white/5">

    <p className="text-sm uppercase tracking-[0.3em] text-gray-400">
      Platform Status
    </p>

    <h2 className="mt-4 text-5xl font-black">
      Live
    </h2>

    <p className="mt-4 text-sm leading-7 text-gray-500 dark:text-gray-400">
      Real-time applications and
      internship management system.
    </p>

  </div>

  <div className="rounded-[32px] border border-white/20 bg-gradient-to-br from-gray-100 to-white p-8 shadow-2xl transition duration-500 dark:border-white/10 dark:from-zinc-900 dark:to-black">

    <p className="text-sm uppercase tracking-[0.3em] text-gray-400">
      User Experience
    </p>

    <h2 className="mt-4 text-5xl font-black text-black dark:text-white">
      Premium
    </h2>

    <p className="mt-4 text-sm leading-7 text-gray-500 dark:text-gray-400">
      Modern SaaS dashboard with
      dynamic user flows.
    </p>

  </div>

</div>
    
      <InternshipList
        internships={internships}
      />

      <div className="mt-16 grid gap-8 xl:grid-cols-[1.5fr_1fr]">

  <div className="rounded-[32px] border border-white/20 bg-white/70 p-8 shadow-2xl backdrop-blur-xl transition duration-500 dark:border-white/10 dark:bg-white/5">

    <div className="flex items-center justify-between">

      <div>

        <p className="text-sm uppercase tracking-[0.3em] text-gray-400">
          Recent Activity
        </p>

        <h2 className="mt-3 text-3xl font-black text-black dark:text-white">
          Latest Applications
        </h2>

      </div>

      <div className="rounded-2xl bg-black px-5 py-3 text-white dark:bg-white dark:text-black">
        {applications.length}
      </div>

    </div>

    <div className="mt-8 space-y-5">

      {applications.slice(0, 5).map((application: any, index: number) => (

        <div
          key={application.id}
          className="flex items-center justify-between rounded-2xl border border-black/5 bg-black/[0.02] p-5 transition duration-300 dark:border-white/10 dark:bg-white/[0.03]"
        >

          <div>

            <h3 className="text-lg font-bold text-black dark:text-white">
              Application #{index + 1}
            </h3>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Internship application submitted
            </p>

          </div>

          <div className="rounded-xl bg-green-100 px-4 py-2 text-sm font-semibold text-green-600 dark:bg-green-500/10 dark:text-green-400">
            Active
          </div>

        </div>

      ))}

    </div>

  </div>

  <div className="rounded-[32px] border border-white/20 bg-gradient-to-br from-black to-gray-800 p-8 text-white shadow-2xl">

    <p className="text-sm uppercase tracking-[0.3em] text-gray-400">
      Platform Insights
    </p>

    <h2 className="mt-4 text-5xl font-black">
      Growth 🚀
    </h2>

    <p className="mt-6 text-sm leading-8 text-gray-300">
      Your platform now supports
      responsive dashboards,
      real-time applications,
      authentication flows,
      and premium SaaS UI patterns.
    </p>

    <div className="mt-10 space-y-4">

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">
          Dashboard UI
        </span>

        <span className="font-bold">
          95%
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-[95%] rounded-full bg-white" />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">
          Backend Integration
        </span>

        <span className="font-bold">
          90%
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-[90%] rounded-full bg-white" />
      </div>

    </div>

  </div>

</div>
<div className="mt-16 rounded-[32px] border border-white/20 bg-white/70 p-8 shadow-2xl backdrop-blur-xl transition duration-500 dark:border-white/10 dark:bg-white/5">

  <div className="mb-10 flex items-center justify-between">

    <div>

      <p className="text-sm uppercase tracking-[0.3em] text-gray-400">
        Analytics Overview
      </p>

      <h2 className="mt-3 text-3xl font-black text-black dark:text-white">
        Weekly Applications
      </h2>

    </div>

    <div className="rounded-2xl bg-black px-5 py-3 text-white dark:bg-white dark:text-black">
      Live Data
    </div>

  </div>

  <AnalyticsChart />

</div>



  </main>
);
}