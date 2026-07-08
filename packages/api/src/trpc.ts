import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

// Require an authenticated user, but not necessarily a tenant/membership yet —
// for flows like onboarding (creating the first tenant) and account
// restore/soft-delete, which run before a tenant exists or after it's gone.
export const authedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

// Require authenticated user
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user || !ctx.tenantId || !ctx.membership) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { ...ctx, user: ctx.user, tenantId: ctx.tenantId, membership: ctx.membership } });
});

// Require manager or above
export const managerProcedure = protectedProcedure.use(({ ctx, next }) => {
  const managerRoles = ["super_admin", "admin", "manager"];
  if (!managerRoles.includes(ctx.membership!.role)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Manager access required" });
  }
  return next({ ctx });
});

// Require admin or above
export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  const adminRoles = ["super_admin", "admin"];
  if (!adminRoles.includes(ctx.membership!.role)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});
