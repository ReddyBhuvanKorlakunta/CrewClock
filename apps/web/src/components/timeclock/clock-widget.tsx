"use client";
import { useState, useEffect } from "react";
import { Clock, MapPin, Loader2, CheckCircle, XCircle } from "lucide-react";
import { trpc } from "@/components/providers/trpc-provider";
import { format } from "date-fns";

type ClockState = "idle" | "clocking" | "clocked-in" | "error";

export function ClockWidget() {
  const [now, setNow] = useState(new Date());
  const [state, setState] = useState<ClockState>("idle");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const clockIn = trpc.timeclock.clockIn.useMutation({
    onMutate: () => setState("clocking"),
    onSuccess: () => setState("clocked-in"),
    onError: () => setState("error"),
  });

  const clockOut = trpc.timeclock.clockOut.useMutation({
    onMutate: () => setState("clocking"),
    onSuccess: () => setState("idle"),
    onError: () => setState("error"),
  });

  function getPosition(): Promise<GeolocationPosition> {
    return new Promise((res, rej) =>
      navigator.geolocation.getCurrentPosition(res, rej, { timeout: 10_000 })
    );
  }

  async function handleClockIn() {
    try {
      const pos = await getPosition();
      setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      clockIn.mutate({ recordedAt: new Date().toISOString(), latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracyMeters: pos.coords.accuracy });
    } catch {
      clockIn.mutate({ recordedAt: new Date().toISOString(), latitude: undefined, longitude: undefined, accuracyMeters: undefined });
    }
  }

  const isIn = state === "clocked-in";

  return (
    <div style={{ borderRadius: 20, border: "1px solid #e2e8f0", background: "white", padding: 24, textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 }}>
        <Clock style={{ width: 20, height: 20, color: "#2563eb" }} />
        <span style={{ fontWeight: 600, fontSize: 15 }}>Time Clock</span>
      </div>

      {/* Live clock */}
      <p style={{ fontFamily: "monospace", fontSize: 52, fontWeight: 700, letterSpacing: "-1px", color: "#0f172a", margin: "0 0 4px" }}>
        {format(now, "HH:mm:ss")}
      </p>
      <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>{format(now, "EEEE, MMMM d, yyyy")}</p>

      {/* Status badge */}
      <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
        {isIn ? (
          <span style={{ display: "flex", alignItems: "center", gap: 6, borderRadius: 999, background: "#d1fae5", padding: "4px 12px", fontSize: 12, fontWeight: 600, color: "#065f46" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", animation: "pulse 2s infinite" }} />
            Clocked In
          </span>
        ) : (
          <span style={{ display: "flex", alignItems: "center", gap: 6, borderRadius: 999, background: "#f1f5f9", padding: "4px 12px", fontSize: 12, fontWeight: 600, color: "#475569" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#94a3b8" }} />
            Not clocked in
          </span>
        )}
      </div>

      {location && (
        <p style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 12, color: "#64748b" }}>
          <MapPin style={{ width: 12, height: 12 }} /> GPS verified
        </p>
      )}

      {/* Action button */}
      <button
        onClick={isIn ? () => clockOut.mutate({ recordedAt: new Date().toISOString() }) : handleClockIn}
        disabled={state === "clocking"}
        style={{
          marginTop: 24, width: "100%", borderRadius: 12, padding: "14px 16px",
          fontSize: 14, fontWeight: 600, border: "none", cursor: state === "clocking" ? "not-allowed" : "pointer",
          opacity: state === "clocking" ? 0.7 : 1,
          background: isIn ? "#ef4444" : "#2563eb",
          color: "white",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          transition: "opacity 0.15s",
        }}
      >
        {state === "clocking" ? (
          <><Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> Processing…</>
        ) : isIn ? (
          <><XCircle style={{ width: 16, height: 16 }} /> Clock Out</>
        ) : (
          <><CheckCircle style={{ width: 16, height: 16 }} /> Clock In</>
        )}
      </button>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
