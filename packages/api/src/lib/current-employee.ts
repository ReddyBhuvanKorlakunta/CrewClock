import { TRPCError } from "@trpc/server";
import { employees, eq, and } from "@crewclock/db";
import type { AuthenticatedContext } from "../context";

export async function getCurrentEmployee(ctx: AuthenticatedContext) {
  const employee = await ctx.db.query.employees.findFirst({
    where: and(eq(employees.userId, ctx.user.id), eq(employees.tenantId, ctx.tenantId)),
  });
  if (!employee) {
    throw new TRPCError({ code: "NOT_FOUND", message: "No employee record for this tenant" });
  }
  return employee;
}
