import { deleteInternship } from "@/actions/deleteInternship";
import { getInternships } from "@/Services/Internships";
import { createInternship } from "@/actions/createInternships";
import Link from "next/link";

export default async function AdminPage()  {
  const internships =
    await getInternships();

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-12">

      <div className="mb-12">

        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
          Admin Dashboard
        </p>

        <h1 className="mt-4 text-4xl font-black text-black dark:text-white sm:text-5xl">
          Manage Internships
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-8 text-gray-500 dark:text-gray-400 sm:text-lg">
          Add and manage internship
          opportunities across the platform.
        </p>

      </div>

      <div className="rounded-[32px] border border-white/20 bg-white/80 p-6 shadow-2xl backdrop-blur-xl transition duration-500 dark:border-white/10 dark:bg-white/5 sm:p-8">

        <form 
        action={createInternship}
        className="grid gap-6"
        >

          <div>

            <label className="mb-3 block text-sm font-semibold text-gray-600 dark:text-gray-300">
              
              Internship Title
            </label>

            <input
              type="text"
              name="title"
              placeholder="Frontend Developer Internship"
              className="w-full rounded-3xl border border-black/10 bg-white/70 px-5 py-5 outline-none transition focus:border-black focus:ring-4 focus:ring-black/5 dark:border-white/10 dark:bg-black/20 dark:text-white"
            />

          </div>

          <div>

            <label className="mb-3 block text-sm font-semibold text-gray-600 dark:text-gray-300">
              
              Company Name
            </label>

            <input
              type="text"
              name="company"
              placeholder="Google"
              className="w-full rounded-3xl border border-black/10 bg-white/70 px-5 py-5 outline-none transition focus:border-black focus:ring-4 focus:ring-black/5 dark:border-white/10 dark:bg-black/20 dark:text-white"
            />

          </div>

          <div>

            <label className="mb-3 block text-sm font-semibold text-gray-600 dark:text-gray-300">
              Internship Description
            </label>

            <textarea
              rows={6}
              name="description"
              placeholder="Describe internship responsibilities..."
              className="w-full rounded-3xl border border-black/10 bg-white/70 px-5 py-5 outline-none transition focus:border-black focus:ring-4 focus:ring-black/5 dark:border-white/10 dark:bg-black/20 dark:text-white"
            />

          </div>

          <div className="grid gap-6 sm:grid-cols-2">

            <div>

              <label className="mb-3 block text-sm font-semibold text-gray-600 dark:text-gray-300">
                
                Duration
              </label>

              <input
                type="text"
                name="duration"
                placeholder="3 Months"
                className="w-full rounded-3xl border border-black/10 bg-white/70 px-5 py-5 outline-none transition focus:border-black focus:ring-4 focus:ring-black/5 dark:border-white/10 dark:bg-black/20 dark:text-white"
              />

            </div>

            <div>

              <label className="mb-3 block text-sm font-semibold text-gray-600 dark:text-gray-300">
                
                Stipend
              </label>

              <input
                type="text"
                name="stipend"
                placeholder="₹25,000/month"
                className="w-full rounded-3xl border border-black/10 bg-white/70 px-5 py-5 outline-none transition focus:border-black focus:ring-4 focus:ring-black/5 dark:border-white/10 dark:bg-black/20 dark:text-white"
              />

            </div>

          </div>

          <div>

            <label className="mb-3 block text-sm font-semibold text-gray-600 dark:text-gray-300">
              Image URL
            </label>

            <input
              type="text"
              name="image_url"
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-3xl border border-black/10 bg-white/70 px-5 py-5 outline-none transition focus:border-black focus:ring-4 focus:ring-black/5 dark:border-white/10 dark:bg-black/20 dark:text-white"
            />

          </div>

          <button
            type="submit"
            className="mt-6 rounded-3xl bg-black px-8 py-5 text-lg font-semibold text-white shadow-2xl transition duration-300 hover:scale-[1.02] hover:shadow-black/30 dark:bg-white dark:text-black"
          >
            Add Internship
          </button>

        </form>
        <div className="mt-16 rounded-[32px] border border-white/20 bg-white/70 p-6 shadow-2xl backdrop-blur-xl transition duration-500 dark:border-white/10 dark:bg-white/5 sm:p-8">

  <div className="mb-10 flex items-center justify-between">

    <div>

      <p className="text-sm uppercase tracking-[0.3em] text-gray-400">
        Internship Management
      </p>

      <h2 className="mt-3 text-3xl font-black text-black dark:text-white">
        Manage Existing Internships
      </h2>

    </div>

    <div className="rounded-2xl bg-black px-5 py-3 text-white dark:bg-white dark:text-black">
      {internships.length}
    </div>

  </div>

  <div className="space-y-5">

    {internships.map((internship: any) => (

      <div
        key={internship.id}
        className="flex flex-col gap-5 rounded-3xl border border-black/5 bg-black/[0.02] p-6 transition duration-300 dark:border-white/10 dark:bg-white/[0.03] xl:flex-row xl:items-center xl:justify-between"
      >

        <div>

          <h3 className="text-2xl font-black text-black dark:text-white">
            {internship.title}
          </h3>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {internship.company}
          </p>

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {internship.duration} • {internship.stipend}
          </p>

        </div>

        <div className="flex gap-4">

          <Link
  href={`/dashboard/admin/edit/${internship.id}`}
  className="rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] dark:bg-white dark:text-black"
>
  Edit
</Link>

          <form
  action={async () => {
    "use server";

    await deleteInternship(
      internship.id
    );
  }}
  className="inline-block"
>

  <button
    type="submit"
    className="rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-xl transition duration-300 hover:scale-[1.02] hover:bg-red-700"
  >
    Delete
  </button>

</form>

        </div>

      </div>

    ))}

  </div>

</div>

      </div>

    </main>
  );
}