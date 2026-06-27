"use client";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogle() {
    if (!isLoaded) return;
    setGoogleLoading(true);
    setError("");
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/schedule",
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError("");
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/schedule");
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "errors" in err
          ? (err as { errors: { message: string }[] }).errors[0]?.message
          : err instanceof Error ? err.message : "Sign in failed";
      setError(msg ?? "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ width: "100%", maxWidth: 420 }}>
      <div style={{ background: "white", borderRadius: 20, border: "1px solid #e2e8f0", padding: "2rem", boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>Welcome back</h1>
        <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 1.5rem" }}>
          No account?{" "}
          <Link href="/sign-up" style={{ color: "#2563eb", textDecoration: "none", fontWeight: 500 }}>
            Sign up free
          </Link>
        </p>

        {/* Google OAuth */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "11px 16px", borderRadius: 10, border: "1px solid #e2e8f0", background: "white", fontSize: 14, fontWeight: 500, color: "#374151", cursor: "pointer", marginBottom: 16 }}
        >
          {googleLoading ? (
            <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.84-1.57 2.4v2h2.54c1.5-1.38 2.26-3.4 2.26-5.4z"/>
              <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.54-1.97c-.72.48-1.63.76-2.76.76-2.12 0-3.92-1.43-4.56-3.36H1.8v2.04C3.12 15.18 5.88 17 8.98 17z"/>
              <path fill="#FBBC05" d="M4.42 10.49c-.16-.48-.25-.99-.25-1.49s.09-1.01.25-1.49V5.47H1.8C1.29 6.47 1 7.69 1 9s.29 2.53.8 3.53l2.62-2.04z"/>
              <path fill="#EA4335" d="M8.98 3.58c1.19 0 2.27.41 3.12 1.22l2.34-2.34C13 1.1 11.2.25 8.98.25 5.88.25 3.12 2.07 1.8 4.72l2.62 2.04c.64-1.93 2.44-3.18 4.56-3.18z"/>
            </svg>
          )}
          Continue with Google
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
          <span style={{ fontSize: 12, color: "#94a3b8" }}>or</span>
          <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={labelStyle}>Email address</label>
            <input
              value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              type="email"
              placeholder="you@company.com"
              required
              style={inputStyle}
              autoFocus
            />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                required
                style={{ ...inputStyle, paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}
              >
                {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
              </button>
            </div>
          </div>
          {error && <p style={errorStyle}>{error}</p>}
          <button type="submit" disabled={loading} style={primaryBtnStyle}>
            {loading
              ? <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />
              : <span style={{ display: "flex", alignItems: "center", gap: 6 }}>Sign in <ArrowRight style={{ width: 15, height: 15 }} /></span>
            }
          </button>
        </form>

        <p style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", marginTop: 16 }}>
          Secured by <strong>Clerk</strong>
        </p>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus { outline: 2px solid #2563eb; outline-offset: -1px; }
        button:hover:not(:disabled) { opacity: 0.88; }
      `}</style>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 5,
};
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px", borderRadius: 10,
  border: "1px solid #e2e8f0", fontSize: 14, color: "#0f172a",
  backgroundColor: "#f8fafc", outline: "none", boxSizing: "border-box",
};
const primaryBtnStyle: React.CSSProperties = {
  width: "100%", padding: "12px 16px", borderRadius: 10,
  backgroundColor: "#2563eb", color: "white", border: "none",
  fontSize: 14, fontWeight: 600, cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
};
const errorStyle: React.CSSProperties = {
  fontSize: 13, color: "#ef4444", backgroundColor: "#fef2f2",
  border: "1px solid #fecaca", borderRadius: 8, padding: "8px 12px",
};
