import { router } from "./trpc";
import { schedulingRouter } from "./routers/scheduling";
import { timeclockRouter } from "./routers/timeclock";
import { timecardsRouter } from "./routers/timecards";
import { aiRouter } from "./routers/ai";
import { safetyRouter } from "./routers/safety";
import { accountRouter } from "./routers/account";
import { tenantsRouter } from "./routers/tenants";

export const appRouter = router({
  scheduling: schedulingRouter,
  timeclock: timeclockRouter,
  timecards: timecardsRouter,
  ai: aiRouter,
  safety: safetyRouter,
  account: accountRouter,
  tenants: tenantsRouter,
  // Additional routers wired in Sprint 4+:
  // employees: employeesRouter,
  // payroll: payrollRouter,
  // leave: leaveRouter,
  // openShifts: openShiftsRouter,
  // reports: reportsRouter,
  // chat: chatRouter,
  // admin: adminRouter,
});

export type AppRouter = typeof appRouter;
export type { Context, AuthenticatedContext } from "./context";
