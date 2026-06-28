import { redirect } from "next/navigation";

// This route group page exists only to satisfy Next.js routing.
// The middleware handles all routing logic for "/".
// force-dynamic ensures Next.js emits page_client-reference-manifest.js
// (required by Vercel's post-build tracer even for unused pages).
export const dynamic = "force-dynamic";

export default function DashboardRoot() {
  redirect("/schedule");
}
