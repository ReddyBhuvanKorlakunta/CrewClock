"use client";
import { trpc } from "@/components/providers/trpc-provider";
import { format } from "date-fns";

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  draft: { bg: "#f1f5f9", color: "#475569" },
  submitted: { bg: "#dbeafe", color: "#1d4ed8" },
  approved: { bg: "#d1fae5", color: "#065f46" },
  rejected: { bg: "#fee2e2", color: "#991b1b" },
};

export default function TimecardsPage() {
  const { data, isLoading } = trpc.timecards.list.useQuery({});

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ height: 64, borderRadius: 12, background: "#f1f5f9" }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ borderRadius: 20, border: "1px solid #e2e8f0", overflow: "hidden", background: "white" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
            {["Employee", "Period", "Regular", "Overtime", "Total Pay", "Status", ""].map(h => (
              <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#94a3b8" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(data ?? []).length === 0 ? (
            <tr>
              <td colSpan={7} style={{ padding: 48, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
                No timecards yet — timecards are generated from approved clock events
              </td>
            </tr>
          ) : (data ?? []).map((tc: {
            id: string;
            employeeName?: string;
            periodEnd?: string;
            totalRegularMinutes?: number;
            totalOtMinutes?: number;
            totalRegularPay?: string;
            totalOtPay?: string;
            status?: string;
          }) => {
            const status = tc.status ?? "draft";
            const colors = STATUS_COLORS[status] ?? STATUS_COLORS.draft;
            return (
              <tr key={tc.id} style={{ borderBottom: "1px solid #f1f5f9" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "14px 16px", fontWeight: 500 }}>{tc.employeeName ?? "—"}</td>
                <td style={{ padding: "14px 16px", color: "#64748b" }}>{tc.periodEnd ? format(new Date(tc.periodEnd), "MMM d, yyyy") : "—"}</td>
                <td style={{ padding: "14px 16px" }}>{tc.totalRegularMinutes ? `${Math.round(tc.totalRegularMinutes / 60)}h` : "—"}</td>
                <td style={{ padding: "14px 16px", color: "#d97706", fontWeight: 500 }}>{tc.totalOtMinutes ? `${Math.round(tc.totalOtMinutes / 60)}h` : "—"}</td>
                <td style={{ padding: "14px 16px", fontWeight: 600 }}>
                  ${(Number(tc.totalRegularPay ?? 0) + Number(tc.totalOtPay ?? 0)).toFixed(2)}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ borderRadius: 999, padding: "2px 10px", fontSize: 12, fontWeight: 500, ...colors }}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <button style={{ fontSize: 12, color: "#2563eb", fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}>
                    Review
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
