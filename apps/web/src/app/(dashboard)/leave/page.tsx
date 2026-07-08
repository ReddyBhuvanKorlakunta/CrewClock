"use client";
import { useState } from "react";
import { Plus, Calendar, Check, X } from "lucide-react";
import { trpc } from "@/components/providers/trpc-provider";

type Tab = "pending" | "approved" | "all";

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending: { bg: "#fef9c3", color: "#854d0e" },
  approved: { bg: "#d1fae5", color: "#065f46" },
  rejected: { bg: "#fee2e2", color: "#991b1b" },
  cancelled: { bg: "#f1f5f9", color: "#475569" },
};

export default function LeavePage() {
  const [tab, setTab] = useState<Tab>("pending");
  const [showForm, setShowForm] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");

  const utils = trpc.useUtils();
  const { data: categories } = trpc.leave.listCategories.useQuery();
  const { data: requests, isLoading } = trpc.leave.list.useQuery({
    status: tab === "all" ? undefined : tab,
  });
  const createRequest = trpc.leave.create.useMutation({
    onSuccess: () => {
      utils.leave.list.invalidate();
      setShowForm(false);
      setCategoryId("");
      setStartDate("");
      setEndDate("");
      setNotes("");
    },
  });
  const review = trpc.leave.review.useMutation({
    onSuccess: () => utils.leave.list.invalidate(),
  });

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
        <button
          onClick={() => setShowForm(v => !v)}
          style={{ display: "flex", alignItems: "center", gap: 8, borderRadius: 10, border: "none", background: "#2563eb", padding: "10px 16px", fontSize: 14, fontWeight: 500, cursor: "pointer", color: "white" }}
        >
          <Plus style={{ width: 16, height: 16 }} /> Request leave
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!categoryId || !startDate || !endDate) return;
            createRequest.mutate({ categoryId, startDate, endDate, notes: notes || undefined });
          }}
          style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", borderRadius: 16, border: "1px solid #e2e8f0", background: "#f8fafc", padding: 16 }}
        >
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 4 }}>Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }}
            >
              <option value="">Select…</option>
              {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 4 }}>Start date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 4 }}>End date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }} />
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 4 }}>Notes</label>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, boxSizing: "border-box" }} />
          </div>
          <button type="submit" disabled={createRequest.isPending} style={{ borderRadius: 8, border: "none", background: "#2563eb", padding: "9px 16px", fontSize: 13, fontWeight: 600, color: "white", cursor: "pointer" }}>
            {createRequest.isPending ? "Submitting…" : "Submit"}
          </button>
        </form>
      )}

      {isLoading ? (
        <div style={{ padding: "64px 0", textAlign: "center", fontSize: 13, color: "#94a3b8" }}>Loading…</div>
      ) : !requests || requests.length === 0 ? (
        <div style={{ borderRadius: 20, border: "1px solid #e2e8f0", background: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "64px 0" }}>
          <div style={{ borderRadius: 16, background: "#f1f5f9", padding: 20 }}>
            <Calendar style={{ width: 40, height: 40, color: "#94a3b8" }} />
          </div>
          <p style={{ fontWeight: 600, fontSize: 15, margin: 0, color: "#374151" }}>No leave requests</p>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Leave requests for your team will appear here</p>
        </div>
      ) : (
        <div style={{ borderRadius: 20, border: "1px solid #e2e8f0", background: "white", overflow: "hidden" }}>
          {requests.map((r) => {
            const colors = STATUS_COLORS[r.status ?? "pending"] ?? STATUS_COLORS.pending!;
            return (
              <div key={r.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid #f1f5f9" }}>
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{r.startDate} – {r.endDate}</p>
                  {r.notes && <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94a3b8" }}>{r.notes}</p>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ borderRadius: 999, background: colors.bg, color: colors.color, padding: "3px 10px", fontSize: 12, fontWeight: 600, textTransform: "capitalize" }}>
                    {r.status}
                  </span>
                  {r.status === "pending" && (
                    <>
                      <button onClick={() => review.mutate({ id: r.id, decision: "approved" })} style={{ border: "none", background: "#d1fae5", borderRadius: 8, padding: 6, cursor: "pointer" }}>
                        <Check style={{ width: 14, height: 14, color: "#065f46" }} />
                      </button>
                      <button onClick={() => review.mutate({ id: r.id, decision: "rejected" })} style={{ border: "none", background: "#fee2e2", borderRadius: 8, padding: 6, cursor: "pointer" }}>
                        <X style={{ width: 14, height: 14, color: "#991b1b" }} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
