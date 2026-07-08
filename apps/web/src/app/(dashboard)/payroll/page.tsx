"use client";
import { startOfWeek, endOfWeek, format } from "date-fns";
import { PayrollSummary } from "@/components/payroll/summary";
import { PayPeriodSelector } from "@/components/payroll/pay-period-selector";
import { trpc } from "@/components/providers/trpc-provider";

export default function PayrollPage() {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  const { data, isLoading } = trpc.payroll.getPeriodSummary.useQuery({
    weekStart: format(weekStart, "yyyy-MM-dd"),
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <PayPeriodSelector periodLabel={`${format(weekStart, "MMM d")} – ${format(weekEnd, "MMM d, yyyy")}`} />
      <PayrollSummary
        total={data?.total ?? null}
        employeeCount={data?.employeeCount ?? 0}
        perEmployee={data?.perEmployee ?? []}
        isLoading={isLoading}
      />
    </div>
  );
}
