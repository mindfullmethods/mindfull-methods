export default function SignupPage() {
  return (
    <main className="relative flex min-h-screen overflow-hidden bg-white dark:bg-black">
      
      {/* Background Blur */}
      <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-black/5 blur-3xl dark:bg-white/10" />

      {/* Left Section */}
      <div className="hidden flex-1 flex-col justify-between border-r border-black/5 bg-gray-50 p-12 dark:border-white/10 dark:bg-zinc-950 lg:flex">
        
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Unified Clone
          </h1>
        </div>

        <div>
          <h2 className="max-w-md text-5xl font-black leading-tight tracking-tight">
            Start Building Your Future With Real-World Skills.
          </h2>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            Join thousands of students learning through practical internships and industry-focused projects.
          </p>
        </div>

        <p className="text-sm text-gray-500">
          © 2026 Unified Clone
        </p>
      </div>

      {/* Right Section */}
      <div className="relative flex flex-1 items-center justify-center px-6 py-12">
        
        <div className="w-full max-w-md rounded-[2rem] border border-black/5 bg-white/70 p-10 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/70">
          
          {/* Header */}
          <div>
            <h1 className="text-4xl font-black tracking-tight">
              Create Account
            </h1>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Begin your learning journey today.
            </p>
          </div>

          {/* Form */}
          <form className="mt-10 space-y-6">
            
            <div>
              <label className="mb-2 block text-sm font-medium">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
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
                className="w-full rounded-2xl border border-black/10 bg-white/50 px-5 py-4 outline-none backdrop-blur-sm transition focus:border-black dark:border-white/10 dark:bg-white/5 dark:focus:border-white"
              />
            </div>

            <button className="w-full rounded-2xl bg-black py-4 font-medium text-white transition hover:scale-[1.02] hover:bg-gray-800 dark:bg-white dark:text-black">
              Create Account
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account? Login
          </p>
        </div>
      </div>
    </main>
  );
}