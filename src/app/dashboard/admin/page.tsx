"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] =
    useState("");
  const [duration, setDuration] = useState("");
  const [stipend, setStipend] = useState("");
  const [imageUrl, setImageUrl] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleCreateInternship = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    const { error } = await supabase
      .from("internships")
      .insert({
        title,
        company,
        description,
        duration,
        stipend,
        image_url: imageUrl,
      });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Internship created!");

    setTitle("");
    setCompany("");
    setDescription("");
    setDuration("");
    setStipend("");
    setImageUrl("");
  };

  return (
    <main className="p-8">
      
      <div className="mb-10">
        <h1 className="text-4xl font-black">
          Admin Panel
        </h1>

        <p className="mt-2 text-gray-500">
          Create and manage internships.
        </p>
      </div>

      <form
        onSubmit={handleCreateInternship}
        className="max-w-2xl space-y-6"
      >
        <input
          type="text"
          placeholder="Internship title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className="w-full rounded-2xl border border-black/10 px-5 py-4 outline-none dark:border-white/10 dark:bg-zinc-900"
        />

        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) =>
            setCompany(e.target.value)
          }
          className="w-full rounded-2xl border border-black/10 px-5 py-4 outline-none dark:border-white/10 dark:bg-zinc-900"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          className="min-h-[140px] w-full rounded-2xl border border-black/10 px-5 py-4 outline-none dark:border-white/10 dark:bg-zinc-900"
        />

        <input
          type="text"
          placeholder="Duration"
          value={duration}
          onChange={(e) =>
            setDuration(e.target.value)
          }
          className="w-full rounded-2xl border border-black/10 px-5 py-4 outline-none dark:border-white/10 dark:bg-zinc-900"
        />

        <input
          type="text"
          placeholder="Stipend"
          value={stipend}
          onChange={(e) =>
            setStipend(e.target.value)
          }
          className="w-full rounded-2xl border border-black/10 px-5 py-4 outline-none dark:border-white/10 dark:bg-zinc-900"
        />

        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) =>
            setImageUrl(e.target.value)
          }
          className="w-full rounded-2xl border border-black/10 px-5 py-4 outline-none dark:border-white/10 dark:bg-zinc-900"
        />

        <button
          disabled={loading}
          className="rounded-2xl bg-black px-8 py-4 font-medium text-white transition hover:scale-[1.02] dark:bg-white dark:text-black"
        >
          {loading
            ? "Creating..."
            : "Create Internship"}
        </button>
      </form>
    </main>
  );
}