import InternshipCard from "@/components/components/dashboard/InternshipCard";
import { getInternships } from "@/Services/Internships";

export default async function DashboardPage() {
  const internships = await getInternships();

  return (
    <main className="p-8">
      
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tight">
          Explore Internships
        </h1>

        <p className="mt-2 text-gray-500">
          Discover premium opportunities curated for students.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
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