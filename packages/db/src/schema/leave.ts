import { pgTable, uuid, text, date, timestamp } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";
import { employees } from "./employees";
import { users } from "./users";

export const leaveCategories = pgTable("leave_categories", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  name: text("name").notNull(),
  type: text("type", {
    enum: ["pto", "sick", "emergency", "family_emergency", "bereavement",
           "maternity", "paternity", "jury_duty", "unpaid", "custom"],
  }).notNull(),
  isPaid: text("is_paid").default("true"),
  accrualRateHoursPerPayPeriod: text("accrual_rate"),
  color: text("color").default("#059669"),
  isActive: text("is_active").default("true"),
});

export const leaveRequests = pgTable("leave_requests", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  employeeId: uuid("employee_id").references(() => employees.id).notNull(),
  categoryId: uuid("category_id").references(() => leaveCategories.id).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  status: text("status", { enum: ["pending", "approved", "rejected", "cancelled"] }).default("pending"),
  notes: text("notes"),
  attachmentUrl: text("attachment_url"),
  reviewedBy: uuid("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  managerNotes: text("manager_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
