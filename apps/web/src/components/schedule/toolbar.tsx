"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Eye, Wand2 } from "lucide-react";
import { format, startOfWeek, addWeeks, subWeeks } from "date-fns";

export function ScheduleToolbar() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={() => setWeekStart(w => subWeeks(w, 1))} style={iconBtnStyle}>
          <ChevronLeft style={{ width: 16, height: 16 }} />
        </button>
        <span style={{ minWidth: 180, textAlign: "center", fontSize: 14, fontWeight: 500 }}>
          {format(weekStart, "MMM d")} – {format(weekEnd, "MMM d, yyyy")}
        </span>
        <button onClick={() => setWeekStart(w => addWeeks(w, 1))} style={iconBtnStyle}>
          <ChevronRight style={{ width: 16, height: 16 }} />
        </button>
        <button onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))} style={{ ...iconBtnStyle, padding: "6px 12px", fontSize: 12 }}>
          Today
        </button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button style={{ display: "flex", alignItems: "center", gap: 6, borderRadius: 8, border: "1px solid #e2e8f0", padding: "6px 12px", fontSize: 12, fontWeight: 500, background: "white", cursor: "pointer", color: "#374151" }}>
          <Eye style={{ width: 14, height: 14 }} /> Preview
        </button>
        <button style={{ display: "flex", alignItems: "center", gap: 6, borderRadius: 8, border: "1px solid #bfdbfe", padding: "6px 12px", fontSize: 12, fontWeight: 500, background: "#eff6ff", cursor: "pointer", color: "#2563eb" }}>
          <Wand2 style={{ width: 14, height: 14 }} /> AI Fill
        </button>
        <button style={{ display: "flex", alignItems: "center", gap: 6, borderRadius: 8, border: "none", padding: "6px 16px", fontSize: 12, fontWeight: 600, background: "#2563eb", cursor: "pointer", color: "white" }}>
          <Plus style={{ width: 14, height: 14 }} /> Add shift
        </button>
      </div>
    </div>
  );
}

const iconBtnStyle: React.CSSProperties = {
  borderRadius: 8, border: "1px solid #e2e8f0", padding: "6px 8px",
  background: "white", cursor: "pointer", color: "#374151",
  display: "flex", alignItems: "center", justifyContent: "center",
};
