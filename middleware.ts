import { NextResponse, type NextRequest } from "next/server";

import { isAdminPath, isAdminUser } from "@/lib/auth/roles";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { supabaseResponse, user } = await updateSession(request);

  const isDashboard = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (isDashboard && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isDashboard && user && isAdminPath(pathname) && !isAdminUser(user)) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    dashboardUrl.search = "";
    return NextResponse.redirect(dashboardUrl);
  }

  if (isAuthPage && user) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    dashboardUrl.search = "";
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/login", "/signup"],
};
