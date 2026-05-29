"use client";

import { useMemo, useState } from "react";
import { ArrowDownAZ, Building2, ChevronDown, Search, Sparkles, TrendingUp } from "lucide-react";

import InternshipCard from "@/components/components/dashboard/InternshipCard";
import { marketingImages } from "@/lib/images";

type InternshipListItem = {
  id: string;
  title: string;
  company: string;
  description: string;
  duration: string;
  stipend: string;
  image_url?: string;
};

const sortOptions = ["Latest", "Highest Stipend", "Company A-Z"] as const;
type SortOption = (typeof sortOptions)[number];

export default function InternshipCatalog({ internships }: { internships: InternshipListItem[] }) {
  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("Latest");

  const companies = useMemo(
    () => ["All", ...new Set(internships.map((internship) => internship.company))],
    [internships]
  );

  const filtered = useMemo(() => {
    const matches = internships.filter((internship) => {
      const query = search.toLowerCase();
      const matchesSearch =
        internship.title.toLowerCase().includes(query) ||
        internship.company.toLowerCase().includes(query) ||
        internship.description.toLowerCase().includes(query);
      const matchesCompany = selectedCompany === "All" || internship.company === selectedCompany;
      return matchesSearch && matchesCompany;
    });

    return [...matches].sort((a, b) => {
      if (sortBy === "Company A-Z") return a.company.localeCompare(b.company);
      if (sortBy === "Highest Stipend") {
        return parseInt(b.stipend.replace(/\D/g, ""), 10) - parseInt(a.stipend.replace(/\D/g, ""), 10);
      }
      return 0;
    });
  }, [internships, search, selectedCompany, sortBy]);

  const hasFilters = search.length > 0 || selectedCompany !== "All";

  function clearFilters() {
    setSearch("");
    setSelectedCompany("All");
    setSortBy("Latest");
  }

  return (
    <>
      <section className="relative z-10 -mt-6 mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-[1.75rem] border border-zinc-200/80 bg-white/95 p-5 shadow-xl shadow-zinc-950/5 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/95 dark:shadow-black/30 sm:p-6">
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-36 w-36 rounded-full bg-teal-400/10 blur-3xl" />

          <div className="relative flex flex-col gap-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative flex flex-1 items-center gap-3 rounded-2xl border border-zinc-200/80 bg-[#f7f8f5] px-4 py-3.5 transition focus-within:border-violet-400/40 focus-within:ring-4 focus-within:ring-violet-500/10 dark:border-white/10 dark:bg-zinc-950">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25">
                  <Search size={18} />
                </span>
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title, company, or description…"
                  className="w-full bg-transparent text-sm font-bold text-zinc-950 outline-none placeholder:font-semibold placeholder:text-zinc-400 dark:text-white dark:placeholder:text-zinc-500"
                />
              </div>

              <div className="relative min-w-[200px]">
                <Building2
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-zinc-400"
                />
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 z-10 -translate-y-1/2 text-zinc-400"
                />
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-zinc-200/80 bg-[#f7f8f5] py-3.5 pl-11 pr-10 text-sm font-black text-zinc-950 outline-none transition hover:border-violet-300/50 focus:border-violet-400/40 focus:ring-4 focus:ring-violet-500/10 dark:border-white/10 dark:bg-zinc-950 dark:text-white"
                >
                  {companies.map((company) => (
                    <option key={company} value={company} className="bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white">
                      {company === "All" ? "All companies" : company}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-zinc-200/80 pt-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
                <Sparkles size={14} className="text-violet-500" />
                Sort by
              </div>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map((option) => {
                  const active = sortBy === option;
                  const Icon = option === "Highest Stipend" ? TrendingUp : option === "Company A-Z" ? ArrowDownAZ : Sparkles;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSortBy(option)}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-black transition ${
                        active
                          ? "bg-zinc-950 text-white shadow-lg shadow-zinc-950/20 dark:bg-white dark:text-zinc-950"
                          : "border border-zinc-200 bg-white text-zinc-600 hover:border-violet-300/50 hover:text-zinc-950 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-violet-400/30 dark:hover:text-white"
                      }`}
                    >
                      <Icon size={14} />
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold text-zinc-500">
          Showing{" "}
          <span className="font-black text-zinc-950 dark:text-white">{filtered.length}</span> of{" "}
          <span className="font-black text-zinc-950 dark:text-white">{internships.length}</span> internships
        </p>
        {hasFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-black text-zinc-600 transition hover:border-violet-300 hover:text-violet-700 dark:border-white/10 dark:text-zinc-300 dark:hover:text-violet-300"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <section className="mt-6 overflow-hidden rounded-3xl border border-dashed border-zinc-300 bg-gradient-to-br from-white to-[#f7f8f5] p-12 text-center dark:border-white/10 dark:from-white/5 dark:to-zinc-950">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
            <Search size={24} />
          </div>
          <h2 className="mt-5 text-2xl font-black">No internships match</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500">
            Try another keyword or reset filters to browse all active roles.
          </p>
          {hasFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 inline-flex rounded-xl bg-zinc-950 px-5 py-3 text-sm font-black text-white dark:bg-white dark:text-zinc-950"
            >
              Reset filters
            </button>
          ) : null}
        </section>
      ) : (
        <section className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((internship) => (
            <InternshipCard
              key={internship.id}
              id={internship.id}
              title={internship.title}
              company={internship.company}
              description={internship.description}
              duration={internship.duration}
              stipend={internship.stipend}
              image={internship.image_url || marketingImages.internshipFallback}
            />
          ))}
        </section>
      )}
    </>
  );
}
