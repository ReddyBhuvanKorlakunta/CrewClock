"use client";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

type Step = "details" | "verify";

const SUFFIXES = ["", "Jr.", "Sr.", "II", "III", "IV", "PhD", "MD", "Esq."];

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  // Form state
  const [step, setStep] = useState<Step>("details");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    username: "",
    email: "",
    password: "",
  });

  function set(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setError("");
  }

  // ── Google OAuth ─────────────────────────────────────────────────────────────
  async function handleGoogle() {
    if (!isLoaded) return;
    setGoogleLoading(true);
    setError("");
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/onboarding",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google sign-in failed";
      setError(msg);
      setGoogleLoading(false);
    }
  }

  // ── Email/password sign-up ────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError("");
    try {
      await signUp.create({
        firstName: form.firstName,
        lastName: `${form.lastName}${form.suffix ? " " + form.suffix : ""}`,
        username: form.username,
        emailAddress: form.email,
        password: form.password,
        unsafeMetadata: {
          middleName: form.middleName,
          suffix: form.suffix,
          displayName: [form.firstName, form.middleName, form.lastName, form.suffix].filter(Boolean).join(" "),
        },
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setStep("verify");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "errors" in err
          ? (err as { errors: { message: string }[] }).errors[0]?.message
          : err instanceof Error ? err.message : "Sign up failed";
      setError(msg ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // ── OTP verification ──────────────────────────────────────────────────────
  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError("");
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/onboarding");
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "errors" in err
          ? (err as { errors: { message: string }[] }).errors[0]?.message
          : "Invalid code — please try again";
      setError(msg ?? "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  // ── OTP step ──────────────────────────────────────────────────────────────
  if (step === "verify") {
    return (
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ background: "white", borderRadius: 20, border: "1px solid #e2e8f0", padding: "2rem", boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div style={{ width: 56, height: 56, background: "#eff6ff", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
              <span style={{ fontSize: 24 }}>📧</span>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>Check your email</h1>
            <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
              We sent a 6-digit code to <strong>{form.email}</strong>
            </p>
          </div>

          <form onSubmit={handleVerify} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={labelStyle}>Verification code</label>
              <input
                value={code}
                onChange={(e) => { setCode(e.target.value); setError(""); }}
                placeholder="000000"
                maxLength={6}
                style={{ ...inputStyle, fontSize: 24, letterSpacing: "0.3em", textAlign: "center", fontWeight: 700 }}
                autoFocus
              />
            </div>
            {error && <p style={errorStyle}>{error}</p>}
            <button type="submit" disabled={loading || code.length < 6} style={primaryBtnStyle}>
              {loading ? <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> : "Verify & continue"}
            </button>
          </form>

          <button
            onClick={() => { setStep("details"); setCode(""); setError(""); }}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: 13, marginTop: 16, display: "block", textAlign: "center", width: "100%" }}
          >
            ← Back to sign up
          </button>
        </div>
      </div>
    );
  }

  // ── Main sign-up form ────────────────────────────────────────────────────
  return (
    <div style={{ width: "100%", maxWidth: 480 }}>
      <div style={{ background: "white", borderRadius: 20, border: "1px solid #e2e8f0", padding: "2rem", boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>Create your account</h1>
        <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 1.5rem" }}>
          Already have one? <Link href="/sign-in" style={{ color: "#2563eb", textDecoration: "none", fontWeight: 500 }}>Sign in</Link>
        </p>

        {/* Google OAuth button */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            padding: "11px 16px", borderRadius: 10, border: "1px solid #e2e8f0", background: "white",
            fontSize: 14, fontWeight: 500, color: "#374151", cursor: "pointer",
            marginBottom: 16, transition: "background 0.15s",
          }}
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
          <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>or sign up with email</span>
          <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Name row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={labelStyle}>First name <span style={{ color: "#ef4444" }}>*</span></label>
              <input value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="John" required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Middle name</label>
              <input value={form.middleName} onChange={e => set("middleName", e.target.value)} placeholder="Optional" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "end" }}>
            <div>
              <label style={labelStyle}>Last name <span style={{ color: "#ef4444" }}>*</span></label>
              <input value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Smith" required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Suffix</label>
              <select value={form.suffix} onChange={e => set("suffix", e.target.value)} style={{ ...inputStyle, width: 90 }}>
                {SUFFIXES.map(s => <option key={s} value={s}>{s || "—"}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Username <span style={{ color: "#ef4444" }}>*</span></label>
            <input
              value={form.username}
              onChange={e => set("username", e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
              placeholder="john_smith"
              required
              style={inputStyle}
            />
            <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>Lowercase letters, numbers, underscores only</p>
          </div>

          <div>
            <label style={labelStyle}>Email address <span style={{ color: "#ef4444" }}>*</span></label>
            <input value={form.email} onChange={e => set("email", e.target.value)} type="email" placeholder="john@company.com" required style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Password <span style={{ color: "#ef4444" }}>*</span></label>
            <div style={{ position: "relative" }}>
              <input
                value={form.password}
                onChange={e => set("password", e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Min 8 characters"
                required
                minLength={8}
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

          <button
            type="submit"
            disabled={loading || !form.firstName || !form.lastName || !form.username || !form.email || !form.password}
            style={{ ...primaryBtnStyle, marginTop: 4 }}
          >
            {loading ? <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> : (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                Create account <ArrowRight style={{ width: 15, height: 15 }} />
              </span>
            )}
          </button>
        </form>

        <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", marginTop: 16, lineHeight: 1.6 }}>
          By continuing you agree to our{" "}
          <a href="#" style={{ color: "#2563eb" }}>Terms of Service</a> and{" "}
          <a href="#" style={{ color: "#2563eb" }}>Privacy Policy</a>.
        </p>
      </div>
      <p style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", marginTop: 12 }}>
        Secured by <strong>Clerk</strong>
      </p>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus, select:focus { outline: 2px solid #2563eb; outline-offset: -1px; }
        button:hover:not(:disabled) { opacity: 0.92; }
      `}</style>
    </div>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────────
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
  display: "flex", alignItems: "center", justifyContent: "center",
  opacity: 1, transition: "opacity 0.15s",
};
const errorStyle: React.CSSProperties = {
  fontSize: 13, color: "#ef4444", backgroundColor: "#fef2f2",
  border: "1px solid #fecaca", borderRadius: 8, padding: "8px 12px",
};
