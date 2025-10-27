import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of routes that require authentication
const protectedRoutes = ["/settings", "/profile"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute) {
    // Since we're using localStorage in the client, we'll handle auth checking on the client side
    // This middleware just ensures the routes are registered
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/settings/:path*", "/profile/:path*"],
};