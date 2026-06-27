"use client";
import { useState } from "react";
import { Users, UserPlus, Search } from "lucide-react";

export default function TeamPage() {
  const [search, setSearch] = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ position: "relative" }}>
          <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#94a3b8" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search team members…"
            style={{ paddingLeft: 40, paddingRight: 16, paddingTop: 10, paddingBottom: 10, borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, background: "#f8fafc", outline: "none", minWidth: 260, color: "#0f172a" }}
          />
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 8, borderRadius: 10, border: "none", background: "#2563eb", padding: "10px 16px", fontSize: 14, fontWeight: 500, cursor: "pointer", color: "white" }}>
          <UserPlus style={{ width: 16, height: 16 }} /> Invite member
        </button>
      </div>

      <div style={{ borderRadius: 20, border: "1px solid #e2e8f0", background: "white", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", padding: "16px 24px" }}>
          <h2 style={{ fontWeight: 600, fontSize: 15, margin: 0 }}>Team members</h2>
          <span style={{ borderRadius: 999, background: "#f1f5f9", padding: "2px 10px", fontSize: 12, fontWeight: 500, color: "#64748b" }}>0 active</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "64px 0" }}>
          <div style={{ borderRadius: 20, background: "#f1f5f9", padding: 16 }}>
            <Users style={{ width: 32, height: 32, color: "#94a3b8" }} />
          </div>
          <p style={{ fontWeight: 500, fontSize: 14, margin: 0, color: "#374151" }}>No team members yet</p>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Invite your crew to get started</p>
          <button style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, borderRadius: 10, border: "none", background: "#2563eb", padding: "10px 20px", fontSize: 14, fontWeight: 500, cursor: "pointer", color: "white" }}>
            <UserPlus style={{ width: 16, height: 16 }} /> Send invite
          </button>
        </div>
      </div>
    </div>
  );
}
