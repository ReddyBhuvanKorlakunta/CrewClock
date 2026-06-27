# CrewClock — AI-Powered Workforce Management Platform

A production-ready, full-stack SaaS for shift-based businesses (restaurants, retail, healthcare, logistics).

## Monorepo Structure

```
crewclock/
├── apps/
│   ├── web/          # Next.js 15 (App Router, RSC, TypeScript)
│   └── mobile/       # Expo SDK 53 + React Native + NativeWind
├── packages/
│   ├── ai/           # Vercel AI SDK, Groq, RAG pipeline
│   ├── api/          # tRPC v11 routers
│   ├── auth/         # Clerk v5 helpers, RBAC
│   ├── config/       # Shared tsconfig, Tailwind preset
│   ├── core/         # Payroll calculator, compliance engine
│   ├── db/           # Drizzle ORM + Neon PostgreSQL schema
│   └── ui/           # Shared React components
├── docker-compose.yml   # pgvector, Redis, Ollama (local dev)
├── turbo.json
├── biome.json
└── pnpm-workspace.yaml
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 · React 19 · TypeScript 5 · Tailwind CSS v4 |
| Mobile | Expo SDK 53 · React Native · NativeWind v4 · Expo Router v4 |
| API | tRPC v11 · Zod · superjson |
| Database | Neon PostgreSQL 16 · pgvector · Drizzle ORM v2 |
| Auth | Clerk v5 (multi-tenant orgs, MFA, invite flows) |
| AI | Groq Llama 3.3 70B (free) · Claude claude-haiku-4-5 · Gemini 2.0 Flash |
| RAG | Nomic Embed Text 768d · pgvector · LangChain.js |
| Real-time | Ably (WebSocket + SSE) |
| Cache/Jobs | Upstash Redis + QStash |
| Storage | Cloudflare R2 |
| Email/SMS | Resend + Twilio |
| Payments | Stripe |
| Maps | Mapbox GL JS v3 + Geofencing |
| CI/CD | GitHub Actions · EAS Build · Vercel |

## Getting Started

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start local services (Postgres/pgvector, Redis, Ollama)
docker compose up -d

# Push DB schema
pnpm db:push

# Start all apps
pnpm dev
```

## Environment Variables

See `.env.example` for all required environment variables.

## Key Features

- **AI Scheduling** — Auto-fill open shifts with fairness scoring & compliance checks
- **GPS Time Clock** — Geofence-verified clock-ins with WiFi indoor fallback & offline queue
- **Payroll Engine** — CA daily OT, meal penalties, 7th-day premiums, multi-state support
- **CrewAI Assistant** — RAG-powered chatbot trained on your policies & schedules (Llama 3.3 70B, free)
- **Real-time Updates** — Ably WebSocket push for schedule changes, swap requests, approvals
- **Audit Log** — Immutable INSERT-only audit trail with PostgreSQL RLS
- **PWA + Native** — Works on iOS, Android, tablet, kiosk, laptop, and large monitors

## License

Proprietary — CrewClock © 2025
