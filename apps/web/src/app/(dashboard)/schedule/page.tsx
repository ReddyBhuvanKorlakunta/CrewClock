import { Suspense } from "react";
import { ScheduleWeekView } from "@/components/schedule/week-view";
import { ScheduleToolbar } from "@/components/schedule/toolbar";

export const metadata = { title: "Schedule" };

function ScheduleSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#f1f5f9" }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ height: 14, width: 128, borderRadius: 4, background: "#f1f5f9" }} />
            <div style={{ height: 12, width: 96, borderRadius: 4, background: "#f1f5f9" }} />
          </div>
          <div style={{ height: 32, width: 112, borderRadius: 8, background: "#f1f5f9" }} />
        </div>
      ))}
    </div>
  );
}

export default function SchedulePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <ScheduleToolbar />
      <Suspense fallback={<ScheduleSkeleton />}>
        <ScheduleWeekView />
      </Suspense>
    </div>
  );
}
