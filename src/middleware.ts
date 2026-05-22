import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(
  request: NextRequest
) {
  const hasSession = request.cookies
    .getAll()
    .some((cookie) =>
      cookie.name.includes(
        "auth-token"
      )
    );

  const isDashboardRoute =
    request.nextUrl.pathname.startsWith(
      "/dashboard"
    );

  const isAuthPage =
    request.nextUrl.pathname ===
      "/login" ||
    request.nextUrl.pathname ===
      "/signup";

  // Not logged in
  if (
    !hasSession &&
    isDashboardRoute
  ) {
    return NextResponse.redirect(
      new URL(
        "/login",
        request.url
      )
    );
  }

  // Already logged in
  if (
    hasSession &&
    isAuthPage
  ) {
    return NextResponse.redirect(
      new URL(
        "/dashboard",
        request.url
      )
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/signup",
  ],
};