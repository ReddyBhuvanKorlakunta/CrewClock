import {
  pgTable, pgEnum, uuid, text, timestamp, boolean, date, index,
  uniqueIndex, integer
} from "drizzle-orm/pg-core";
import { tenants } from "./tenants";
import { locations } from "./locations";
import { roles, employees } from "./employees";
import { users } from "./users";

export const shiftStatusEnum = pgEnum("shift_status", [
  "draft", "published", "open", "filled", "cancelled", "completed",
]);

export const assignmentStatusEnum = pgEnum("assignment_status", [
  "assigned", "confirmed", "declined", "no_show",
]);

export const shifts = pgTable("shifts", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  locationId: uuid("location_id").references(() => locations.id).notNull(),
  roleId: uuid("role_id").references(() => roles.id).notNull(),
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  endTime: timestamp("end_time", { withTimezone: true }).notNull(),
  breakDurationMinutes: integer("break_duration_minutes").default(30),
  requiredSkillIds: uuid("required_skill_ids").array(),
  notes: text("notes"),
  status: shiftStatusEnum("status").default("draft").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  scheduleWeekStart: date("schedule_week_start").notNull(), // grouping key
  isOpenShift: boolean("is_open_shift").default(false),
  minimumNoticeHours: integer("minimum_notice_hours").default(1),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  tenantWeekIdx: index("shifts_tenant_week_idx").on(t.tenantId, t.scheduleWeekStart),
  locationTimeIdx: index("shifts_location_time_idx").on(t.locationId, t.startTime),
}));

export const shiftAssignments = pgTable("shift_assignments", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  shiftId: uuid("shift_id").references(() => shifts.id, { onDelete: "cascade" }).notNull(),
  employeeId: uuid("employee_id").references(() => employees.id).notNull(),
  status: assignmentStatusEnum("status").default("assigned").notNull(),
  assignedAt: timestamp("assigned_at", { withTimezone: true }).defaultNow(),
  confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
  assignedBy: uuid("assigned_by").references(() => users.id),
  overrideReason: text("override_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  shiftEmployeeIdx: uniqueIndex("shift_employee_idx").on(t.shiftId, t.employeeId),
}));

export const openShiftEnrollments = pgTable("open_shift_enrollments", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  shiftId: uuid("shift_id").references(() => shifts.id, { onDelete: "cascade" }).notNull(),
  employeeId: uuid("employee_id").references(() => employees.id).notNull(),
  status: text("status", { enum: ["pending", "approved", "rejected", "withdrawn"] }).default("pending"),
  weeklyHoursAtRequest: integer("weekly_hours_at_request"),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  reviewedBy: uuid("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
});

export const shiftSwaps = pgTable("shift_swaps", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  requesterShiftId: uuid("requester_shift_id").references(() => shifts.id).notNull(),
  requesteeShiftId: uuid("requestee_shift_id").references(() => shifts.id),
  requesterId: uuid("requester_id").references(() => employees.id).notNull(),
  requesteeId: uuid("requestee_id").references(() => employees.id),
  status: text("status", { enum: ["pending_acceptance", "pending_manager", "approved", "rejected", "cancelled"] }).default("pending_acceptance"),
  requesterNote: text("requester_note"),
  requesteeNote: text("requestee_note"),
  managerNote: text("manager_note"),
  managerApprovedBy: uuid("manager_approved_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Shift = typeof shifts.$inferSelect;
export type ShiftAssignment = typeof shiftAssignments.$inferSelect;
