import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@crewclock/api";
import { db, users, tenantMemberships, eq, and } from "@crewclock/db";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Context } from "@crewclock/api";

// Web sends cookie-based sessions; mobile sends a bearer token (no cookies).
async function getSupabaseUser(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } },
    );
    const { data } = await supabase.auth.getUser(token);
    return data.user;
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        // Route handler response is already committed by the time tRPC reads
        // this — middleware is what keeps the session cookie fresh.
        setAll: () => {},
      },
    },
  );
  const { data } = await supabase.auth.getUser();
  return data.user;
}

async function createContext(req: Request): Promise<Context> {
  const authUser = await getSupabaseUser(req);

  if (!authUser) {
    return { db, user: null, membership: null, tenantId: null, headers: req.headers };
  }

  // ── Auto-upsert user profile on first authenticated request ────────────────
  // Replaces the old Clerk webhook's user.created handler — Supabase has no
  // equivalent "organization" webhook concept, so this is the one sync point.
  let user = await db.query.users.findFirst({ where: eq(users.authUserId, authUser.id) }) ?? null;
  if (!user) {
    const [inserted] = await db
      .insert(users)
      .values({
        authUserId: authUser.id,
        email: authUser.email ?? "",
        firstName: (authUser.user_metadata?.first_name as string) ?? "",
        lastName: (authUser.user_metadata?.last_name as string) ?? "",
        username: (authUser.user_metadata?.username as string) ?? null,
        accountStatus: authUser.email_confirmed_at ? "active" : "email_pending_verification",
      })
      .onConflictDoUpdate({
        target: users.authUserId,
        set: { email: authUser.email ?? "", updatedAt: new Date() },
      })
      .returning();
    user = inserted ?? null;
  } else if (user.accountStatus === "email_pending_verification" && authUser.email_confirmed_at) {
    // Email got verified since the profile row was created — flip status now.
    const [updated] = await db
      .update(users)
      .set({ accountStatus: "active", updatedAt: new Date() })
      .where(eq(users.id, user.id))
      .returning();
    user = updated ?? user;
  }

  if (!user) {
    return { db, user: null, membership: null, tenantId: null, headers: req.headers };
  }

  // Blocked at the API layer too, not just middleware.
  if (user.accountStatus === "soft_deleted" || user.accountStatus === "disabled") {
    return { db, user, membership: null, tenantId: null, headers: req.headers };
  }

  const membership = await db.query.tenantMemberships.findFirst({
    where: and(eq(tenantMemberships.userId, user.id), eq(tenantMemberships.isActive, true)),
  }) ?? null;

  return { db, user, membership, tenantId: membership?.tenantId ?? null, headers: req.headers };
}

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
  });

export { handler as GET, handler as POST };
