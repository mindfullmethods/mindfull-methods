import { getInternshipById } from "@/Services/internship-details";
import { updateInternship } from "@/actions/updateInternship";

export default async function EditInternshipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

  const internship =
    await getInternshipById(id);

  if (!internship) {
    return (
      <main className="p-10">
        Internship not found.
      </main>
    );
  }

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-12">

      <div className="mb-12">

        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
          Edit Internship
        </p>

        <h1 className="mt-4 text-4xl font-black text-black dark:text-white sm:text-5xl">
          Update Internship
        </h1>

      </div>

      <div className="rounded-[32px] border border-white/20 bg-white/80 p-6 shadow-2xl backdrop-blur-xl transition duration-500 dark:border-white/10 dark:bg-white/5 sm:p-8">

        <form
          action={async (formData) => {
            "use server";

            await updateInternship(
              internship.id,
              formData
            );
          }}
          className="grid gap-6"
        >

          <input
            name="title"
            defaultValue={internship.title}
            className="w-full rounded-3xl border border-black/10 bg-white/70 px-5 py-5 outline-none transition dark:border-white/10 dark:bg-black/20 dark:text-white"
          />

          <input
            name="company"
            defaultValue={internship.company}
            className="w-full rounded-3xl border border-black/10 bg-white/70 px-5 py-5 outline-none transition dark:border-white/10 dark:bg-black/20 dark:text-white"
          />

          <textarea
            name="description"
            rows={6}
            defaultValue={internship.description}
            className="w-full rounded-3xl border border-black/10 bg-white/70 px-5 py-5 outline-none transition dark:border-white/10 dark:bg-black/20 dark:text-white"
          />

          <div className="grid gap-6 sm:grid-cols-2">

            <input
              name="duration"
              defaultValue={internship.duration}
              className="w-full rounded-3xl border border-black/10 bg-white/70 px-5 py-5 outline-none transition dark:border-white/10 dark:bg-black/20 dark:text-white"
            />

            <input
              name="stipend"
              defaultValue={internship.stipend}
              className="w-full rounded-3xl border border-black/10 bg-white/70 px-5 py-5 outline-none transition dark:border-white/10 dark:bg-black/20 dark:text-white"
            />

          </div>

          <input
            name="image_url"
            defaultValue={internship.image_url}
            className="w-full rounded-3xl border border-black/10 bg-white/70 px-5 py-5 outline-none transition dark:border-white/10 dark:bg-black/20 dark:text-white"
          />

          <button
            type="submit"
            className="mt-6 rounded-3xl bg-black px-8 py-5 text-lg font-semibold text-white shadow-2xl transition duration-300 hover:scale-[1.02] dark:bg-white dark:text-black"
          >
            Update Internship
          </button>

        </form>

      </div>

    </main>
  );
}