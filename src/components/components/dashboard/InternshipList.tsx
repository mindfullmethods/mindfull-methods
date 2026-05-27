"use client";

import { useState } from "react";
import InternshipCard from "./InternshipCard";

type InternshipListItem = {
  id: string;
  title: string;
  company: string;
  description: string;
  duration: string;
  stipend: string;
  image_url?: string;
};

export default function InternshipList({
  internships,
}: {
  internships: InternshipListItem[];
}) {

  const [search, setSearch] =
    useState("");

  const [selectedCompany, setSelectedCompany] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("Latest");
  
  const [visibleCount, setVisibleCount] =
    useState(6);

  const companies = [
    "All",
    ...new Set(
      internships.map(
        (internship) =>
          internship.company
      )
    ),
  ];

  const filteredInternships =
    internships.filter(
      (internship) => {

        const matchesSearch =
          internship.title
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          internship.company
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesCompany =
          selectedCompany === "All" ||
          internship.company ===
            selectedCompany;

        return (
          matchesSearch &&
          matchesCompany
        );

      }
    );

  const sortedInternships = [
    ...filteredInternships,
  ].sort((a, b) => {

    if (
      sortBy ===
      "Company A-Z"
    ) {

      return a.company.localeCompare(
        b.company
      );

    }

    if (
      sortBy ===
      "Highest Stipend"
    ) {

      return (
        parseInt(
          b.stipend.replace(/\D/g, "")
        ) -
        parseInt(
          a.stipend.replace(/\D/g, "")
        )
      );

    }

    return 0;

  });

  return (
    <div>

      <div className="mb-10 flex flex-col gap-5 lg:flex-row">

        <input
          type="text"
          placeholder="Search internships or companies... "
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="flex-1 rounded-3xl border border-black/10 bg-white/70 px-6 py-5 text-lg text-black placeholder:text-gray-500 outline-none backdrop-blur-xl transition focus:border-black focus:ring-4 focus:ring-black/5 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-400"
        />

        <select
          value={selectedCompany}
          onChange={(e) =>
            setSelectedCompany(
              e.target.value
            )
          }
          className="rounded-3xl border border-black/10 bg-white/70 px-6 py-5 text-lg outline-none backdrop-blur-xl transition focus:border-black focus:ring-4 focus:ring-black/5 dark:border-white/10 dark:bg-white/5 dark:text-white"
        >

          {companies.map((company) => (

            <option
              key={company}
              value={company}
            >
              {company}
            </option>

          ))}

        </select>

        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value)
          }
          className="rounded-3xl border border-black/10 bg-white/70 px-6 py-5 text-lg outline-none backdrop-blur-xl transition focus:border-black focus:ring-4 focus:ring-black/5 dark:border-white/10 dark:bg-white/5 dark:text-white"
        >

          <option>
            Latest
          </option>

          <option>
            Highest Stipend
          </option>

          <option>
            Company A-Z
          </option>

        </select>

      </div>

      <div className="grid gap-10 sm:grid-cols-2 2xl:grid-cols-3">

        {sortedInternships.slice(0, visibleCount).map(
          (internship) => (
            <InternshipCard
              key={internship.id}
              id={internship.id}
              title={internship.title}
              company={internship.company}
              description={
                internship.description
              }
              duration={
                internship.duration
              }
              stipend={
                internship.stipend
              }
              image={
                internship.image_url ||
                "https://images.unsplash.com/photo-1497366754035-f200968a6e72"
              }
            />
          )
        )}

      </div>
      {visibleCount <
  sortedInternships.length && (

  <div className="mt-14 flex justify-center">

    <button
      onClick={() =>
        setVisibleCount(
          visibleCount + 6
        )
      }
      className="rounded-3xl bg-black px-8 py-5 text-lg font-semibold text-white shadow-2xl transition duration-300 hover:scale-[1.02] hover:shadow-black/30 dark:bg-white dark:text-black"
    >
      Load More
    </button>

  </div>

)}

    </div>
  );
}