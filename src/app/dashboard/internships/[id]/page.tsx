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
    <main className="px-5 py-8 sm:px-8 xl:px-12">

      <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-xl transition duration-500 dark:border-white/10 dark:bg-zinc-900">

        <img
          src={
            internship.image_url ||
               "https://images.unsplash.com/photo-1498050108023-c5249f4df085"
          }
          alt={internship.title}
          className="h-[280px] sm:h-[400px] xl:h-[500px] w-full object-cover"
        />

        <div className="px-5 py-8 sm:px-8 xl:px-12">

          <div className="flex items-start justify-between">

            <div>

              <h1 className="text-3xl font-black text-zinc-900 dark:text-white sm:text-4xl xl:text-5xl">
                {internship.title}
              </h1>

              <p className="mt-4 text-2xl text-gray-500 dark:text-gray-400">
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

          <div className="mt-10 grid gap-8 lg:grid-cols-2">

            <div className="lg:col-span-2">

              <h2 className="text-3xl font-bold">
                About Internship
              </h2>

              <p className="mt-6 text-base sm:text-lg leading-8 text-gray-600 dark:text-gray-400">
                {internship.description}
              </p>

            </div>

            <div className="rounded-3xl border border-black/10 p-5 transition duration-500 dark:border-white/10 sm:p-8">

              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                Stipend
              </h2>

              <p className="mt-4 text-3xl font-black text-zinc-900 dark:text-white sm:text-4xl">
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