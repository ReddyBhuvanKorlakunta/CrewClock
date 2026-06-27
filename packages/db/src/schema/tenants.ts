import { pgTable, uuid, text, boolean, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const tenants = pgTable("tenants", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  clerkOrgId: text("clerk_org_id").unique(), // Clerk organization ID (org_xxxx)
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  plan: text("plan", { enum: ["free", "starter", "growth", "enterprise"] }).default("free").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripePriceId: text("stripe_price_id"),
  timezone: text("timezone").default("America/New_York").notNull(),
  settings: jsonb("settings").$type<{
    logoUrl?: string;
    locale?: string;
    weekStartDay?: 0 | 1;
    payPeriodType?: "weekly" | "biweekly" | "semimonthly" | "monthly";
    clockInWindowMinutes?: number;
    geofenceRadiusMeters?: number;
    requireGpsVerification?: boolean;
    enableKioskMode?: boolean;
    enableShiftSwaps?: boolean;
    enableOpenShifts?: boolean;
  }>().default({}).notNull(),
  maxEmployees: integer("max_employees").default(10).notNull(),
  maxLocations: integer("max_locations").default(1).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTenantSchema = createInsertSchema(tenants);
export const selectTenantSchema = createSelectSchema(tenants);
export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;
