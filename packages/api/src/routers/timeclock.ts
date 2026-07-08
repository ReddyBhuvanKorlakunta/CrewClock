import { z } from "zod";
import { router, protectedProcedure, managerProcedure } from "../trpc";
import {
  clockEvents, shiftAssignments, shifts, locations,
  eq, and, desc, gte,
} from "@crewclock/db";
import { getCurrentEmployee } from "../lib/current-employee";

const clockEventInput = z.object({
  recordedAt: z.string().datetime(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  accuracyMeters: z.number().optional(),
  wifiSsid: z.string().optional(),
  deviceId: z.string().optional(),
  shiftAssignmentId: z.string().uuid().optional(),
  isOfflineQueued: z.boolean().default(false),
});

// Haversine distance in meters between two lat/lng points.
function distanceMeters(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6_371_000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function verifyLocation(
  ctx: { db: import("@crewclock/db").DB },
  employeeId: string,
  input: {
    latitude?: number | undefined;
    longitude?: number | undefined;
    wifiSsid?: string | undefined;
    shiftAssignmentId?: string | undefined;
  },
) {
  // Resolve which location this clock event should be checked against: the
  // explicitly passed shift assignment, or the employee's most recent shift
  // assignment today.
  let locationId: string | null = null;
  if (input.shiftAssignmentId) {
    const assignment = await ctx.db.query.shiftAssignments.findFirst({
      where: eq(shiftAssignments.id, input.shiftAssignmentId),
    });
    if (assignment) {
      const shift = await ctx.db.query.shifts.findFirst({ where: eq(shifts.id, assignment.shiftId) });
      locationId = shift?.locationId ?? null;
    }
  }
  if (!locationId) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const recent = await ctx.db
      .select({ locationId: shifts.locationId })
      .from(shiftAssignments)
      .innerJoin(shifts, eq(shiftAssignments.shiftId, shifts.id))
      .where(and(eq(shiftAssignments.employeeId, employeeId), gte(shifts.startTime, todayStart)))
      .orderBy(desc(shifts.startTime))
      .limit(1);
    locationId = recent[0]?.locationId ?? null;
  }

  if (!locationId) {
    return { locationVerified: false, locationVerificationMethod: "manual_override" as const };
  }

  const location = await ctx.db.query.locations.findFirst({ where: eq(locations.id, locationId) });
  if (!location) {
    return { locationVerified: false, locationVerificationMethod: "manual_override" as const };
  }

  if (input.latitude != null && input.longitude != null && location.latitude && location.longitude) {
    const distance = distanceMeters(
      input.latitude, input.longitude,
      Number(location.latitude), Number(location.longitude),
    );
    const radius = location.geofenceRadiusM ?? 100;
    return {
      locationVerified: distance <= radius,
      locationVerificationMethod: "gps_geofence" as const,
    };
  }

  if (input.wifiSsid && location.wifiSsids?.includes(input.wifiSsid)) {
    return { locationVerified: true, locationVerificationMethod: "wifi_ssid" as const };
  }

  return { locationVerified: false, locationVerificationMethod: "manual_override" as const };
}

export const timeclockRouter = router({
  clockIn: protectedProcedure
    .input(clockEventInput)
    .mutation(async ({ ctx, input }) => {
      const employee = await getCurrentEmployee(ctx);
      const verification = await verifyLocation(ctx, employee.id, input);

      const [event] = await ctx.db.insert(clockEvents).values({
        tenantId: ctx.tenantId,
        employeeId: employee.id,
        eventType: "clock_in",
        recordedAt: new Date(input.recordedAt),
        latitude: input.latitude?.toString(),
        longitude: input.longitude?.toString(),
        accuracyMeters: input.accuracyMeters?.toString(),
        wifiSsid: input.wifiSsid,
        deviceId: input.deviceId,
        shiftAssignmentId: input.shiftAssignmentId,
        isOfflineQueued: input.isOfflineQueued,
        ...verification,
      }).returning();
      return event;
    }),

  clockOut: protectedProcedure
    .input(clockEventInput)
    .mutation(async ({ ctx, input }) => {
      const employee = await getCurrentEmployee(ctx);
      const verification = await verifyLocation(ctx, employee.id, input);

      const [event] = await ctx.db.insert(clockEvents).values({
        tenantId: ctx.tenantId,
        employeeId: employee.id,
        eventType: "clock_out",
        recordedAt: new Date(input.recordedAt),
        latitude: input.latitude?.toString(),
        longitude: input.longitude?.toString(),
        accuracyMeters: input.accuracyMeters?.toString(),
        wifiSsid: input.wifiSsid,
        deviceId: input.deviceId,
        shiftAssignmentId: input.shiftAssignmentId,
        isOfflineQueued: input.isOfflineQueued,
        ...verification,
      }).returning();
      return event;
    }),

  // Current employee's clock status — powers initial button state on mobile.
  getMyStatus: protectedProcedure.query(async ({ ctx }) => {
    const employee = await getCurrentEmployee(ctx);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const lastEvent = await ctx.db.query.clockEvents.findFirst({
      where: and(eq(clockEvents.employeeId, employee.id), gte(clockEvents.recordedAt, todayStart)),
      orderBy: desc(clockEvents.recordedAt),
    });
    return { isClockedIn: lastEvent?.eventType === "clock_in", lastEvent: lastEvent ?? null };
  }),

  // Batch sync offline events
  syncOfflineEvents: protectedProcedure
    .input(z.array(z.object({
      eventType: z.enum(["clock_in", "clock_out", "break_start", "break_end"]),
      recordedAt: z.string().datetime(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      accuracyMeters: z.number().optional(),
      wifiSsid: z.string().optional(),
      deviceId: z.string().optional(),
    })))
    .mutation(async ({ ctx, input }) => {
      const employee = await getCurrentEmployee(ctx);

      const values = input.map((e) => ({
        tenantId: ctx.tenantId,
        employeeId: employee.id,
        eventType: e.eventType,
        recordedAt: new Date(e.recordedAt),
        latitude: e.latitude?.toString(),
        longitude: e.longitude?.toString(),
        accuracyMeters: e.accuracyMeters?.toString(),
        wifiSsid: e.wifiSsid,
        deviceId: e.deviceId,
        isOfflineQueued: true,
      }));
      await ctx.db.insert(clockEvents).values(values);
      return { synced: values.length };
    }),

  // Live status board (manager)
  getLiveStatus: managerProcedure
    .input(z.object({ locationId: z.string().uuid().optional() }))
    .query(async ({ ctx, input }) => {
      const since = new Date();
      since.setHours(0, 0, 0, 0);
      const events = await ctx.db
        .select()
        .from(clockEvents)
        .where(and(eq(clockEvents.tenantId, ctx.tenantId), gte(clockEvents.serverAt, since)))
        .orderBy(desc(clockEvents.serverAt));
      // Group by employee — last event = current status
      const statusMap = new Map<string, typeof events[0]>();
      for (const e of events) {
        if (!statusMap.has(e.employeeId)) statusMap.set(e.employeeId, e);
      }
      return Array.from(statusMap.values());
    }),
});
