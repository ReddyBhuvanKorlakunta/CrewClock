import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { emergencyContacts, checkInLogs, eq, and } from "@crewclock/db";

export const safetyRouter = router({
  listContacts: protectedProcedure
    .input(z.object({ employeeId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.emergencyContacts.findMany({
        where: and(
          eq(emergencyContacts.tenantId, ctx.tenantId),
          eq(emergencyContacts.employeeId, input.employeeId),
        ),
      });
    }),

  addContact: protectedProcedure
    .input(z.object({
      employeeId: z.string().uuid(),
      fullName: z.string().min(1),
      relationship: z.enum(["spouse", "parent", "child", "sibling", "friend", "other"]),
      phone: z.string().optional(),
      email: z.string().email().optional(),
      priorityTier: z.number().int().min(1).default(1),
    }).refine(v => v.phone || v.email, { message: "Provide at least a phone or email" }))
    .mutation(async ({ ctx, input }) => {
      const [contact] = await ctx.db.insert(emergencyContacts).values({
        tenantId: ctx.tenantId,
        ...input,
      }).returning();
      return contact;
    }),

  removeContact: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(emergencyContacts).where(and(
        eq(emergencyContacts.id, input.id),
        eq(emergencyContacts.tenantId, ctx.tenantId),
      ));
      return { success: true };
    }),

  listCheckIns: protectedProcedure
    .input(z.object({ employeeId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.checkInLogs.findMany({
        where: and(
          eq(checkInLogs.tenantId, ctx.tenantId),
          eq(checkInLogs.employeeId, input.employeeId),
        ),
      });
    }),

  respondToCheckIn: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
      status: z.enum(["safe", "help_requested"]),
      lat: z.string().optional(),
      lng: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(checkInLogs)
        .set({
          status: input.status,
          respondedAt: new Date(),
          lat: input.lat,
          lng: input.lng,
        })
        .where(and(eq(checkInLogs.id, input.id), eq(checkInLogs.tenantId, ctx.tenantId)))
        .returning();
      return updated;
    }),
});
