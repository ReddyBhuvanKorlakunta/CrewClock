"use client";
import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";

const PAGE_TITLES: Record<string, string> = {
  "/schedule":  "Schedule",
  "/timeclock": "Time Clock",
  "/timecards": "Timecards",
  "/payroll":   "Payroll",
  "/leave":     "Leave",
  "/team":      "Team",
  "/reports":   "Reports",
  "/chat":      "Team Chat",
  "/ai":        "CrewAI Assistant",
};

export function TopBar() {
  const pathname = usePathname();
  const title = Object.entries(PAGE_TITLES).find(([k]) => pathname.startsWith(k))?.[1] ?? "Dashboard";

  return (
    <header
      style={{
        display: "flex", height: 56, flexShrink: 0,
        alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid #e2e8f0",
        backgroundColor: "#ffffff",
        padding: "0 24px",
      }}
    >
      <h1 style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", margin: 0 }}>{title}</h1>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button style={{ padding: 8, borderRadius: 8, border: "none", background: "none", cursor: "pointer", color: "#64748b" }} title="Search">
          <Search style={{ width: 16, height: 16 }} />
        </button>
        <button style={{ position: "relative", padding: 8, borderRadius: 8, border: "none", background: "none", cursor: "pointer", color: "#64748b" }} title="Notifications">
          <Bell style={{ width: 16, height: 16 }} />
          <span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", backgroundColor: "#ef4444", border: "2px solid white" }} />
        </button>
      </div>
    </header>
  );
}
