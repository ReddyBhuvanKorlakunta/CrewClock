import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { db, users, tenantMemberships, eq, and } from "@crewclock/db";

// Postgres (postgres-js) needs raw TCP, which the default Edge runtime can't
// do — this middleware queries the DB directly, so it must run on Node.js.
export const runtime = "nodejs";

function matches(pathname: string, patterns: string[]) {
  return patterns.some((p) => new RegExp(`^${p}$`).test(pathname));
}

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  "/sign-in(?:/.*)?",
  "/sign-up(?:/.*)?",
  "/auth/callback(?:/.*)?",
  "/auth/verified(?:/.*)?",
  "/api/health",
];

// Signed in, but no tenant/org required yet
const AUTH_ONLY_ROUTES = ["/onboarding(?:/.*)?", "/restore-account(?:/.*)?", "/verify-email-sent(?:/.*)?"];

const API_ROUTE = "/api(?:/.*)?";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;

  const cookieMethods: CookieMethodsServer = {
    getAll: () => req.cookies.getAll(),
    setAll: (cookiesToSet) => {
      cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
      cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
    },
  };
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookieMethods },
  );

  const { data: { user: authUser } } = await supabase.auth.getUser();

  // Root path: route based on auth state
  if (pathname === "/") {
    if (!authUser) return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (matches(pathname, PUBLIC_ROUTES)) return res;

  if (!authUser) {
    if (matches(pathname, [API_ROUTE])) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const signIn = new URL("/sign-in", req.url);
    signIn.searchParams.set("redirect_url", pathname);
    return NextResponse.redirect(signIn);
  }

  // Account lifecycle gating — sourced directly from our own `users` table
  // rather than JWT custom claims, to avoid depending on a Supabase Auth Hook
  // during this first migration pass.
  const dbUser = await db.query.users.findFirst({ where: eq(users.authUserId, authUser.id) });

  if (dbUser?.accountStatus === "soft_deleted") {
    if (pathname !== "/restore-account") return NextResponse.redirect(new URL("/restore-account", req.url));
    return res;
  }
  if (dbUser?.accountStatus === "disabled") {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (matches(pathname, AUTH_ONLY_ROUTES)) return res;

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/schedule", req.url));
  }

  const membership = dbUser
    ? await db.query.tenantMemberships.findFirst({
        where: and(eq(tenantMemberships.userId, dbUser.id), eq(tenantMemberships.isActive, true)),
      })
    : null;

  if (!membership) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
