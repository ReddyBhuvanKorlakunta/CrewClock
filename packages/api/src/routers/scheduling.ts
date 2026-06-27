import { z } from "zod";
import { router, protectedProcedure, managerProcedure } from "../trpc";
import { shifts, shiftAssignments, openShiftEnrollments, eq, and, gte, lte, inArray } from "@crewclock/db";
import { addDays, startOfWeek } from "date-fns";

export const schedulingRouter = router({
  // Get all shifts for a given week
  getWeek: protectedProcedure
    .input(z.object({
      weekStart: z.string(), // ISO date
      locationId: z.string().uuid().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const weekEnd = new Date(input.weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      const query = ctx.db
        .select()
        .from(shifts)
        .where(
          and(
            eq(shifts.tenantId, ctx.tenantId),
            eq(shifts.scheduleWeekStart, input.weekStart),
            input.locationId ? eq(shifts.locationId, input.locationId) : undefined,
          )
        );
      return query;
    }),

  // Create a shift (manager+)
  createShift: managerProcedure
    .input(z.object({
      locationId: z.string().uuid(),
      roleId: z.string().uuid(),
      startTime: z.string().datetime(),
      endTime: z.string().datetime(),
      breakDurationMinutes: z.number().default(30),
      requiredSkillIds: z.array(z.string().uuid()).optional(),
      notes: z.string().optional(),
      assignToEmployeeId: z.string().uuid().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const weekStart = startOfWeek(new Date(input.startTime), { weekStartsOn: 1 });
      const [shift] = await ctx.db.insert(shifts).values({
        tenantId: ctx.tenantId,
        locationId: input.locationId,
        roleId: input.roleId,
        startTime: new Date(input.startTime),
        endTime: new Date(input.endTime),
        breakDurationMinutes: input.breakDurationMinutes,
        requiredSkillIds: input.requiredSkillIds,
        notes: input.notes,
        scheduleWeekStart: weekStart.toISOString().split("T")[0],
        createdBy: ctx.user.id,
      }).returning();

      // Optionally assign immediately
      if (input.assignToEmployeeId) {
        await ctx.db.insert(shiftAssignments).values({
          shiftId: shift.id,
          employeeId: input.assignToEmployeeId,
          assignedBy: ctx.user.id,
        });
      }
      return shift;
    }),

  // Update shift (manager+)
  updateShift: managerProcedure
    .input(z.object({
      id: z.string().uuid(),
      startTime: z.string().datetime().optional(),
      endTime: z.string().datetime().optional(),
      notes: z.string().optional(),
      status: z.enum(["draft", "published", "open", "filled", "cancelled"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input;
      const [updated] = await ctx.db
        .update(shifts)
        .set({ ...rest, updatedAt: new Date() })
        .where(and(eq(shifts.id, id), eq(shifts.tenantId, ctx.tenantId)))
        .returning();
      return updated;
    }),

  // Publish schedule — sets all drafts to published
  publish: managerProcedure
    .input(z.object({
      weekStart: z.string(),
      locationId: z.string().uuid().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .update(shifts)
        .set({ status: "published", publishedAt: new Date(), updatedAt: new Date() })
        .where(
          and(
            eq(shifts.tenantId, ctx.tenantId),
            eq(shifts.scheduleWeekStart, input.weekStart),
            eq(shifts.status, "draft"),
          )
        )
        .returning({ id: shifts.id });
      // TODO: trigger Ably publish event + bulk notifications via QStash
      return { published: result.length };
    }),

  // Delete shift
  deleteShift: managerProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(shifts).where(
        and(eq(shifts.id, input.id), eq(shifts.tenantId, ctx.tenantId))
      );
      return { success: true };
    }),
});
