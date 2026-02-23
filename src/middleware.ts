import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_request: NextRequest) {
  // Protected routes - dashboard area
  // Client-side auth with localStorage is handled in the dashboard layout
  // For cookie-based auth, uncomment below:
  // if (pathname.startsWith("/dashboard")) {
  //   const token = request.cookies.get("refreshToken");
  //   if (!token) {
  //     return NextResponse.redirect(new URL("/login", request.url));
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
