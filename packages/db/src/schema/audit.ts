import { pgTable, uuid, text, timestamp, inet, index } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";
import { users } from "./users";

// This table is IMMUTABLE — no updates or deletes permitted
// Enforced by PostgreSQL RLS + trigger in migration
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  userId: uuid("user_id").references(() => users.id),
  action: text("action").notNull(), // e.g. "timecard.approved", "shift.override"
  resourceType: text("resource_type"),
  resourceId: uuid("resource_id"),
  beforeState: text("before_state"), // JSON string
  afterState: text("after_state"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  // NO updatedAt — immutable record
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  tenantTimeIdx: index("audit_logs_tenant_time_idx").on(t.tenantId, t.createdAt),
  actionIdx: index("audit_logs_action_idx").on(t.action),
}));

export type AuditLog = typeof auditLogs.$inferSelect;
