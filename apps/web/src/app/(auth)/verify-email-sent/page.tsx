"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function VerifyEmailSentInner() {
  const email = useSearchParams().get("email") ?? "";
  const supabase = createClient();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleResend() {
    if (!email) return;
    setLoading(true);
    await supabase.auth.resend({ type: "signup", email });
    setSent(true);
    setLoading(false);
  }

  return (
    <div style={{ width: "100%", maxWidth: 440 }}>
      <div style={{ background: "white", borderRadius: 20, border: "1px solid #e2e8f0", padding: "2rem", boxShadow: "0 20px 60px rgba(0,0,0,0.08)", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, background: "#eff6ff", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
          <span style={{ fontSize: 24 }}>📧</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 8px" }}>Verification email sent</h1>
        <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 24px", lineHeight: 1.6 }}>
          {email ? <>We sent a verification link to <strong>{email}</strong>.</> : "We sent you a verification link."}
          {" "}Please verify your email, then return here to sign in.
        </p>

        <Link
          href="/sign-in"
          style={{ display: "block", width: "100%", padding: "12px 16px", borderRadius: 10, backgroundColor: "#2563eb", color: "white", fontSize: 14, fontWeight: 600, textDecoration: "none", boxSizing: "border-box", marginBottom: 10 }}
        >
          Go to sign in
        </Link>

        <button
          onClick={handleResend}
          disabled={loading || sent || !email}
          style={{ background: "none", border: "none", cursor: sent || !email ? "default" : "pointer", color: "#2563eb", fontSize: 13 }}
        >
          {sent ? "Verification email resent ✓" : "Resend verification email"}
        </button>
      </div>
    </div>
  );
}

export default function VerifyEmailSentPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailSentInner />
    </Suspense>
  );
}
