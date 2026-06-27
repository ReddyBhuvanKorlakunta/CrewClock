import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
      { protocol: "https", hostname: "img.clerk.com" },
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
