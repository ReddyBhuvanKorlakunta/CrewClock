import {
  pgTable, pgEnum, uuid, text, timestamp, boolean, numeric, inet, index
} from "drizzle-orm/pg-core";
import { tenants } from "./tenants";
import { employees } from "./employees";
import { shiftAssignments } from "./scheduling";

export const clockEventTypeEnum = pgEnum("clock_event_type", [
  "clock_in", "clock_out", "break_start", "break_end",
]);

export const clockEvents = pgTable("clock_events", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  employeeId: uuid("employee_id").references(() => employees.id).notNull(),
  shiftAssignmentId: uuid("shift_assignment_id").references(() => shiftAssignments.id),
  eventType: clockEventTypeEnum("event_type").notNull(),
  // Device-reported time (could be slightly off)
  recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull(),
  // Server receipt time (authoritative)
  serverAt: timestamp("server_at", { withTimezone: true }).defaultNow().notNull(),
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  accuracyMeters: numeric("accuracy_meters", { precision: 6, scale: 2 }),
  locationVerified: boolean("location_verified").default(false),
  locationVerificationMethod: text("location_verification_method", {
    enum: ["gps_geofence", "wifi_ssid", "kiosk", "manual_override"],
  }),
  wifiSsid: text("wifi_ssid"),
  deviceId: text("device_id"),
  isOfflineQueued: boolean("is_offline_queued").default(false),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  employeeTimeIdx: index("clock_events_employee_time_idx").on(t.employeeId, t.recordedAt),
  tenantTimeIdx: index("clock_events_tenant_time_idx").on(t.tenantId, t.serverAt),
}));

export type ClockEvent = typeof clockEvents.$inferSelect;
