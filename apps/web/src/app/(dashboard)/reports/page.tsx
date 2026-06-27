"use client";
import { BarChart3, Download, TrendingUp, Clock, DollarSign, Users } from "lucide-react";

function StatCard({ title, value, icon: Icon }: { title: string; value: string; icon: React.ElementType }) {
  return (
    <div style={{ borderRadius: 16, border: "1px solid #e2e8f0", background: "white", padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: "#64748b" }}>{title}</span>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon style={{ width: 16, height: 16, color: "#2563eb" }} />
        </div>
      </div>
      <p style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", margin: 0 }}>{value}</p>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
        <StatCard title="Total hours this week" value="0h" icon={Clock} />
        <StatCard title="Labor cost this week" value="$0" icon={DollarSign} />
        <StatCard title="Active employees" value="0" icon={Users} />
        <StatCard title="Scheduled vs. worked" value="—" icon={TrendingUp} />
      </div>

      <div style={{ borderRadius: 20, border: "1px solid #e2e8f0", background: "white", padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontWeight: 600, fontSize: 15, margin: 0 }}>Hours by employee</h2>
          <button style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b", background: "none", border: "none", cursor: "pointer" }}>
            <Download style={{ width: 14, height: 14 }} /> Export CSV
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "64px 0", textAlign: "center" }}>
          <div>
            <BarChart3 style={{ margin: "0 auto 12px", width: 40, height: 40, color: "#cbd5e1" }} />
            <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>No data yet — data appears once shifts are completed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
