const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Frontend Developer Intern",
    review:
      "The internship experience was incredible. I worked on real projects and improved my skills massively.",
  },
  {
    name: "Priya Reddy",
    role: "UI/UX Design Intern",
    review:
      "One of the best learning experiences I’ve had. The mentorship and projects were extremely practical.",
  },
  {
    name: "Arjun Patel",
    role: "Data Science Intern",
    review:
      "The platform helped me gain confidence and build strong real-world project experience.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-gray-50 py-28">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Header */}
        <div className="text-center">
          <span className="rounded-full border bg-white px-4 py-2 text-sm font-medium shadow-sm">
            Testimonials
          </span>

          <h2 className="mt-6 text-4xl font-black tracking-tight md:text-6xl">
            What Students Say
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Hear from students who transformed their careers through our internship programs.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-20 grid gap-8 md:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="rounded-3xl border border-black/5 bg-white p-8 shadow-lg"
            >
              <div className="mb-6 flex gap-1 text-yellow-500">
                ★★★★★
              </div>

              <p className="leading-relaxed text-gray-600">
                “{item.review}”
              </p>

              <div className="mt-8">
                <h3 className="text-lg font-bold">
                  {item.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {item.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}