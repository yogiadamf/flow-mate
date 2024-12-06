import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/", "/workflows"];
const publicRoutes = ["/login", "/register"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const session = req.cookies.get("session-token")?.value;
  if (isProtectedRoute && !session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/login"; // Set the redirect path to "/login"

    const response = NextResponse.redirect(redirectUrl);

    // Set the "redirect-url" cookie to the URL of the protected route
    response.cookies.set("redirect-url", req.nextUrl.pathname, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      path: "/", // Make the cookie available across all routes
    });

    return response;
  }
  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
  return NextResponse.next();
}

// This is where you can specify which routes this middleware should run for
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
