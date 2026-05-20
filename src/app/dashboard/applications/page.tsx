"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ApplicationsPage() {
  const [applications, setApplications] =
    useState<any[]>([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("applications")
      .select(`
        id,
        internships:internship_id (
          id,
          title,
          company,
          description,
          duration,
          stipend,
          image_url
        )
      `)
      .eq("user_id", user.id);

    if (error) {
      console.log(error);
      return;
    }

    setApplications(data || []);
  }

  return (
    <main className="p-8">

      <div className="mb-10">
        <h1 className="text-4xl font-black">
          My Applications
        </h1>

        <p className="mt-2 text-gray-500">
          Track your applied internships.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

        {applications.map((application: any) => {
          const internship =
            application.internships;

          if (!internship) return null;

          return (
            <div
              key={application.id}
              className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-lg"
            >

              <img
                src={internship.image_url || 
                  "https://images.unsplash.com/photo-1498050108023-c5249f4df085"
                }
                alt={internship.title}
                className="h-52 w-full object-cover"
              />

              <div className="p-6">

                <h2 className="text-2xl font-bold">
                  {internship.title}
                </h2>

                <p className="mt-2 text-gray-500">
                  {internship.company}
                </p>

                <p className="mt-4 text-sm text-gray-600">
                  {internship.description}
                </p>

                <div className="mt-6 flex items-center justify-between">

                  <span className="rounded-full bg-black px-4 py-2 text-sm text-white">
                    Applied
                  </span>

                  <p className="font-semibold">
                    {internship.stipend}
                  </p>

                </div>
              </div>
            </div>
          );
        })}

      </div>
    </main>
  );
}