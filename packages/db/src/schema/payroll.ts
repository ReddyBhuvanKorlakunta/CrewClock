import {
  pgTable, pgEnum, uuid, text, timestamp, numeric, integer, boolean, date, jsonb, index
} from "drizzle-orm/pg-core";
import { tenants } from "./tenants";
import { employees } from "./employees";
import { users } from "./users";

export const timecardStatusEnum = pgEnum("timecard_status", [
  "draft", "pending", "approved", "locked", "disputed",
]);

export const payPeriods = pgTable("pay_periods", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  periodType: text("period_type", { enum: ["weekly", "biweekly", "semimonthly", "monthly"] }).default("biweekly"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  payDate: date("pay_date"),
  status: text("status", { enum: ["open", "processing", "closed", "exported"] }).default("open"),
  closedAt: timestamp("closed_at"),
  closedBy: uuid("closed_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  tenantDateIdx: index("pay_periods_tenant_date_idx").on(t.tenantId, t.startDate),
}));

export const timecards = pgTable("timecards", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  employeeId: uuid("employee_id").references(() => employees.id).notNull(),
  payPeriodId: uuid("pay_period_id").references(() => payPeriods.id).notNull(),
  status: timecardStatusEnum("status").default("draft").notNull(),
  totalRegularMinutes: integer("total_regular_minutes").default(0),
  totalOtMinutes: integer("total_ot_minutes").default(0),
  totalDoubleOtMinutes: integer("total_double_ot_minutes").default(0),
  totalBreakMinutes: integer("total_break_minutes").default(0),
  totalMealPenaltyMinutes: integer("total_meal_penalty_minutes").default(0),
  totalRegularPay: numeric("total_regular_pay", { precision: 12, scale: 2 }).default("0"),
  totalOtPay: numeric("total_ot_pay", { precision: 12, scale: 2 }).default("0"),
  totalMealPenaltyPay: numeric("total_meal_penalty_pay", { precision: 12, scale: 2 }).default("0"),
  totalGrossPay: numeric("total_gross_pay", { precision: 12, scale: 2 }).default("0"),
  flags: jsonb("flags").$type<{
    missingPunch?: boolean;
    longShift?: boolean;
    potentialOt?: boolean;
    mealPenalty?: boolean;
    otRisk?: boolean;
  }>().default({}),
  submittedAt: timestamp("submitted_at"),
  approvedBy: uuid("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  lockedAt: timestamp("locked_at"),
  employeeNotes: text("employee_notes"),
  managerNotes: text("manager_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const payrollRuns = pgTable("payroll_runs", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  payPeriodId: uuid("pay_period_id").references(() => payPeriods.id).notNull(),
  status: text("status", { enum: ["pending", "processing", "completed", "exported", "error"] }).default("pending"),
  totalGross: numeric("total_gross", { precision: 14, scale: 2 }),
  totalOtPremium: numeric("total_ot_premium", { precision: 14, scale: 2 }),
  totalMealPenalty: numeric("total_meal_penalty", { precision: 14, scale: 2 }),
  employeeCount: integer("employee_count"),
  exportFormat: text("export_format", { enum: ["quickbooks", "gusto", "adp", "paychex", "csv"] }),
  exportUrl: text("export_url"),
  errorMessage: text("error_message"),
  runBy: uuid("run_by").references(() => users.id),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Timecard = typeof timecards.$inferSelect;
export type PayPeriod = typeof payPeriods.$inferSelect;
