"use client";
import { DollarSign, Clock, AlertTriangle, Users } from "lucide-react";

function StatCard({ title, value, icon: Icon, iconColor }: { title: string; value: string; icon: React.ElementType; iconColor?: string }) {
  return (
    <div style={{ borderRadius: 16, border: "1px solid #e2e8f0", background: "white", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: "#64748b" }}>{title}</span>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon style={{ width: 16, height: 16, color: iconColor ?? "#2563eb" }} />
        </div>
      </div>
      <p style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", margin: 0 }}>{value}</p>
    </div>
  );
}

export function PayrollSummary() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
        <StatCard title="Gross pay" value="$0.00" icon={DollarSign} />
        <StatCard title="Regular hours" value="0h" icon={Clock} />
        <StatCard title="Overtime hours" value="0h" icon={Clock} iconColor="#d97706" />
        <StatCard title="Meal penalties" value="0" icon={AlertTriangle} iconColor="#ef4444" />
      </div>
      <div style={{ borderRadius: 20, border: "1px solid #e2e8f0", overflow: "hidden", background: "white" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", padding: "16px 20px" }}>
          <h2 style={{ fontWeight: 600, fontSize: 15, margin: 0 }}>Timecard summary</h2>
          <span style={{ borderRadius: 999, background: "#f1f5f9", padding: "2px 10px", fontSize: 12, fontWeight: 500, color: "#64748b" }}>0 employees</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "64px 0" }}>
          <div style={{ borderRadius: 16, background: "#f1f5f9", padding: 16 }}>
            <Users style={{ width: 32, height: 32, color: "#94a3b8" }} />
          </div>
          <p style={{ fontWeight: 500, fontSize: 14, margin: 0, color: "#374151" }}>No timecards for this period</p>
          <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>Timecards are auto-generated from approved clock events</p>
        </div>
      </div>
    </div>
  );
}
