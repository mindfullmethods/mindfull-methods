"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const handleLogin = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  setLoading(true);

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

    
  if (error) {
    alert(error.message);
    setLoading(false);
    return;
  }

  // Wait briefly for session cookies
  setTimeout(() => {
    window.location.href =
      "/dashboard";
  }, 1000);
};
  return (
    <main className="relative flex min-h-screen overflow-hidden bg-white dark:bg-black">
      
      {/* Background Blur */}
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-black/5 blur-3xl dark:bg-white/10" />

      {/* Left Side */}
      <div className="hidden flex-1 flex-col justify-between border-r border-black/5 bg-gray-50 p-12 dark:border-white/10 dark:bg-zinc-950 lg:flex">
        
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Mindfull Methoods
          </h1>
        </div>

        <div>
          <h2 className="max-w-md text-5xl font-black leading-tight tracking-tight">
            Build Real Skills For The Modern Tech Industry.
          </h2>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            Learn from experts, work on practical projects, and accelerate your career through industry-focused internships.
          </p>
        </div>

        <p className="text-sm text-gray-500">
          © 2026 Mindfull Methods
        </p>
      </div>

      {/* Right Side */}
      <div className="relative flex flex-1 items-center justify-center px-6 py-12">
        
        <div className="w-full max-w-md rounded-[2rem] border border-black/5 bg-white/70 p-10 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/70">
          
          {/* Header */}
          <div>
            <h1 className="text-4xl font-black tracking-tight">
              Welcome Back
            </h1>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Login to continue your learning journey.
            </p>
          </div>

          {/* Form */}
          <form
  onSubmit={handleLogin}
  className="mt-10 space-y-6"
>
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
      placeholder="Enter your password"
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
    {loading ? "Logging in..." : "Login"}
  </button>
</form>

          {/* Footer */}
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
  Don’t have an account?{" "}
  
  <Link
    href="/signup"
    className="font-semibold text-zinc-900 transition hover:text-black dark:text-white"
  >
    Sign up
  </Link>

</p>
        </div>
      </div>
    </main>
  );
}