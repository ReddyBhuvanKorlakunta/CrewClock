"use client";
import { useState } from "react";
import { format, startOfWeek, addDays } from "date-fns";
import { trpc } from "@/components/providers/trpc-provider";
import { Users } from "lucide-react";

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 06:00 – 22:00
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function ScheduleWeekView() {
  const [weekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const { data: shifts = [] } = trpc.scheduling.getWeek.useQuery({
    weekStart: format(weekStart, "yyyy-MM-dd"),
  });

  return (
    <div style={{ borderRadius: 20, border: "1px solid #e2e8f0", overflow: "hidden", background: "white" }}>
      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "64px repeat(7, 1fr)", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
        <div style={{ borderRight: "1px solid #e2e8f0", padding: 12 }} />
        {DAYS.map((d, i) => {
          const date = addDays(weekStart, i);
          const dateStr = format(date, "yyyy-MM-dd");
          const isToday = dateStr === todayStr;
          return (
            <div key={d} style={{ padding: "10px 8px", textAlign: "center", borderRight: i < 6 ? "1px solid #e2e8f0" : "none", background: isToday ? "#eff6ff" : "transparent" }}>
              <p style={{ fontSize: 11, fontWeight: 500, color: "#94a3b8", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{d}</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: isToday ? "#2563eb" : "#0f172a", margin: 0 }}>{format(date, "d")}</p>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 280px)" }}>
        {HOURS.map(h => (
          <div key={h} style={{ display: "grid", gridTemplateColumns: "64px repeat(7, 1fr)", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ borderRight: "1px solid #e2e8f0", padding: "10px 8px 10px 0", textAlign: "right", fontSize: 11, color: "#94a3b8", fontFamily: "monospace", fontWeight: 500 }}>
              {h.toString().padStart(2, "0")}:00
            </div>
            {DAYS.map((d, i) => (
              <div
                key={d}
                style={{ minHeight: 52, borderRight: i < 6 ? "1px solid #f1f5f9" : "none", padding: 2, cursor: "pointer", transition: "background 0.1s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #e2e8f0", background: "#f8fafc", padding: "8px 16px" }}>
        <p style={{ fontSize: 12, color: "#64748b", margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
          <Users style={{ width: 14, height: 14 }} /> {shifts.length} shift{shifts.length !== 1 ? "s" : ""} this week
        </p>
        <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>Click any cell to add a shift</p>
      </div>
    </div>
  );
}
