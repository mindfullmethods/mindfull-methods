import { Search, SlidersHorizontal } from "lucide-react";
import InternshipCard from "@/components/components/dashboard/InternshipCard";
import { getInternships } from "@/Services/Internships";

export default async function InternshipsPage() {
  const internships = await getInternships();

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <section className="rounded-3xl bg-zinc-950 p-6 text-white shadow-xl sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-white/50">Explore Opportunities</p>
        <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">Find internships built around real project outcomes.</h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              Browse active programs, compare companies, and apply to tracks that match your skills and availability.
            </p>
          </div>
          <div className="rounded-2xl bg-white px-6 py-4 text-zinc-950">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Active roles</p>
            <p className="mt-1 text-4xl font-black">{internships.length}</p>
          </div>
        </div>
      </section>

      <section className="mt-6 flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-white/5 md:flex-row">
        <div className="flex flex-1 items-center gap-3 rounded-xl bg-[#f7f8f5] px-4 py-3 dark:bg-zinc-950">
          <Search size={18} className="text-zinc-500" />
          <span className="text-sm font-bold text-zinc-500">Search and filters can connect here next</span>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-black text-white dark:bg-white dark:text-zinc-950">
          <SlidersHorizontal size={18} />
          Filters
        </button>
      </section>

      {internships.length === 0 ? (
        <section className="mt-8 rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-white/10 dark:bg-white/5">
          <h2 className="text-3xl font-black">No internships published yet</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-500">
            Once the admin creates internship opportunities, they will appear here for students to review and apply.
          </p>
        </section>
      ) : (
        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {internships.map((internship: any) => (
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
        </section>
      )}
    </main>
  );
}
