"use client";
import { MessageSquare, Send, Hash } from "lucide-react";
import { useState } from "react";

const CHANNELS = [
  { id: "general", name: "general", type: "announcement" },
  { id: "managers", name: "managers", type: "team" },
  { id: "floor", name: "floor-team", type: "location" },
];

export default function ChatPage() {
  const [active, setActive] = useState("general");
  const [msg, setMsg] = useState("");

  return (
    <div style={{ display: "flex", height: "calc(100vh - 8rem)", borderRadius: 20, border: "1px solid #e2e8f0", overflow: "hidden", background: "white" }}>
      {/* Channel list */}
      <div style={{ width: 220, flexShrink: 0, borderRight: "1px solid #e2e8f0", background: "#f8fafc", padding: 12, display: "flex", flexDirection: "column", gap: 4 }}>
        <p style={{ padding: "4px 8px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", margin: 0 }}>Channels</p>
        {CHANNELS.map(c => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            style={{ display: "flex", width: "100%", alignItems: "center", gap: 8, borderRadius: 8, padding: "6px 8px", fontSize: 13, border: "none", cursor: "pointer", textAlign: "left", background: active === c.id ? "#2563eb" : "transparent", color: active === c.id ? "white" : "#475569", transition: "all 0.1s" }}
          >
            <Hash style={{ width: 14, height: 14, flexShrink: 0 }} /> {c.name}
          </button>
        ))}
      </div>

      {/* Messages area */}
      <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
        <div style={{ borderBottom: "1px solid #e2e8f0", padding: "12px 16px" }}>
          <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>
            # {CHANNELS.find(c => c.id === active)?.name}
          </p>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <MessageSquare style={{ margin: "0 auto 8px", width: 32, height: 32, color: "#cbd5e1" }} />
            <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>No messages yet</p>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #e2e8f0", padding: 16 }}>
          <form onSubmit={e => { e.preventDefault(); setMsg(""); }} style={{ display: "flex", gap: 8 }}>
            <input
              value={msg}
              onChange={e => setMsg(e.target.value)}
              placeholder={`Message #${CHANNELS.find(c => c.id === active)?.name}…`}
              style={{ flex: 1, borderRadius: 10, border: "1px solid #e2e8f0", background: "#f8fafc", padding: "10px 12px", fontSize: 14, outline: "none", color: "#0f172a" }}
            />
            <button
              type="submit"
              disabled={!msg.trim()}
              style={{ borderRadius: 10, border: "none", background: "#2563eb", padding: "10px 14px", cursor: msg.trim() ? "pointer" : "not-allowed", opacity: msg.trim() ? 1 : 0.5, color: "white", display: "flex", alignItems: "center" }}
            >
              <Send style={{ width: 16, height: 16 }} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
