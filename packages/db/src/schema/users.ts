import {
  pgTable, pgEnum, uuid, text, boolean, timestamp, index, uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { tenants } from "./tenants";

export const memberRoleEnum = pgEnum("member_role", [
  "super_admin", "admin", "manager", "supervisor", "employee",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  clerkId: text("clerk_id").unique().notNull(),
  email: text("email").unique().notNull(),
  firstName: text("first_name").notNull().default(""),
  lastName: text("last_name").notNull().default(""),
  username: text("username").unique(),
  imageUrl: text("image_url"),
  phone: text("phone"),
  timezone: text("timezone"),
  notificationToken: text("notification_token"),
  lastSeenAt: timestamp("last_seen_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

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
