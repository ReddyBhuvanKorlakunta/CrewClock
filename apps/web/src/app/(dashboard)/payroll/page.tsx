import { PayrollSummary } from "@/components/payroll/summary";
import { PayPeriodSelector } from "@/components/payroll/pay-period-selector";

export const metadata = { title: "Payroll" };

export default function PayrollPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <PayPeriodSelector />
      <PayrollSummary />
    </div>
  );
}
