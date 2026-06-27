import { z } from "zod";
import { router, protectedProcedure, managerProcedure } from "../trpc";
import { timecards, auditLogs, eq, and } from "@crewclock/db";

export const timecardsRouter = router({
  list: protectedProcedure
    .input(z.object({
      payPeriodId: z.string().uuid().optional(),
      status: z.enum(["draft", "pending", "approved", "locked", "disputed"]).optional(),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.timecards.findMany({
        where: and(
          eq(timecards.tenantId, ctx.tenantId),
          input.payPeriodId ? eq(timecards.payPeriodId, input.payPeriodId) : undefined,
          input.status ? eq(timecards.status, input.status) : undefined,
        ),
      });
    }),

  submit: protectedProcedure
    .input(z.object({ id: z.string().uuid(), notes: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(timecards)
        .set({ status: "pending", submittedAt: new Date(), employeeNotes: input.notes, updatedAt: new Date() })
        .where(and(eq(timecards.id, input.id), eq(timecards.tenantId, ctx.tenantId)))
        .returning();
      return updated;
    }),

  approve: managerProcedure
    .input(z.object({ id: z.string().uuid(), notes: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const [before] = await ctx.db.select().from(timecards).where(eq(timecards.id, input.id));
      const [updated] = await ctx.db
        .update(timecards)
        .set({
          status: "approved",
          approvedBy: ctx.user.id,
          approvedAt: new Date(),
          managerNotes: input.notes,
          updatedAt: new Date(),
        })
        .where(and(eq(timecards.id, input.id), eq(timecards.tenantId, ctx.tenantId)))
        .returning();
      // Immutable audit trail
      await ctx.db.insert(auditLogs).values({
        tenantId: ctx.tenantId,
        userId: ctx.user.id,
        action: "timecard.approved",
        resourceType: "timecard",
        resourceId: input.id,
        beforeState: JSON.stringify(before),
        afterState: JSON.stringify(updated),
      });
      return updated;
    }),

  reject: managerProcedure
    .input(z.object({ id: z.string().uuid(), reason: z.string().min(1, "Reason required") }))
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(timecards)
        .set({ status: "disputed", managerNotes: input.reason, updatedAt: new Date() })
        .where(and(eq(timecards.id, input.id), eq(timecards.tenantId, ctx.tenantId)))
        .returning();
      await ctx.db.insert(auditLogs).values({
        tenantId: ctx.tenantId,
        userId: ctx.user.id,
        action: "timecard.rejected",
        resourceType: "timecard",
        resourceId: input.id,
        afterState: JSON.stringify({ reason: input.reason }),
      });
      return updated;
    }),
});
