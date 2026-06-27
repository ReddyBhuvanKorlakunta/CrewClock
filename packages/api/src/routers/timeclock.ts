import { z } from "zod";
import { router, protectedProcedure, managerProcedure } from "../trpc";
import { clockEvents, employees } from "@crewclock/db";
import { eq, and, desc, gte } from "drizzle-orm";

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

export const timeclockRouter = router({
  clockIn: protectedProcedure
    .input(clockEventInput)
    .mutation(async ({ ctx, input }) => {
      // TODO: validate geofence or SSID against location
      const employee = await ctx.db.query.employees.findFirst({
        where: and(eq(employees.userId, ctx.user.id), eq(employees.tenantId, ctx.tenantId)),
      });
      if (!employee) throw new Error("Employee not found");

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
        locationVerified: false, // validated async
      }).returning();
      return event;
    }),

  clockOut: protectedProcedure
    .input(clockEventInput)
    .mutation(async ({ ctx, input }) => {
      const employee = await ctx.db.query.employees.findFirst({
        where: and(eq(employees.userId, ctx.user.id), eq(employees.tenantId, ctx.tenantId)),
      });
      if (!employee) throw new Error("Employee not found");

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
      }).returning();
      return event;
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
      const employee = await ctx.db.query.employees.findFirst({
        where: and(eq(employees.userId, ctx.user.id), eq(employees.tenantId, ctx.tenantId)),
      });
      if (!employee) throw new Error("Employee not found");

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
