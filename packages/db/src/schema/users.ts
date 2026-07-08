import {
  pgTable, pgEnum, uuid, text, boolean, timestamp, index, uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { tenants } from "./tenants";

export const memberRoleEnum = pgEnum("member_role", [
  "super_admin", "admin", "manager", "supervisor", "employee",
]);

export const accountStatusEnum = pgEnum("account_status", [
  "new_user", "email_pending_verification", "active", "soft_deleted", "disabled",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  // FK to Supabase's auth.users.id — cross-schema, expressed as raw SQL in a
  // hand-written migration (Drizzle doesn't model cross-schema FKs directly).
  authUserId: uuid("auth_user_id").unique().notNull(),
  email: text("email").unique().notNull(),
  firstName: text("first_name").notNull().default(""),
  lastName: text("last_name").notNull().default(""),
  username: text("username").unique(),
  imageUrl: text("image_url"),
  phone: text("phone"),
  timezone: text("timezone"),
  notificationToken: text("notification_token"),
  lastSeenAt: timestamp("last_seen_at"),
  // ── Account lifecycle ──────────────────────────────────────────────────────
  accountStatus: accountStatusEnum("account_status").default("new_user").notNull(),
  onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
  deletedAt: timestamp("deleted_at"),
  deletionHoldUntil: timestamp("deletion_hold_until"), // deletedAt + 7 days; restore window
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  authUserIdx: uniqueIndex("users_auth_user_id_idx").on(t.authUserId),
}));

export const tenantMemberships = pgTable("tenant_memberships", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  role: memberRoleEnum("role").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  inviteToken: text("invite_token").unique(),
  inviteExpiresAt: timestamp("invite_expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  tenantUserIdx: uniqueIndex("tenant_user_idx").on(t.tenantId, t.userId),
  tenantIdx: index("memberships_tenant_idx").on(t.tenantId),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type TenantMembership = typeof tenantMemberships.$inferSelect;
