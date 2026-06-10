import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/auth";

// Protect the dashboard and its data API. Unauthenticated visitors hitting
// /admin are redirected to the login page; the stats API returns 401.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const authed = await verifySessionToken(token);

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      // Already logged in? Skip the login form.
      if (authed) return NextResponse.redirect(new URL("/admin", req.url));
      return NextResponse.next();
    }
    if (!authed) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // The login endpoint must stay reachable while logged out.
  if (
    pathname.startsWith("/api/admin") &&
    pathname !== "/api/admin/login" &&
    !authed
  ) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
