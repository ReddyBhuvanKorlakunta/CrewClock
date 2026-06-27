import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TrpcProvider } from "@/components/providers/trpc-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: { default: "CrewClock", template: "%s | CrewClock" },
  description: "AI-powered workforce management for shift-based teams",
  keywords: ["workforce management", "employee scheduling", "time clock", "payroll"],
  authors: [{ name: "CrewClock" }],
  openGraph: {
    type: "website",
    title: "CrewClock",
    description: "AI-powered workforce management for shift-based teams",
    siteName: "CrewClock",
  },
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className={inter.variable}>
        <body className="min-h-screen font-sans antialiased">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <TrpcProvider>
              {children}
              <Toaster />
            </TrpcProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
