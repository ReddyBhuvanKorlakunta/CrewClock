import { auth } from "@clerk/nextjs/server";
import { db, users, tenantMemberships, tenants, eq, and } from "@crewclock/db";
import type { Role } from "./rbac";

export interface AuthContext {
  userId: string;
  clerkId: string;
  tenantId: string;    // UUID from tenants table
  clerkOrgId: string; // Clerk org ID (org_xxxx)
  role: Role;
  email: string;
}

/**
 * Build auth context from current Clerk session.
 * Resolves Clerk org ID → tenant UUID → membership.
 */
export async function getAuthContext(): Promise<AuthContext | null> {
  const { userId: clerkId, orgId: clerkOrgId } = await auth();
  if (!clerkId || !clerkOrgId) return null;

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkId),
  });
  if (!user) return null;

  // Resolve tenant UUID from Clerk org ID
  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.clerkOrgId, clerkOrgId),
  });
  if (!tenant) return null;

  const membership = await db.query.tenantMemberships.findFirst({
    where: and(
      eq(tenantMemberships.userId, user.id),
      eq(tenantMemberships.tenantId, tenant.id),
      eq(tenantMemberships.isActive, true),
    ),
  });
  if (!membership) return null;

  return {
    userId: user.id,
    clerkId,
    tenantId: tenant.id,
    clerkOrgId,
    role: membership.role as Role,
    email: user.email,
  };
}
