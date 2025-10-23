import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "./lib/auth";

// 1. Specify protected and public routes
const protectedRoutes = [
  "/onboarding/add-agent",
  "/onboarding/add-driver",
  "/onboarding/add-vehicle",
  "/onboarding/change-password",
];
const publicRoutes = ["/onboarding/create-account", "/onboarding", "/"];

export default async function proxy(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute =
    path.startsWith("/dashboard") ||
    path.startsWith("/rider") ||
    protectedRoutes.includes(path);
  const isPublicRoute =
    publicRoutes.includes(path) ||
    path.startsWith("/auth") ||
    path.startsWith("/landing");

  // 3. Get Current User from cookie
  const user = await getCurrentUser();

  // 4. Redirect to /auth/login if the user is not authenticated
  if (isProtectedRoute && !user?.userId) {
    return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
  }

  // 5. Redirect public to private routes if the user is authenticated
  if (isPublicRoute && user?.userId) {
    if (user.userRole == "driver") {
      return NextResponse.redirect(new URL("/rider", req.nextUrl));
    }
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-next-pathname", path);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
