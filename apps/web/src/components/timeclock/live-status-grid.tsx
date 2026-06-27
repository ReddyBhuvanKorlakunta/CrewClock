"use client";
import { trpc } from "@/components/providers/trpc-provider";
import { format } from "date-fns";
import { RefreshCw } from "lucide-react";

export function LiveStatusGrid() {
  const { data, isLoading, refetch } = trpc.timeclock.getLiveStatus.useQuery({}, {
    refetchInterval: 30_000,
  });

  return (
    <div style={{ borderRadius: 20, border: "1px solid #e2e8f0", background: "white", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", padding: "16px 20px" }}>
        <h2 style={{ fontWeight: 600, fontSize: 15, margin: 0 }}>Live crew status</h2>
        <button
          onClick={() => refetch()}
          title="Refresh"
          style={{ padding: 6, borderRadius: 8, border: "none", background: "none", cursor: "pointer", color: "#64748b" }}
        >
          <RefreshCw style={{ width: 16, height: 16, animation: isLoading ? "spin 1s linear infinite" : "none" }} />
        </button>
      </div>

      {isLoading ? (
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#f1f5f9" }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ height: 14, width: 128, borderRadius: 4, background: "#f1f5f9" }} />
                <div style={{ height: 12, width: 80, borderRadius: 4, background: "#f1f5f9" }} />
              </div>
            </div>
          ))}
        </div>
      ) : (data?.length ?? 0) === 0 ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 0", fontSize: 14, color: "#94a3b8" }}>
          No active clock-ins today
        </div>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {(data ?? []).map((emp: {
            employeeId: string;
            name?: string;
            status: string;
            lastEventAt?: string;
          }) => (
            <li key={emp.employeeId} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 20px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ position: "relative", width: 40, height: 40, borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#2563eb", flexShrink: 0 }}>
                {emp.name?.slice(0, 2).toUpperCase() ?? "??"}
                <span style={{ position: "absolute", bottom: -2, right: -2, width: 12, height: 12, borderRadius: "50%", border: "2px solid white", background: emp.status === "clock_in" ? "#10b981" : "#94a3b8" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 500, margin: "0 0 2px" }}>{emp.name ?? "Unknown"}</p>
                <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
                  {emp.status === "clock_in" ? "Clocked in" : "On break"} · {emp.lastEventAt ? format(new Date(emp.lastEventAt), "h:mm a") : "—"}
                </p>
              </div>
              <span style={{ borderRadius: 999, padding: "2px 10px", fontSize: 12, fontWeight: 500, background: emp.status === "clock_in" ? "#d1fae5" : "#fef3c7", color: emp.status === "clock_in" ? "#065f46" : "#92400e" }}>
                {emp.status === "clock_in" ? "Working" : "Break"}
              </span>
            </li>
          ))}
        </ul>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
