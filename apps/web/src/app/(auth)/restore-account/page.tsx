"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { trpc } from "@/components/providers/trpc-provider";

export default function RestoreAccountPage() {
  const router = useRouter();
  const supabase = createClient();
  const [error, setError] = useState("");
  const restore = trpc.account.restore.useMutation();

  async function handleRestore() {
    setError("");
    try {
      await restore.mutateAsync();
      router.push("/schedule");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Couldn't restore your account");
    }
  }

  async function handleKeepDeleted() {
    await supabase.auth.signOut();
    router.push("/sign-in");
  }

  return (
    <div style={{ width: "100%", maxWidth: 440 }}>
      <div style={{ background: "white", borderRadius: 20, border: "1px solid #e2e8f0", padding: "2rem", boxShadow: "0 20px 60px rgba(0,0,0,0.08)", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, background: "#fffbeb", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
          <span style={{ fontSize: 24 }}>⚠️</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 8px" }}>Restore your CrewClock account?</h1>
        <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 24px", lineHeight: 1.6 }}>
          This account was recently deleted. You can restore it within 7 days of deletion, or keep it deleted.
        </p>

        {error && (
          <p style={{ fontSize: 13, color: "#ef4444", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 12px", marginBottom: 16 }}>
            {error}
          </p>
        )}

        <button
          onClick={handleRestore}
          disabled={restore.isPending}
          style={{ display: "block", width: "100%", padding: "12px 16px", borderRadius: 10, backgroundColor: "#2563eb", color: "white", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 10 }}
        >
          {restore.isPending ? "Restoring…" : "Restore my account"}
        </button>
        <button
          onClick={handleKeepDeleted}
          style={{ display: "block", width: "100%", padding: "12px 16px", borderRadius: 10, border: "1px solid #e2e8f0", background: "white", color: "#374151", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
        >
          Keep deleted
        </button>
      </div>
    </div>
  );
}
