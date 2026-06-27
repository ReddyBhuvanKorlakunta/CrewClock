"use client";
import { useChat } from "ai/react";
import { Sparkles, Send, Loader2, Bot, User, BookOpen, Zap } from "lucide-react";

const SUGGESTIONS = [
  "Who's available to work Saturday evening?",
  "Summarise this week's overtime costs",
  "What is our meal break policy?",
  "Draft a shift swap approval message",
];

export default function AIPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 8rem)", borderRadius: 20, border: "1px solid #e2e8f0", overflow: "hidden", background: "white" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #e2e8f0", background: "linear-gradient(to right, #eff6ff, #f5f3ff)", padding: "16px 24px" }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Sparkles style={{ width: 20, height: 20, color: "#2563eb" }} />
        </div>
        <div>
          <h2 style={{ fontWeight: 600, fontSize: 15, margin: 0 }}>CrewAI Assistant</h2>
          <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>Powered by Llama 3.3 70B · Knows your policies & schedules</p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, borderRadius: 999, background: "#d1fae5", padding: "4px 10px", fontSize: 12, fontWeight: 500, color: "#065f46" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", animation: "pulse 2s infinite" }} />
          Online
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
        {messages.length === 0 ? (
          <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, height: "100%", textAlign: "center" }}>
            <div style={{ borderRadius: 20, background: "#f1f5f9", padding: 20 }}>
              <Bot style={{ width: 40, height: 40, color: "#94a3b8" }} />
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 18, margin: "0 0 4px" }}>How can I help your crew today?</p>
              <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>I know your schedules, policies, and team — ask me anything.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, width: "100%", maxWidth: 600 }}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleInputChange({ target: { value: s } } as React.ChangeEvent<HTMLInputElement>)}
                  style={{ display: "flex", alignItems: "flex-start", gap: 8, borderRadius: 12, border: "1px solid #e2e8f0", background: "white", padding: "12px 16px", fontSize: 13, textAlign: "left", cursor: "pointer", color: "#374151", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
                >
                  <Zap style={{ width: 14, height: 14, color: "#2563eb", flexShrink: 0, marginTop: 1 }} />
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((m) => (
              <div key={m.id} style={{ display: "flex", gap: 12, flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
                <div style={{ width: 32, height: 32, flexShrink: 0, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: m.role === "user" ? "#2563eb" : "#f1f5f9", color: m.role === "user" ? "white" : "#64748b" }}>
                  {m.role === "user" ? <User style={{ width: 16, height: 16 }} /> : <Bot style={{ width: 16, height: 16 }} />}
                </div>
                <div style={{ maxWidth: "75%", borderRadius: 16, padding: "12px 16px", fontSize: 14, lineHeight: 1.6, background: m.role === "user" ? "#2563eb" : "#f1f5f9", color: m.role === "user" ? "white" : "#0f172a", borderTopRightRadius: m.role === "user" ? 4 : 16, borderTopLeftRadius: m.role === "user" ? 16 : 4 }}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Bot style={{ width: 16, height: 16, color: "#64748b" }} />
                </div>
                <div style={{ borderRadius: 16, borderTopLeftRadius: 4, background: "#f1f5f9", padding: "12px 16px" }}>
                  <Loader2 style={{ width: 16, height: 16, color: "#94a3b8", animation: "spin 1s linear infinite" }} />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Input */}
      <div style={{ borderTop: "1px solid #e2e8f0", padding: 16 }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, borderRadius: 12, border: "1px solid #e2e8f0", background: "#f8fafc", padding: "10px 16px" }}>
            <BookOpen style={{ width: 16, height: 16, flexShrink: 0, color: "#94a3b8" }} />
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about schedules, policies, payroll…"
              disabled={isLoading}
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: "#0f172a" }}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            style={{ borderRadius: 12, border: "none", background: "#2563eb", padding: "10px 16px", cursor: isLoading || !input.trim() ? "not-allowed" : "pointer", opacity: isLoading || !input.trim() ? 0.6 : 1, color: "white", display: "flex", alignItems: "center" }}
          >
            {isLoading ? <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> : <Send style={{ width: 16, height: 16 }} />}
          </button>
        </form>
        <p style={{ marginTop: 8, textAlign: "center", fontSize: 11, color: "#94a3b8" }}>
          CrewAI uses RAG over your documents. Verify critical information independently.
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
