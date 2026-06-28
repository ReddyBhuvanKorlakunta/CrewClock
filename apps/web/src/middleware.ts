import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/sso-callback(.*)",
  "/api/webhooks/(.*)",
  "/api/health",
]);

const isApiRoute = createRouteMatcher(["/api/(.*)"]);

export const middleware = clerkMiddleware(async (auth, req) => {
  const { userId, orgId } = await auth();

  // Root path: route based on auth state
  if (req.nextUrl.pathname === "/") {
    if (userId && orgId) {
      // Fully authenticated → go to dashboard
      return NextResponse.redirect(new URL("/schedule", req.url));
    }
    if (userId && !orgId) {
      // Auth but no org → onboarding
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
    // Not authenticated → sign in
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Public routes pass through
  if (isPublicRoute(req)) return NextResponse.next();

  // All other routes require authentication
  if (!userId) {
    if (isApiRoute(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (!orgId && !req.nextUrl.pathname.startsWith("/onboarding")) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
