import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@crewclock/api";
import { db, users, tenantMemberships, tenants } from "@crewclock/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import type { Context } from "@crewclock/api/src/context";

async function createContext(req: Request): Promise<Context> {
  const { userId: clerkId, orgId: clerkOrgId } = await auth();

  if (!clerkId) {
    return { db, user: null, membership: null, tenantId: null, headers: req.headers };
  }

  // ── 1. Auto-upsert user from Clerk ──────────────────────────────────────────
  let user = await db.query.users.findFirst({ where: eq(users.clerkId, clerkId) }) ?? null;
  if (!user) {
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(clerkId);
    const primaryEmail =
      clerkUser.emailAddresses.find(e => e.id === clerkUser.primaryEmailAddressId)?.emailAddress ?? "";
    const [inserted] = await db
      .insert(users)
      .values({
        clerkId,
        email: primaryEmail,
        firstName: clerkUser.firstName ?? "",
        lastName: clerkUser.lastName ?? "",
        imageUrl: clerkUser.imageUrl ?? null,
        username: clerkUser.username ?? null,
      })
      .onConflictDoUpdate({
        target: users.clerkId,
        set: {
          email: primaryEmail,
          firstName: clerkUser.firstName ?? "",
          lastName: clerkUser.lastName ?? "",
          imageUrl: clerkUser.imageUrl ?? null,
          username: clerkUser.username ?? null,
          updatedAt: new Date(),
        },
      })
      .returning();
    user = inserted ?? null;
  }

  if (!user || !clerkOrgId) {
    return { db, user: user ?? null, membership: null, tenantId: null, headers: req.headers };
  }

  // ── 2. Look up (or create) tenant UUID from Clerk org ID ────────────────────
  let tenant = await db.query.tenants.findFirst({ where: eq(tenants.clerkOrgId, clerkOrgId) }) ?? null;
  if (!tenant) {
    const clerk = await clerkClient();
    const org = await clerk.organizations.getOrganization({ organizationId: clerkOrgId });
    const [inserted] = await db
      .insert(tenants)
      .values({
        clerkOrgId,
        name: org.name,
        slug: org.slug ?? clerkOrgId,
        plan: "free",
      })
      .onConflictDoUpdate({
        target: tenants.clerkOrgId,
        set: { name: org.name, updatedAt: new Date() },
      })
      .returning();
    tenant = inserted ?? null;
  }

  if (!tenant) {
    return { db, user, membership: null, tenantId: null, headers: req.headers };
  }

  // ── 3. Auto-create membership if missing ────────────────────────────────────
  let membership = await db.query.tenantMemberships.findFirst({
    where: and(
      eq(tenantMemberships.userId, user.id),
      eq(tenantMemberships.tenantId, tenant.id),
      eq(tenantMemberships.isActive, true),
    ),
  }) ?? null;

  if (!membership) {
    const [inserted] = await db
      .insert(tenantMemberships)
      .values({ userId: user.id, tenantId: tenant.id, role: "admin", isActive: true })
      .onConflictDoNothing()
      .returning();
    membership = inserted ?? null;
  }

  return { db, user, membership, tenantId: tenant.id, headers: req.headers };
}

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
  });

export { handler as GET, handler as POST };
