import ApplyButton from "@/components/components/dashboard/ApplyButton";
import { getInternshipById } from "@/Services/internship-details";

export default async function InternshipDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const internship =
    await getInternshipById(id);

  if (!internship) {
    return (
      <main className="p-8">
        Internship not found.
      </main>
    );
  }

  return (
    <main className="p-8">

      <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-xl">

        <img
          src={internship.image_url}
          alt={internship.title}
          className="h-[420px] w-full object-cover"
        />

        <div className="p-10">

          <div className="flex items-start justify-between">

            <div>

              <h1 className="text-5xl font-black">
                {internship.title}
              </h1>

              <p className="mt-4 text-2xl text-gray-500">
                {internship.company}
              </p>

            </div>

            <div className="rounded-2xl bg-black px-6 py-4 text-white">

              <p className="text-sm">
                Duration
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {internship.duration}
              </h2>

            </div>

          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-3">

            <div className="lg:col-span-2">

              <h2 className="text-3xl font-bold">
                About Internship
              </h2>

              <p className="mt-6 text-lg leading-8 text-gray-600">
                {internship.description}
              </p>

            </div>

            <div className="rounded-3xl border border-black/10 p-8">

              <h2 className="text-2xl font-bold">
                Stipend
              </h2>

              <p className="mt-4 text-4xl font-black">
                {internship.stipend}
              </p>

              <ApplyButton
                internshipId={internship.id}
              />

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}