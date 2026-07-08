import {
  pgTable, pgEnum, uuid, text, boolean, timestamp, integer, index,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { tenants } from "./tenants";
import { employees } from "./employees";
import { locations } from "./locations";
import { users } from "./users";

// ─── Emergency Contacts ───────────────────────────────────────────────────────
export const contactRelationshipEnum = pgEnum("contact_relationship", [
  "spouse", "parent", "child", "sibling", "friend", "other",
]);

export const emergencyContacts = pgTable("emergency_contacts", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  employeeId: uuid("employee_id").references(() => employees.id, { onDelete: "cascade" }).notNull(),
  fullName: text("full_name").notNull(),
  relationship: contactRelationshipEnum("relationship").notNull(),
  phone: text("phone"),
  email: text("email"),
  priorityTier: integer("priority_tier").default(1).notNull(), // 1 = contacted first
  verified: boolean("verified").default(false).notNull(),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  employeeIdx: index("emergency_contacts_employee_idx").on(t.employeeId),
  tenantIdx: index("emergency_contacts_tenant_idx").on(t.tenantId),
  // "requires at least one of email/phone" is a CHECK constraint, not
  // expressible in Drizzle's pgTable DSL — added as a hand-written migration:
  // ALTER TABLE emergency_contacts ADD CONSTRAINT contact_has_reachable
  //   CHECK (phone IS NOT NULL OR email IS NOT NULL);
}));

// ─── Check-In Logs ────────────────────────────────────────────────────────────
export const checkInStatusEnum = pgEnum("check_in_status", [
  "safe", "missed", "help_requested",
]);

export const checkInLogs = pgTable("check_in_logs", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  employeeId: uuid("employee_id").references(() => employees.id, { onDelete: "cascade" }).notNull(),
  // Nullable — points at `locations` for now since there's no construction
  // `jobSites` table in this baseline; swap to jobSites once that module
  // exists if job-site-level check-ins are needed specifically.
  locationId: uuid("location_id").references(() => locations.id),
  scheduledFor: timestamp("scheduled_for").notNull(),
  respondedAt: timestamp("responded_at"),
  status: checkInStatusEnum("status").default("missed").notNull(),
  lat: text("lat"), // only populated if userPreferences.locationSharingEnabled
  lng: text("lng"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  employeeIdx: index("check_in_logs_employee_idx").on(t.employeeId),
  tenantIdx: index("check_in_logs_tenant_idx").on(t.tenantId),
  scheduledIdx: index("check_in_logs_scheduled_idx").on(t.scheduledFor),
}));

// ─── Alert Events ─────────────────────────────────────────────────────────────
export const alertEventTypeEnum = pgEnum("alert_event_type", [
  "missed_check_in", "help_requested", "escalated",
]);
export const alertEventStatusEnum = pgEnum("alert_event_status", [
  "pending", "notified", "acknowledged", "resolved",
]);

export const alertEvents = pgTable("alert_events", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  employeeId: uuid("employee_id").references(() => employees.id, { onDelete: "cascade" }).notNull(),
  checkInLogId: uuid("check_in_log_id").references(() => checkInLogs.id, { onDelete: "cascade" }),
  contactId: uuid("contact_id").references(() => emergencyContacts.id), // nullable — allows internal-only escalation
  eventType: alertEventTypeEnum("event_type").notNull(),
  status: alertEventStatusEnum("status").default("pending").notNull(),
  notifiedAt: timestamp("notified_at"),
  acknowledgedAt: timestamp("acknowledged_at"),
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: uuid("resolved_by").references(() => users.id), // manager who closed it out
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  employeeIdx: index("alert_events_employee_idx").on(t.employeeId),
  tenantIdx: index("alert_events_tenant_idx").on(t.tenantId),
}));

// ─── User Preferences ─────────────────────────────────────────────────────────
export const userPreferences = pgTable("user_preferences", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).unique().notNull(),
  theme: text("theme", { enum: ["light", "dark", "system"] }).default("system").notNull(),
  notificationsEnabled: boolean("notifications_enabled").default(true).notNull(),
  checkInRemindersEnabled: boolean("check_in_reminders_enabled").default(true).notNull(),
  locationSharingEnabled: boolean("location_sharing_enabled").default(false).notNull(), // MVP: hard default off
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type EmergencyContact = typeof emergencyContacts.$inferSelect;
export type NewEmergencyContact = typeof emergencyContacts.$inferInsert;
export type CheckInLog = typeof checkInLogs.$inferSelect;
export type NewCheckInLog = typeof checkInLogs.$inferInsert;
export type AlertEvent = typeof alertEvents.$inferSelect;
export type UserPreference = typeof userPreferences.$inferSelect;

export const insertEmergencyContactSchema = createInsertSchema(emergencyContacts);
export const selectEmergencyContactSchema = createSelectSchema(emergencyContacts);
export const insertCheckInLogSchema = createInsertSchema(checkInLogs);
