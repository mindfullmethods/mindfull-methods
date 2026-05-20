import InternshipCard from "@/components/components/dashboard/InternshipCard";
import { getInternships } from "@/Services/Internships";
import ModeToggle from "@/components/components/mode-toggle";

export default async function DashboardPage() {
  const internships = await getInternships();

  return (
  <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-12 py-10 transition-colors duration-500 dark:from-black dark:via-zinc-950 dark:to-zinc-900">

    <div className="mb-14 flex items-end justify-between gap-6">

      <div>

        

        
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
            Mindfull Methods Platform
          </p>

          <h1 className="text-6xl font-black tracking-tight text-black dark:text-white">
             Explore{" "}
             <span className="ml-4 bg-gradient-to-r from-zinc-900 to-gray-500 bg-clip-text text-transparent dark:from-white dark:to-gray-400">
                  Internships
            </span>
          </h1>
        

        <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-500 dark:text-gray-400">
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

    <div className="mb-14 grid gap-8 md:grid-cols-3">

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
    <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">

      {internships.map((internship) => (
        <InternshipCard
          key={internship.id}
          id={internship.id}
          title={internship.title}
          company={internship.company}
          description={internship.description}
          duration={internship.duration}
          stipend={internship.stipend}
          image={internship.image_url}
        />
      ))}

    </div>

  </main>
);
}