import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Simple check for better-auth session cookie on protected paths
  // Note: True role checking happens in Server Components/Actions.
  const isProtected = request.nextUrl.pathname.startsWith("/admin") || 
                      request.nextUrl.pathname.startsWith("/dashboard");
                      
  if (isProtected) {
    const sessionCookie = request.cookies.get("better-auth.session_token") || 
                          request.cookies.get("__Secure-better-auth.session_token");
                          
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  // Basic CSRF mitigation for state-changing API routes
  if (request.nextUrl.pathname.startsWith("/api/") && !request.nextUrl.pathname.startsWith("/api/auth/")) {
    if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method)) {
      const origin = request.headers.get("origin");
      const host = request.headers.get("host");
      
      // If origin exists, it should match the host
      if (origin && host) {
        const originUrl = new URL(origin);
        if (originUrl.host !== host) {
          return new NextResponse(
            JSON.stringify({ error: "Invalid Origin. CSRF protection blocked this request." }),
            { status: 403, headers: { "Content-Type": "application/json" } }
          );
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*", 
    "/dashboard/:path*",
    "/api/:path*"
  ],
};
