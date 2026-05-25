import InternshipCard from "@/components/components/dashboard/InternshipCard";
import { getInternships } from "@/Services/Internships";

export default async function InternshipsPage() {

  const internships =
    await getInternships();

  return (
    <main className="min-h-screen bg-white px-6 py-10 dark:bg-black">

      <div className="mx-auto max-w-7xl">

        <div className="mb-14">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
            Explore Opportunities
          </p>

          <h1 className="mt-4 text-5xl font-black text-black dark:text-white">
            Internships
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Discover real-world internships and start building your future.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

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

        </div>

      </div>

    </main>
  );
}