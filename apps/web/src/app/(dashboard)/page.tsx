import { redirect } from "next/navigation";

// Force dynamic so Next.js generates the client-reference-manifest even
// though this page is never reachable (/ is handled by the root page.tsx
// and the middleware redirects authed users to /schedule).
export const dynamic = "force-dynamic";

export default function DashboardRoot(): never {
  redirect("/schedule");
}
