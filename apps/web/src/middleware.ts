import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/sso-callback(.*)",
  "/api/webhooks/(.*)",
  "/api/health",
]);

const isApiRoute = createRouteMatcher(["/api/(.*)"]);

export const middleware = clerkMiddleware(async (auth, req) => {
  // Root path: redirect logged-in users with an org straight to the dashboard
  if (req.nextUrl.pathname === "/") {
    const { userId, orgId } = await auth();
    if (userId && orgId) {
      return NextResponse.redirect(new URL("/schedule", req.url));
    }
    return NextResponse.next();
  }

  if (isPublicRoute(req)) return NextResponse.next();

  const { userId, orgId } = await auth();

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
