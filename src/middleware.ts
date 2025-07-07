// middleware.ts (Next.js App Router)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log("🔒 Middleware triggered for", request.nextUrl.pathname); // ✅ test this

  const basicAuth = request.headers.get("authorization");

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (basicAuth) {
      const authValue = basicAuth.split(" ")[1];
      const [user, pwd] = atob(authValue).split(":");

      if (
        user === process.env.BASIC_AUTH_USER &&
        pwd === process.env.BASIC_AUTH_PASS
      ) {
        return NextResponse.next();
      }
    }

    return new NextResponse("Auth Required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    // Or use '/((?!api|_next/static|_next/image|favicon.ico).*)'
    // to match all routes except API routes and static files
  ],
};
