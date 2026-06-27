"use client";
import { useRouter } from "next/navigation";
import { useOrganizationList, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Building2, ArrowRight, Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const { createOrganization, setActive } = useOrganizationList();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !createOrganization) return;
    setLoading(true);
    setError("");
    try {
      const org = await createOrganization({ name: name.trim() });
      if (setActive) await setActive({ organization: org.id });
      router.push("/schedule");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ width: "100%", maxWidth: 440 }}>
      <div style={{ background: "white", borderRadius: 20, border: "1px solid #e2e8f0", padding: "2rem", boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Building2 style={{ width: 20, height: 20, color: "#2563eb" }} />
          </div>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: 0 }}>
              {user?.firstName ? `Welcome, ${user.firstName}!` : "Welcome to CrewClock!"}
            </h1>
            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>Create your team workspace to get started</p>
          </div>
        </div>

        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 5 }}>
              Business name <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setError(""); }}
              placeholder="e.g. Downtown Bistro, Acme Corp"
              required
              autoFocus
              style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, color: "#0f172a", backgroundColor: "#f8fafc", outline: "none", boxSizing: "border-box" }}
            />
            <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>This will be your organization name visible to your team</p>
          </div>
          {error && (
            <p style={{ fontSize: 13, color: "#ef4444", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 12px", margin: 0 }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !name.trim()}
            style={{ width: "100%", padding: "12px 16px", borderRadius: 10, backgroundColor: "#2563eb", color: "white", border: "none", fontSize: 14, fontWeight: 600, cursor: loading || !name.trim() ? "not-allowed" : "pointer", opacity: loading || !name.trim() ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            {loading
              ? <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />
              : <><span>Create workspace</span><ArrowRight style={{ width: 15, height: 15 }} /></>
            }
          </button>
        </form>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
