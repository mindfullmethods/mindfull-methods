import type { User } from "@supabase/supabase-js";

import { isAdminUser } from "@/lib/auth/roles";
import type { LmsRole } from "@/lib/lms/types";

export function lmsRoleFromUser(user: User | null | undefined, profileRole?: LmsRole | null): LmsRole {
  if (isAdminUser(user)) return "admin";
  if (profileRole === "instructor") return "instructor";
  return "student";
}

export function canAccessLmsAdmin(role: LmsRole) {
  return role === "admin";
}

export function canAccessLmsInstructor(role: LmsRole) {
  return role === "admin" || role === "instructor";
}
