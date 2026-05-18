const internships = [
  {
    title: "Frontend Development",
    description: "Learn React, Next.js, and Tailwind CSS.",
  },
  {
    title: "UI/UX Design",
    description: "Master Figma and modern design systems.",
  },
  {
    title: "Data Science",
    description: "Work with Python and machine learning.",
  },
];

export default function Internships() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-12 text-center">
        <h2 className="text-5xl font-bold tracking-tight">
          Popular Internships
        </h2>

        <p className="mt-4 text-gray-600">
          Explore our most in-demand internship programs.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {internships.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border p-6 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mb-4 h-40 rounded-xl bg-gray-100"></div>

            <h3 className="text-2xl font-semibold">
              {item.title}
            </h3>

            <p className="mt-3 text-gray-600">
              {item.description}
            </p>

            <button className="mt-6 rounded-lg bg-black px-5 py-2 text-white">
              Learn More
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}