# V2 Infrastructure Setup Guide

Companion to `docs/SYSTEM_DESIGN.md` and `docs/V2_FEASIBILITY_NOTE.md`. This is the account-by-account, step-by-step runbook for provisioning the services the V2 stack needs — Supabase as the priority replacement for Clerk + Neon, plus project management, payments, CI/CD, and separate non-prod/prod deployment environments. None of this touches code; it's the prep work to do before any migration coding starts.

**Note on scope:** you mentioned wanting to replace some pieces with "other known" services, Supabase being the main one — this guide assumes that means adopting the stack already recommended in `SYSTEM_DESIGN.md` §1 (Supabase, Vercel, Railway, PostHog, Sentry, plus a PM tool). The table below is the finalized, lowest-cost pick for every category, including the pieces added after the original draft (payments, CI/CD, transactional email). If you had something else in mind for any of these, flag it and the plan below can be adjusted before you start signing up.

---

## Lowest-cost stack summary

Everything on this list is free to start. The only unavoidable cost is Stripe's per-transaction fee — that's not optional for any payment processor.

| Category | Pick | Cost | Why |
|---|---|---|---|
| Payments | **Stripe** | Free to set up, 2.9% + $0.30/transaction | Lowest fee of the two. Lemon Squeezy's ~6% effective rate buys you tax handling, but that's a real cost premium — worth it only if you don't want to deal with sales tax/VAT filing yourself. Since lowest price was the ask, Stripe wins; switch to Lemon Squeezy later if tax admin becomes a burden. |
| Project management | **Plane** (cloud, free tier) | $0 | Unlimited issues/members up to 12 users, open-source, built for exactly this use case. Beats Linear's free tier (capped at 250 issues) and is more full-featured than GitHub Projects. |
| CI/CD | **GitHub Actions** + **Railway native deploy** | $0 (2,000 free CI minutes/month on private repos) | No new accounts — Actions runs the Python AI microservice's tests/Supabase migrations on push to main; Railway auto-redeploys that service on git push with zero extra config. The Next.js app's deploys are unaffected — it still ships via Vercel (see §3). |
| Environments | **Supabase CLI** (local) + 2 Supabase projects (staging/prod) + Railway environments | $0 | Local dev via `supabase start` (Docker), free-tier Supabase projects for staging/prod, Railway environments split within one project for the AI microservice. |
| Transactional email | **Resend** | $0 (3,000 emails/month, 100/day) | Plenty for early-stage traffic; upgrade only once you outgrow it. |
| Error monitoring | **Sentry** | $0 (5,000 errors/month, forever-free Developer plan) | Not a trial — genuinely free indefinitely at this volume. |
| Product analytics | **PostHog** | $0 (1M events/month, forever-free) | Same deal — no expiry, generous enough that most small teams never pay. |

Total to start: **$0/month** across everything except whatever you actually process through Stripe.

Sources: [Stripe vs Lemon Squeezy fees](https://www.globalsolo.global/blog/stripe-vs-paddle-vs-lemon-squeezy-2026) · [Lemon Squeezy Pricing](https://www.lemonsqueezy.com/pricing) · [Plane Pricing](https://plane.so/pricing) · [GitHub Actions billing](https://docs.github.com/billing/managing-billing-for-github-actions/about-billing-for-github-actions) · [Resend Pricing](https://resend.com/pricing) · [Sentry Pricing](https://sentry.io/pricing/) · [PostHog Pricing](https://posthog.com/pricing)

**Important — one clarification already confirmed:** Railway's "native deploy" entry above is scoped to the Python AI microservice only. The main Next.js app keeps deploying via Vercel exactly as described in §3; nothing about its hosting changes.

---

## Recommended order of operations (do these in sequence)

1. Project management: Plane (5 min) — set this up first so you can track the rest of this list as tickets.
2. Supabase (20–30 min) — the biggest piece; do it early since everything else depends on knowing your architecture is settled.
3. Vercel account tier check (5 min) — you may already have this from the current Clerk/Neon deployment; just confirm the plan.
4. Stripe (10–15 min) — payments account, independent of the others; not blocking migration but easy to knock out now.
5. Resend (5 min) — transactional email, independent of the others.
6. Railway (10 min) + GitHub Actions (15 min) — only needed once you're ready to stand up the Python AI microservice.
7. Sentry (10 min) — error tracking, independent of the others.
8. PostHog (10 min) — analytics, independent of the others.

Total: roughly 1.5–2 hours if you do all eight tomorrow. Steps 3–8 can be done in any order or spread across multiple days — only step 2 (Supabase) blocks the actual migration coding.

---

## 1. Project management: Plane (cloud, free tier)

1. Go to plane.so → sign up (GitHub sign-in available).
2. Free plan: unlimited issues, up to 12 members, open-source. No credit card required.
3. Create a workspace, then a project ("V2 Migration") and break `SYSTEM_DESIGN.md` §13's phases into issues (one per phase is a reasonable starting granularity).
4. Connect the GitHub integration if you want issues to auto-link to PRs.

---

## 2. Supabase — replaces Clerk (auth) + Neon (database), adds storage + realtime

This is the one that actually blocks the migration, so give it the most attention.

### Sign up
1. Go to supabase.com → "Start your project" → sign up with GitHub (recommended, since it's already your dev identity here).
2. Free tier gives you: 2 active projects, 500MB DB storage, 50,000 monthly active auth users, 1GB file storage, 500K edge function calls/month, 200 concurrent realtime connections. No credit card required. Free projects pause after 7 days of inactivity — a non-issue once you're actively developing against them, but worth knowing if you create one and then go quiet for a week.

### Create two projects, not one
Because the free tier allows 2 active projects, use them for **staging** and **production** rather than putting both environments in one project:
1. Create project #1: name it `crewclock-staging`, pick a region close to you, set a strong database password (save it in a password manager — you'll need it for the connection string).
2. Create project #2: name it `crewclock-prod`, same steps, different (strong, unique) password.
3. Keep these on the free tier for now — you can upgrade `crewclock-prod` to Pro ($25/mo) once you have real users and need backups/SLA; staging can usually stay free indefinitely.

### Local development
Install the Supabase CLI and run `supabase start` — this spins up local Postgres, Auth, and Storage via Docker, mirroring the staging/prod schema without touching either cloud project. Use this for day-to-day dev; only push to `crewclock-staging` when you want to test against a shared environment.

### What to configure in each project (do this for both staging and prod)
1. **Auth** → Providers: enable Email (magic link or password, your call) and any OAuth providers you want (Google is the common first addition). Under Auth → URL Configuration, set the Site URL and Redirect URLs once you know your Vercel preview/prod domains (you can come back to this after step 3 below).
2. **Auth → Custom Claims**: per `SYSTEM_DESIGN.md` §6.2, you'll need an Edge Function that stamps `org_id`, `role`, `industry`, and `plan` onto the JWT on org join. This is a code task for the actual migration, not something to build tomorrow — just know it's coming.
3. **Database** → enable the `pgvector` extension (Database → Extensions → search "vector" → enable). This replaces the Neon pgvector setup.
4. **Storage**: create four buckets — `avatars`, `certifications`, `documents`, `exports` — matching §3.2's storage list. Leave them private (not public) and rely on RLS policies during the actual migration.
5. **Project Settings → API**: copy the `Project URL`, `anon` public key, and `service_role` secret key for each project. **Treat the service_role key like a root password** — it bypasses RLS entirely and must never reach the client bundle or a public repo (this project already had one real secrets-in-git incident; don't repeat it with Supabase's keys).
6. **Project Settings → Database**: copy the connection string (both pooled and direct/unpooled, same pattern as the current `DATABASE_URL` / `DATABASE_URL_UNPOOLED`).

### What to hand off once this is done
Save these somewhere secure (password manager, not a text file in the repo) for both staging and prod:
- Project URL
- `anon` public key
- `service_role` secret key
- Database connection string (pooled + unpooled)

With those in hand, the actual Clerk→Supabase Auth and Neon→Supabase DB migration (Phases 1–2 in `SYSTEM_DESIGN.md` §13) can start.

---

## 3. Vercel — confirm your plan before going further

You're likely already deploying the current app to Vercel, and that remains unchanged by the rest of this stack — Railway (§6) and its CI/CD deploy hook are scoped only to the Python AI microservice, not the Next.js app. One thing worth checking now: **Vercel's Hobby plan is contractually restricted to personal, non-commercial use** — any deployment used for financial gain (which includes a SaaS product with Stripe billing wired up, like CrewClock) requires a **Pro plan at $20/seat/month**. If the current deployment is on Hobby, that's worth fixing regardless of the Supabase migration, since it's a terms-of-service issue, not just a nice-to-have upgrade.

Non-prod vs. prod on Vercel doesn't need a separate account — it's built in:
- **Production**: deployments from your `main` branch, served on your production domain.
- **Non-prod (staging/preview)**: Vercel automatically creates a unique preview URL for every other branch and every pull request. Point these preview deployments at the `crewclock-staging` Supabase project (via a `staging` environment variable set in Vercel's Project Settings → Environment Variables, scoped to "Preview" instead of "Production").

Action for tomorrow: log into the Vercel dashboard, check Settings → Billing → current plan, and upgrade to Pro if still on Hobby.

---

## 4. Stripe — payments

1. Go to stripe.com → sign up. Free to create an account; the only cost is the per-transaction fee (2.9% + $0.30), charged automatically as payments come in — nothing to pay up front.
2. Complete the business profile in test mode first; you can start integrating against test API keys before any legal/banking details are finalized.
3. Dashboard → Developers → API keys: save the publishable key and secret key. Treat the secret key like the Supabase `service_role` key — never expose it client-side or commit it to the repo.
4. Actual billing/checkout wiring is a code task for later in the migration — this step is just account creation plus grabbing keys.

**Why Stripe over Lemon Squeezy:** Lemon Squeezy's ~6% effective rate is higher because it bundles merchant-of-record tax handling (it collects and remits sales tax/VAT on your behalf). Stripe is cheaper but leaves tax compliance to you. Since lowest cost was the priority, Stripe wins now — revisit Lemon Squeezy later if sales tax/VAT admin becomes a real burden.

---

## 5. Resend — transactional email

1. Go to resend.com → sign up (GitHub sign-in available), no credit card required.
2. Free tier: 3,000 emails/month, 100/day — plenty for early-stage traffic.
3. Add and verify a sending domain (DNS records: SPF/DKIM), then Dashboard → API Keys → create a key.
4. Save the API key. Actual email-sending integration (invites, password resets, notifications) is a code task for later.

---

## 6. Railway — hosts the Python FastAPI AI microservice

Only needed once you're ready to build the RAG/AI service described in `SYSTEM_DESIGN.md` §5. Not urgent for day one, but easy to set up now while you're doing the others. This is the only place Railway enters the stack — it does not host the Next.js app.

1. Go to railway.com → sign up with GitHub.
2. New trial accounts get a one-time $5 credit, good for 30 days, capped at 1GB RAM / shared vCPU / 5 services per project — enough to run a small FastAPI service for development.
3. After the trial, Railway drops to a Free plan with $1/month of credit (not enough to keep a service running continuously) unless you upgrade to Hobby ($5/mo usage-based) or Pro ($20/mo usage-based, needed for a real production service with more resources).
4. Suggested setup once you're building the AI service: one Railway **project** with two **environments** — `staging` and `production` — rather than two separate Railway accounts. Environments share billing but keep config/env vars separate, which matches the Vercel preview/production split above.
5. **Native deploy**: connect the GitHub repo (or a subdirectory, if the FastAPI service lives in the monorepo) and Railway auto-redeploys that service on every push — no extra CI config needed for the deploy step itself.
6. Nothing to configure yet beyond account creation — the actual FastAPI deployment is a code task for Phase 5 of the migration.

---

## 7. CI/CD — GitHub Actions

1. GitHub Actions is already available on the repo — no new account. Free tier: 2,000 CI minutes/month on private repos.
2. Use it for the checks Railway's native deploy doesn't cover: running the Python AI microservice's test suite and any Supabase migration checks on push to `main` (and on PRs, before merge).
3. Railway's own git integration (§6.5) handles the actual deploy — Actions here is for tests/migrations, not for pushing the deploy.
4. This is a code/config task (a workflow YAML file) for later in the migration — account-wise, there's nothing to sign up for.

---

## 8. Sentry — error tracking

1. Go to sentry.io → sign up (GitHub sign-in available).
2. Free "Developer" plan: 5,000 errors/month, 10,000 performance units/month, 30-day retention, single user. No credit card required, and it doesn't expire — it's a genuine forever-free tier, not a trial.
3. Create a project, choose "Next.js" as the platform, and it will hand you a DSN (a URL, not a secret you need to hide as carefully as an API key — it's meant to be included in the deployed app).
4. If you also want to track the future Python AI service, create a second Sentry project with platform "FastAPI" (or "Python") once that service exists.
5. Save the DSN(s) — the actual `@sentry/nextjs` wiring is a code task, not something to do tomorrow.

---

## 9. PostHog — product analytics

1. Go to posthog.com → sign up (GitHub sign-in available), no credit card required.
2. Free tier: 1M events, 5K session recordings, 1M feature flag requests, 100K exceptions, and 1.5K survey responses per month — resets monthly, and PostHog says over 90% of their customers stay on the free tier permanently.
3. Create a project (call it `crewclock-prod`; you can add a second `crewclock-staging` project later if you want separated analytics, though many teams just filter staging traffic out of one project instead — your call).
4. Project Settings → copy the **Project API Key** (safe to expose client-side, it's designed for that) and the **Project ID**.
5. Save these for later — actual instrumentation is a code task.

---

## Checklist to bring back tomorrow

When you're done, come back with (or just tell me "done, here are the keys" and paste them somewhere I can read — not in a public message thread if any of them are secret-tier keys):

- [ ] Plane workspace created, "V2 Migration" project set up
- [ ] Supabase `crewclock-staging`: Project URL, anon key, service_role key, DB connection strings
- [ ] Supabase `crewclock-prod`: Project URL, anon key, service_role key, DB connection strings
- [ ] Vercel plan confirmed as Pro (or upgraded)
- [ ] Stripe account created, publishable + secret API keys saved
- [ ] Resend domain verified, API key saved
- [ ] Railway account created (service setup can wait for the AI phase)
- [ ] Sentry DSN(s)
- [ ] PostHog Project API Key + Project ID

Once these exist, I can start the actual migration work in `SYSTEM_DESIGN.md` §13 — Supabase DB/Auth first, since everything else in the phased plan depends on that being in place.
