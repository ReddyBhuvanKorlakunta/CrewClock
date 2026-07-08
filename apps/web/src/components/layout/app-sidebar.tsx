"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Calendar, Clock, DollarSign, Users, FileText, BarChart3,
  MessageSquare, Sparkles, Settings, ChevronLeft, Menu,
} from "lucide-react";
import { useState } from "react";
import { trpc } from "@/components/providers/trpc-provider";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { href: "/schedule",  icon: Calendar,      label: "Schedule" },
  { href: "/timeclock", icon: Clock,         label: "Time Clock" },
  { href: "/timecards", icon: FileText,      label: "Timecards" },
  { href: "/payroll",   icon: DollarSign,    label: "Payroll" },
  { href: "/leave",     icon: Calendar,      label: "Leave" },
  { href: "/team",      icon: Users,         label: "Team" },
  { href: "/reports",   icon: BarChart3,     label: "Reports" },
  { href: "/chat",      icon: MessageSquare, label: "Chat" },
  { href: "/ai",        icon: Sparkles,      label: "CrewAI" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: tenant } = trpc.tenants.getCurrent.useQuery();
  const { data: currentUser } = trpc.account.getCurrent.useQuery();
  const [collapsed, setCollapsed] = useState(false);
  const w = collapsed ? 64 : 240;

  async function handleSignOut() {
    await createClient().auth.signOut();
    router.push("/sign-in");
    router.refresh();
  }

  const initial = (currentUser?.firstName?.[0] ?? currentUser?.email?.[0] ?? "?").toUpperCase();

  return (
    <aside
      style={{
        width: w, minWidth: w, maxWidth: w,
        display: "flex", flexDirection: "column",
        borderRight: "1px solid #e2e8f0",
        backgroundColor: "#ffffff",
        transition: "width 0.2s ease",
        overflow: "hidden", flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", height: 64, alignItems: "center", justifyContent: "space-between", padding: "0 16px", borderBottom: "1px solid #e2e8f0" }}>
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Clock style={{ width: 14, height: 14, color: "white" }} />
            </div>
            <span style={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>CrewClock</span>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} style={{ padding: 6, borderRadius: 8, border: "none", background: "none", cursor: "pointer", color: "#64748b" }}>
          {collapsed ? <Menu style={{ width: 16, height: 16 }} /> : <ChevronLeft style={{ width: 16, height: 16 }} />}
        </button>
      </div>

      {/* Org name */}
      {!collapsed && tenant && (
        <div style={{ padding: "10px 16px 4px" }}>
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8" }}>
            {tenant.name}
          </span>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: 8, display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 10,
                fontSize: 13, fontWeight: 500, textDecoration: "none",
                backgroundColor: active ? "#2563eb" : "transparent",
                color: active ? "#ffffff" : "#475569",
                justifyContent: collapsed ? "center" : "flex-start",
                transition: "background 0.1s",
              }}
            >
              <Icon style={{ width: 16, height: 16, flexShrink: 0 }} />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ borderTop: "1px solid #e2e8f0", padding: 10, display: "flex", flexDirection: "column", gap: 4 }}>
        <Link href="/settings" style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8, fontSize: 13, textDecoration: "none", color: "#475569", justifyContent: collapsed ? "center" : "flex-start" }}>
          <Settings style={{ width: 15, height: 15 }} />
          {!collapsed && <span>Settings</span>}
        </Link>
        <button
          onClick={handleSignOut}
          title="Sign out"
          style={{
            display: "flex", alignItems: "center", gap: 10, padding: "4px 8px",
            justifyContent: collapsed ? "center" : "flex-start",
            background: "none", border: "none", cursor: "pointer", width: "100%",
          }}
        >
          <div style={{ width: 26, height: 26, borderRadius: "50%", backgroundColor: "#2563eb", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
            {initial}
          </div>
          {!collapsed && <span style={{ fontSize: 12, color: "#94a3b8" }}>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}
