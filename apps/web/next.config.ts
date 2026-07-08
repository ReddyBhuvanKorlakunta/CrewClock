import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Middleware queries Postgres directly (Supabase account-status lookups),
  // which requires the Node.js middleware runtime — set via `export const
  // runtime = "nodejs"` in middleware.ts itself in this Next.js version.
  transpilePackages: [
    "@crewclock/ui",
    "@crewclock/auth",
    "@crewclock/api",
    "@crewclock/ai",
    "@crewclock/db",
    "@crewclock/core",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "pub-*.r2.dev" },
    ],
  },
  // Silence harmless peer dep warnings from workspace packages
  webpack: (config) => {
    config.externals = [...(config.externals || [])];
    return config;
  },
};

export default nextConfig;
