"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    const {
      data,
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setLoading(false);

      alert(error.message);
      return;
    }

    const user = data.user;

    if (user) {
      await supabase.from("profiles").insert({
        id: user.id,
        full_name: fullName,
        email: email,
      });
    }

    setLoading(false);

    alert(
      "Signup successful! Check your email."
    );
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 dark:bg-black">
      <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-zinc-950">
        
        <div>
          <h1 className="text-4xl font-black tracking-tight">
            Create Account
          </h1>

          <p className="mt-2 text-gray-500">
            Begin your learning journey today.
          </p>
        </div>

        <form
          onSubmit={handleSignup}
          className="mt-10 space-y-6"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              className="w-full rounded-2xl border border-black/10 bg-white/50 px-5 py-4 outline-none backdrop-blur-sm transition focus:border-black dark:border-white/10 dark:bg-white/5 dark:focus:border-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full rounded-2xl border border-black/10 bg-white/50 px-5 py-4 outline-none backdrop-blur-sm transition focus:border-black dark:border-white/10 dark:bg-white/5 dark:focus:border-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full rounded-2xl border border-black/10 bg-white/50 px-5 py-4 outline-none backdrop-blur-sm transition focus:border-black dark:border-white/10 dark:bg-white/5 dark:focus:border-white"
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-black py-4 font-medium text-white transition hover:scale-[1.02] hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black"
          >
            {loading
              ? "Creating..."
              : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-black dark:text-white"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}