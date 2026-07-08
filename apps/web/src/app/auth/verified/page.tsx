import Link from "next/link";

export const metadata = { title: "Email verified — CrewClock" };

export default function EmailVerifiedPage() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, background: "#fafafa" }}>
      <div style={{ width: "100%", maxWidth: 440, background: "white", borderRadius: 20, border: "1px solid #e2e8f0", padding: "2rem", boxShadow: "0 20px 60px rgba(0,0,0,0.08)", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, background: "#ecfdf5", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
          <span style={{ fontSize: 24 }}>✅</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 8px" }}>Email verified successfully</h1>
        <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 24px", lineHeight: 1.6 }}>
          You can now return to the CrewClock app and sign in.
        </p>

        <a
          href="crewclock://"
          style={{ display: "block", width: "100%", padding: "12px 16px", borderRadius: 10, backgroundColor: "#2563eb", color: "white", fontSize: 14, fontWeight: 600, textDecoration: "none", boxSizing: "border-box", marginBottom: 10 }}
        >
          Open the app
        </a>
        <Link
          href="/sign-in"
          style={{ display: "block", width: "100%", padding: "12px 16px", borderRadius: 10, border: "1px solid #e2e8f0", color: "#374151", fontSize: 14, fontWeight: 600, textDecoration: "none", boxSizing: "border-box" }}
        >
          Go to sign in
        </Link>
      </div>
    </div>
  );
}
