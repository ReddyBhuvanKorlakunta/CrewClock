import { pgTable, uuid, text, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";
import { users } from "./users";
import { employees } from "./employees";

export const notificationPreferences = pgTable("notification_preferences", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  scheduleChanges: text("schedule_changes", { enum: ["push", "email", "sms", "all", "none"] }).default("push"),
  shiftReminders: text("shift_reminders", { enum: ["push", "email", "all", "none"] }).default("push"),
  leaveUpdates: text("leave_updates", { enum: ["push", "email", "all", "none"] }).default("email"),
  payroll: text("payroll", { enum: ["push", "email", "all", "none"] }).default("email"),
  chat: text("chat", { enum: ["push", "none"] }).default("push"),
  reminder24h: boolean("reminder_24h").default(true),
  reminder1h: boolean("reminder_1h").default(true),
  reminder30m: boolean("reminder_30m").default(true),
  quietHoursStart: text("quiet_hours_start"), // HH:mm
  quietHoursEnd: text("quiet_hours_end"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const channels = pgTable("channels", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  name: text("name").notNull(),
  type: text("type", { enum: ["announcement", "location", "role", "team", "direct"] }).notNull(),
  description: text("description"),
  isReadOnly: boolean("is_read_only").default(false),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const channelMembers = pgTable("channel_members", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  channelId: uuid("channel_id").references(() => channels.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  lastReadAt: timestamp("last_read_at"),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  channelId: uuid("channel_id").references(() => channels.id, { onDelete: "cascade" }).notNull(),
  senderId: uuid("sender_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  attachmentUrl: text("attachment_url"),
  isEmergencyBroadcast: boolean("is_emergency_broadcast").default(false),
  editedAt: timestamp("edited_at"),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  channelTimeIdx: index("messages_channel_time_idx").on(t.channelId, t.createdAt),
}));
