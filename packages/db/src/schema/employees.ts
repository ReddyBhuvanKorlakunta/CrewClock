import {
  pgTable, pgEnum, uuid, text, numeric, boolean, date, integer,
  timestamp, index
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { tenants } from "./tenants";
import { users } from "./users";

export const employmentTypeEnum = pgEnum("employment_type", [
  "full_time", "part_time", "casual", "contract",
]);

export const employeeStatusEnum = pgEnum("employee_status", [
  "active", "inactive", "terminated",
]);

export const roles = pgTable("roles", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  color: text("color").default("#2563EB"),
  defaultHourlyRate: numeric("default_hourly_rate", { precision: 10, scale: 2 }),
  maxHoursPerDay: numeric("max_hours_per_day", { precision: 4, scale: 2 }).default("10"),
  maxHoursPerWeek: numeric("max_hours_per_week", { precision: 5, scale: 2 }).default("40"),
  maxShiftsPerWeek: integer("max_shifts_per_week").default(5),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const skillDefinitions = pgTable("skill_definitions", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  requiresCertification: boolean("requires_certification").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const employees = pgTable("employees", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  employeeNumber: text("employee_number"),
  primaryRoleId: uuid("primary_role_id").references(() => roles.id),
  hourlyRate: numeric("hourly_rate", { precision: 10, scale: 2 }),
  overtimeRateMultiplier: numeric("overtime_rate_multiplier", { precision: 4, scale: 2 }).default("1.5"),
  employmentType: employmentTypeEnum("employment_type").default("full_time"),
  hireDate: date("hire_date"),
  terminationDate: date("termination_date"),
  weeklyHoursTarget: numeric("weekly_hours_target", { precision: 5, scale: 2 }).default("40"),
  pin: text("pin"), // hashed, for kiosk clock-in
  status: employeeStatusEnum("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  tenantIdx: index("employees_tenant_idx").on(t.tenantId),
  userIdx: index("employees_user_idx").on(t.userId),
}));

export const employeeSkills = pgTable("employee_skills", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  employeeId: uuid("employee_id").references(() => employees.id, { onDelete: "cascade" }).notNull(),
  skillId: uuid("skill_id").references(() => skillDefinitions.id).notNull(),
  level: integer("level").default(1), // 1-5
  certifiedAt: date("certified_at"),
  expiresAt: date("expires_at"),
  documentUrl: text("document_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const availability = pgTable("availability", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  employeeId: uuid("employee_id").references(() => employees.id, { onDelete: "cascade" }).notNull(),
  type: text("type", { enum: ["recurring", "date_specific"] }).notNull(),
  dayOfWeek: integer("day_of_week"), // 0=Sun..6=Sat
  specificDate: date("specific_date"),
  startTime: text("start_time").notNull(), // HH:mm
  endTime: text("end_time").notNull(),
  isAvailable: boolean("is_available").notNull(),
  preferenceLevel: integer("preference_level").default(2), // 1=preferred, 3=last resort
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Employee = typeof employees.$inferSelect;
export type NewEmployee = typeof employees.$inferInsert;
export type Role = typeof roles.$inferSelect;
