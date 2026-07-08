import { router, authedProcedure } from "../trpc";
import { users, eq } from "@crewclock/db";
import { TRPCError } from "@trpc/server";

export const accountRouter = router({
  // Soft-deletes the current user's account with a 7-day restore window.
  softDelete: authedProcedure.mutation(async ({ ctx }) => {
    const now = new Date();
    const holdUntil = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    await ctx.db.update(users).set({
      accountStatus: "soft_deleted",
      deletedAt: now,
      deletionHoldUntil: holdUntil,
      updatedAt: now,
    }).where(eq(users.id, ctx.user.id));
    return { success: true };
  }),

  // Restores a soft-deleted account, provided it's still within the hold window.
  restore: authedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user.accountStatus !== "soft_deleted") {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Account is not deleted" });
    }
    if (ctx.user.deletionHoldUntil && ctx.user.deletionHoldUntil < new Date()) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Restore window has expired" });
    }
    await ctx.db.update(users).set({
      accountStatus: "active",
      deletedAt: null,
      deletionHoldUntil: null,
      updatedAt: new Date(),
    }).where(eq(users.id, ctx.user.id));
    return { success: true };
  }),

  getCurrent: authedProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),
});
