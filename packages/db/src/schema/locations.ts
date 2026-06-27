import { pgTable, uuid, text, numeric, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";

export const locations = pgTable("locations", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zip: text("zip"),
  country: text("country").default("US"),
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  geofenceRadiusM: integer("geofence_radius_m").default(100),
  wifiSsids: text("wifi_ssids").array(), // Indoor fallback SSIDs
  timezone: text("timezone").notNull(),
  taxJurisdiction: text("tax_jurisdiction"), // e.g. CA-LA, NY-NYC
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Location = typeof locations.$inferSelect;
