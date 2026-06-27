import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopBar } from "@/components/layout/top-bar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", backgroundColor: "#f8fafc" }}>
      <AppSidebar />
      <div style={{ display: "flex", flex: 1, flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <TopBar />
        <main style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
