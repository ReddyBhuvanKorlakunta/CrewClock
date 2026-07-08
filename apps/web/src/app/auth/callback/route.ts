import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db, users, tenantMemberships, eq, and } from "@crewclock/db";

// Completes the OAuth PKCE handshake (Google, and later Apple/Microsoft) —
// replaces the old Clerk sso-callback page, which relied on Clerk's client-side
// handleRedirectCallback. Supabase's flow lands here as a server route instead.
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) {
    return NextResponse.redirect(new URL("/sign-in?error=oauth", req.url));
  }

  const dbUser = await db.query.users.findFirst({ where: eq(users.authUserId, data.user.id) });

  if (dbUser?.accountStatus === "soft_deleted") {
    return NextResponse.redirect(new URL("/restore-account", req.url));
  }

  const membership = dbUser
    ? await db.query.tenantMemberships.findFirst({
        where: and(eq(tenantMemberships.userId, dbUser.id), eq(tenantMemberships.isActive, true)),
      })
    : null;

  return NextResponse.redirect(new URL(membership ? "/schedule" : "/onboarding", req.url));
}
