"use client";
import { useState } from "react";
import { Plus, Calendar } from "lucide-react";

type Tab = "pending" | "approved" | "all";

export default function LeavePage() {
  const [tab, setTab] = useState<Tab>("pending");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", borderRadius: 10, border: "1px solid #e2e8f0", padding: 3, gap: 3, background: "#f8fafc" }}>
          {(["pending", "approved", "all"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{ padding: "6px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer", textTransform: "capitalize", background: tab === t ? "#2563eb" : "transparent", color: tab === t ? "white" : "#475569", transition: "all 0.15s" }}
            >
              {t}
            </button>
          ))}
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 8, borderRadius: 10, border: "none", background: "#2563eb", padding: "10px 16px", fontSize: 14, fontWeight: 500, cursor: "pointer", color: "white" }}>
          <Plus style={{ width: 16, height: 16 }} /> Request leave
        </button>
      </div>

      <div style={{ borderRadius: 20, border: "1px solid #e2e8f0", background: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "64px 0" }}>
        <div style={{ borderRadius: 16, background: "#f1f5f9", padding: 20 }}>
          <Calendar style={{ width: 40, height: 40, color: "#94a3b8" }} />
        </div>
        <p style={{ fontWeight: 600, fontSize: 15, margin: 0, color: "#374151" }}>No leave requests</p>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Leave requests for your team will appear here</p>
      </div>
    </div>
  );
}
