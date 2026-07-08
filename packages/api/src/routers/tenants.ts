import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, authedProcedure, protectedProcedure } from "../trpc";
import { tenants, tenantMemberships, users, eq } from "@crewclock/db";

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const tenantsRouter = router({
  // Creates the caller's first tenant + admin membership, replacing the old
  // client-side Clerk `createOrganization`/`setActive` call in the onboarding
  // flow. This is the only place a tenant gets created — no more implicit
  // tenant creation from an external org id.
  createForCurrentUser: authedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const [tenant] = await ctx.db.insert(tenants).values({
        name: input.name,
        slug: slugify(input.name) || crypto.randomUUID(),
        plan: "free",
      }).returning();
      if (!tenant) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create workspace" });

      await ctx.db.insert(tenantMemberships).values({
        tenantId: tenant.id,
        userId: ctx.user.id,
        role: "admin",
        isActive: true,
      });

      await ctx.db.update(users).set({ onboardingCompleted: true, updatedAt: new Date() })
        .where(eq(users.id, ctx.user.id));

      return tenant;
    }),

  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.tenants.findFirst({ where: eq(tenants.id, ctx.tenantId) });
  }),
});
