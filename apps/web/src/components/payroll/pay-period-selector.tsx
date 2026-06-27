"use client";
import { ChevronDown, Calendar } from "lucide-react";

export function PayPeriodSelector() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "0 0 2px" }}>Payroll</h2>
        <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>Manage timecards, run payroll, export to accounting</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button style={{ display: "flex", alignItems: "center", gap: 8, borderRadius: 10, border: "1px solid #e2e8f0", background: "white", padding: "10px 16px", fontSize: 14, fontWeight: 500, cursor: "pointer", color: "#374151", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
          <Calendar style={{ width: 16, height: 16, color: "#64748b" }} />
          Current period
          <ChevronDown style={{ width: 16, height: 16, color: "#64748b" }} />
        </button>
        <button style={{ borderRadius: 10, border: "none", background: "#2563eb", padding: "10px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", color: "white", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
          Run payroll
        </button>
      </div>
    </div>
  );
}
