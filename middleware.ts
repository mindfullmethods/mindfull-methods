import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(
  request: NextRequest
) {
  const hasAuthCookie =
    request.cookies
      .getAll()
      .some((cookie) =>
        cookie.name.includes(
          "sb-"
        )
      );

  const isDashboardRoute =
    request.nextUrl.pathname.startsWith(
      "/dashboard"
    );

  if (
    !hasAuthCookie &&
    isDashboardRoute
  ) {
    return NextResponse.redirect(
      new URL(
        "/login",
        request.url
      )
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};