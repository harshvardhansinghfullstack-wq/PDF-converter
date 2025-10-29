import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const publicPaths = ["/", "/login", "/signup", "/about", "/blogs"];
  const { pathname } = req.nextUrl;

  // If it's a public page, allow
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Middleware can't access localStorage, so just skip if no cookie
  // Instead, client-side (your AuthContext) handles redirect if no token
  const token = req.cookies.get("token")?.value;

  if (!token) {
    // Just redirect to login if not token (cookie-based only)
    // Since you’re not using cookies, this block basically does nothing now
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Apply to all routes except static files & api
export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};
