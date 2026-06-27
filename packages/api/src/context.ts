import type { db } from "@crewclock/db";
import type { TenantMembership, User } from "@crewclock/db";

export interface Context {
  db: typeof db;
  user: User | null;
  membership: TenantMembership | null;
  tenantId: string | null;
  headers: Headers;
}

export type AuthenticatedContext = Context & {
  user: User;
  membership: TenantMembership;
  tenantId: string;
};
