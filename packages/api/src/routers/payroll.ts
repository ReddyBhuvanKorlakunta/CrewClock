import { z } from "zod";
import { router, protectedProcedure, managerProcedure } from "../trpc";
import { clockEvents, employees, users, eq, and, gte, lte, inArray } from "@crewclock/db";
import { startOfWeek, endOfWeek, format } from "date-fns";
import { calculatePayroll, type ShiftRecord } from "@crewclock/core";
import { getCurrentEmployee } from "../lib/current-employee";
import type { ClockEvent } from "@crewclock/db";

// Pairs a flat list of clock events (clock_in/out, break_start/end) into one
// ShiftRecord per calendar day. Days with an unpaired clock_in (no matching
// clock_out yet — e.g. still clocked in) are skipped rather than guessed at.
function eventsToShiftRecords(events: ClockEvent[]): ShiftRecord[] {
  const byDate = new Map<string, ClockEvent[]>();
  for (const e of events) {
    const date = format(new Date(e.recordedAt), "yyyy-MM-dd");
    if (!byDate.has(date)) byDate.set(date, []);
    byDate.get(date)!.push(e);
  }

  const records: ShiftRecord[] = [];
  for (const [date, dayEvents] of [...byDate.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const sorted = [...dayEvents].sort(
      (a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime(),
    );
    const clockIn = sorted.find((e) => e.eventType === "clock_in");
    const clockOut = [...sorted].reverse().find((e) => e.eventType === "clock_out");
    if (!clockIn || !clockOut) continue; // incomplete day, skip

    const regularMinutes = Math.max(
      0,
      Math.round((new Date(clockOut.recordedAt).getTime() - new Date(clockIn.recordedAt).getTime()) / 60_000),
    );

    let breakMinutes = 0;
    const breakStarts = sorted.filter((e) => e.eventType === "break_start");
    const breakEnds = sorted.filter((e) => e.eventType === "break_end");
    const pairs = Math.min(breakStarts.length, breakEnds.length);
    for (let i = 0; i < pairs; i++) {
      breakMinutes += Math.max(
        0,
        Math.round((new Date(breakEnds[i]!.recordedAt).getTime() - new Date(breakStarts[i]!.recordedAt).getTime()) / 60_000),
      );
    }

    records.push({
      date,
      regularMinutes,
      breakMinutes,
      mealBreakTaken: breakMinutes >= 30,
      mealBreakDurationMinutes: breakMinutes,
    });
  }
  return records;
}

async function summarizeEmployee(
  ctx: { db: import("@crewclock/db").DB },
  employee: { id: string; hourlyRate: string | null; overtimeRateMultiplier: string | null },
  weekStart: Date,
  weekEnd: Date,
) {
  const events = await ctx.db.query.clockEvents.findMany({
    where: and(
      eq(clockEvents.employeeId, employee.id),
      gte(clockEvents.recordedAt, weekStart),
      lte(clockEvents.recordedAt, weekEnd),
    ),
  });
  const shifts = eventsToShiftRecords(events);
  return calculatePayroll({
    jurisdiction: "CA",
    hourlyRate: Number(employee.hourlyRate ?? 0),
    otMultiplier: Number(employee.overtimeRateMultiplier ?? 1.5),
    doubleOtMultiplier: 2,
    shifts,
  });
}

export const payrollRouter = router({
  // Current employee's payroll summary for the current week — powers mobile
  // Timesheets and can back a "my pay" view. Computed on the fly from
  // clockEvents since nothing currently rolls events up into a timecards row.
  getMyCurrentSummary: protectedProcedure.query(async ({ ctx }) => {
    const employee = await getCurrentEmployee(ctx);
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
    return summarizeEmployee(ctx, employee, weekStart, weekEnd);
  }),

  // Tenant-wide payroll summary for a given week — powers the web Payroll page.
  getPeriodSummary: managerProcedure
    .input(z.object({ weekStart: z.string() })) // ISO date, Monday
    .query(async ({ ctx, input }) => {
      const weekStart = new Date(input.weekStart);
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      const tenantEmployees = await ctx.db.query.employees.findMany({
        where: and(eq(employees.tenantId, ctx.tenantId), eq(employees.status, "active")),
      });
      const userRows = tenantEmployees.length
        ? await ctx.db.query.users.findMany({
            where: inArray(users.id, tenantEmployees.map((e) => e.userId)),
          })
        : [];
      const nameByUserId = new Map(userRows.map((u) => [u.id, `${u.firstName} ${u.lastName}`.trim() || u.email]));

      const perEmployee = await Promise.all(
        tenantEmployees.map(async (employee) => ({
          employeeId: employee.id,
          employeeName: nameByUserId.get(employee.userId) ?? "Unknown",
          result: await summarizeEmployee(ctx, employee, weekStart, weekEnd),
        })),
      );

      const total = perEmployee.reduce(
        (acc, { result }) => ({
          regularPay: acc.regularPay + result.regularPay,
          otPay: acc.otPay + result.otPay,
          doubleOtPay: acc.doubleOtPay + result.doubleOtPay,
          mealPenaltyPay: acc.mealPenaltyPay + result.mealPenaltyPay,
          grossPay: acc.grossPay + result.grossPay,
          regularMinutes: acc.regularMinutes + result.regularMinutes,
          otMinutes: acc.otMinutes + result.otMinutes,
        }),
        { regularPay: 0, otPay: 0, doubleOtPay: 0, mealPenaltyPay: 0, grossPay: 0, regularMinutes: 0, otMinutes: 0 },
      );

      return { employeeCount: tenantEmployees.length, total, perEmployee };
    }),
});
