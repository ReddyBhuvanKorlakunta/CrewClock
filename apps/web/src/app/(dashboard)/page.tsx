"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Client component so Next.js emits page_client-reference-manifest.js for
// this route group page. The middleware already redirects authenticated users
// server-side; this client-side push is just a safety net.
export default function DashboardRoot() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/schedule");
  }, [router]);
  return null;
}
