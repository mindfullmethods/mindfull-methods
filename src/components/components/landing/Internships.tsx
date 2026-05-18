const internships = [
  {
    title: "Frontend Development",
    description:
      "Master React, Next.js and Tailwind CSS with real-world projects.",
    level: "Beginner to Advanced",
  },
  {
    title: "UI/UX Design",
    description:
      "Design premium digital experiences using modern UI systems.",
    level: "Intermediate",
  },
  {
    title: "Data Science",
    description:
      "Work on machine learning, AI models and data analytics projects.",
    level: "Advanced",
  },
];

export default function Internships() {
  return (
    <section className="bg-gray-50 py-28 transition-colors dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Section Header */}
        <div className="mb-16 text-center">
          <span className="rounded-full border bg-white px-4 py-2 text-sm font-medium shadow-sm">
            Popular Programs
          </span>

          <h2 className="mt-6 text-4xl font-black tracking-tight md:text-6xl">
            Explore Top Internships
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Practical learning experiences designed for ambitious students.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {internships.map((item) => (
            <div
              key={item.title}
              className="group overflow-hidden rounded-3xl border border-black/5 bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              
              {/* Card Image */}
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="absolute inset-0 bg-black/5 opacity-0 transition group-hover:opacity-100" />
              </div>

              {/* Card Content */}
              <div className="p-8">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
                  {item.level}
                </span>

                <h3 className="mt-5 text-2xl font-bold">
                  {item.title}
                </h3>

                <p className="mt-4 leading-relaxed text-gray-600">
                  {item.description}
                </p>

                <button className="mt-8 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}