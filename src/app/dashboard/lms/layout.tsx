import "./lms-portal.css";

import { getSessionUser } from "@/lib/auth";
import { lmsRoleFromUser } from "@/lib/lms/roles";
import { getLmsProfileRole } from "@/Services/lms";
import LmsSubNav from "@/components/lms/LmsSubNav";

export default async function LmsLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  const profileRole = user ? await getLmsProfileRole(user.id) : null;
  const role = lmsRoleFromUser(user, profileRole);

  return (
    <div className="lms-portal px-5 py-8 sm:px-8 xl:px-10">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">
          AI learning portal
        </p>
        <h1 className="mt-2 text-2xl font-black text-zinc-900 dark:text-white sm:text-3xl">LMS</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
          Lessons, quizzes, assignments, and certificates — integrated with your enrollments and Razorpay checkout.
        </p>
      </div>
      <LmsSubNav role={role} />
      {children}
    </div>
  );
}
