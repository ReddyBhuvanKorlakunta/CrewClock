import { z } from "zod";
import { router, protectedProcedure, managerProcedure } from "../trpc";
import { leaveCategories, leaveRequests, eq, and } from "@crewclock/db";
import { getCurrentEmployee } from "../lib/current-employee";

const statusEnum = z.enum(["pending", "approved", "rejected", "cancelled"]);

export const leaveRouter = router({
  listCategories: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.leaveCategories.findMany({
      where: and(eq(leaveCategories.tenantId, ctx.tenantId), eq(leaveCategories.isActive, true)),
    });
  }),

  // Current employee's own leave requests.
  listMine: protectedProcedure
    .input(z.object({ status: statusEnum.optional() }).optional())
    .query(async ({ ctx, input }) => {
      const employee = await getCurrentEmployee(ctx);
      return ctx.db.query.leaveRequests.findMany({
        where: and(
          eq(leaveRequests.tenantId, ctx.tenantId),
          eq(leaveRequests.employeeId, employee.id),
          input?.status ? eq(leaveRequests.status, input.status) : undefined,
        ),
      });
    }),

  // Tenant-wide leave requests — powers the web Leave page's manager view.
  list: managerProcedure
    .input(z.object({ status: statusEnum.optional() }).optional())
    .query(async ({ ctx, input }) => {
      return ctx.db.query.leaveRequests.findMany({
        where: and(
          eq(leaveRequests.tenantId, ctx.tenantId),
          input?.status ? eq(leaveRequests.status, input.status) : undefined,
        ),
      });
    }),

  create: protectedProcedure
    .input(z.object({
      categoryId: z.string().uuid(),
      startDate: z.string(), // YYYY-MM-DD
      endDate: z.string(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const employee = await getCurrentEmployee(ctx);
      const [request] = await ctx.db.insert(leaveRequests).values({
        tenantId: ctx.tenantId,
        employeeId: employee.id,
        categoryId: input.categoryId,
        startDate: input.startDate,
        endDate: input.endDate,
        notes: input.notes,
        status: "pending",
      }).returning();
      return request;
    }),

  review: managerProcedure
    .input(z.object({
      id: z.string().uuid(),
      decision: z.enum(["approved", "rejected"]),
      managerNotes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(leaveRequests)
        .set({
          status: input.decision,
          managerNotes: input.managerNotes,
          reviewedBy: ctx.user.id,
          reviewedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(and(eq(leaveRequests.id, input.id), eq(leaveRequests.tenantId, ctx.tenantId)))
        .returning();
      return updated;
    }),
});
