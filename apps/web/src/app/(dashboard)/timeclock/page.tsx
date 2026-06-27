import { ClockWidget } from "@/components/timeclock/clock-widget";
import { LiveStatusGrid } from "@/components/timeclock/live-status-grid";

export const metadata = { title: "Time Clock" };

export default function TimeClockPage() {
  return (
    <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
      <div style={{ minWidth: 0 }}>
        <ClockWidget />
      </div>
      <div style={{ minWidth: 0, gridColumn: "span 2" }}>
        <LiveStatusGrid />
      </div>
    </div>
  );
}
