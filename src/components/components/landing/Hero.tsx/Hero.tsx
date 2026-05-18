export default function Hero() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center">
      <h1 className="max-w-4xl text-5xl font-bold leading-tight">
        Build Your Career With Industry Ready Internships
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-gray-600">
        Learn real-world skills, work on projects, and get certified with
        expert-led internship programs.
      </p>

      <div className="mt-8 flex gap-4">
        <button className="rounded-lg bg-black px-6 py-3 text-white">
          Explore Programs
        </button>

        <button className="rounded-lg border px-6 py-3">
          Learn More
        </button>
      </div>
    </section>
  );
}