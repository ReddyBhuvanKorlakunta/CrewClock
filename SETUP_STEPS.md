# CrewClock — Setup Steps to Run Right Now

## Step 1 — Install missing package & push DB schema

Open **Antigravity terminal** and run these commands one at a time:

```bash
# Install Tailwind PostCSS bridge (needed for styles)
cd apps/web
pnpm add -D @tailwindcss/postcss

# Go back to root
cd ../..

# Enable pgvector on Neon (run this once)
# Go to neon.tech → your project → SQL Editor → paste:
# CREATE EXTENSION IF NOT EXISTS vector;

# Push all schema changes to Neon
pnpm --filter @crewclock/db push
```

---

## Step 2 — Clerk Dashboard (browser, 2 minutes)

Go to **https://dashboard.clerk.com** → your CrewClock app → then:

### Enable Google OAuth
1. Left sidebar → **Configure** → **Social connections**
2. Find **Google** → toggle ON
3. Leave Client ID/Secret blank for now (Clerk uses shared dev credentials)
4. Click **Save**

### Enable Username field
1. Left sidebar → **User & Authentication** → **Email, Phone, Username**
2. Toggle **Username** → ON
3. Click **Save**

### Add SSO callback URL (if Google OAuth still doesn't redirect)
1. Left sidebar → **Configure** → **Redirects**
2. Make sure `http://localhost:3000/sso-callback` is in **Allowed redirect URLs**

---

## Step 3 — Restart dev server

```bash
# Kill any running dev server (Ctrl+C), then:
pnpm dev
```

---

## Step 4 — Test the flow

1. Go to **http://localhost:3000** — landing page should be fully styled
2. Click **Sign Up** → fill all fields (first name, last name, etc.)
3. Click **Continue with Google** → should redirect to Google login
4. After Google login → redirects to `/sso-callback` → then `/onboarding`
5. On onboarding → type your business name → **Create workspace**
6. You land on `/schedule` — the dashboard

---

## What was fixed in this session

| Area | Fix |
|------|-----|
| Sign-in page | Replaced default Clerk with custom form + Google OAuth button |
| Sign-up page | Custom form: first/middle/last/suffix/username + Google OAuth |
| Google OAuth | `authenticateWithRedirect` → `/sso-callback` → `handleRedirectCallback` |
| Cloudflare CAPTCHA | Removed by using `useSignUp()` hook instead of `<SignUp />` |
| User DB sync | Auto-upserts user+tenant+membership on every tRPC request (no webhook needed) |
| Dashboard layout | Converted to inline styles — renders without Tailwind |
| All 9 dashboard pages | Converted to inline styles (schedule, timeclock, timecards, payroll, leave, team, reports, chat, AI) |
| DB schema | Added `clerkOrgId` to tenants, added `firstName`/`lastName`/`username` to users |
| Middleware | Added `/sso-callback` to public routes so Google callback isn't blocked |
| Clock widget | Fixed `recordedAt` field required by tRPC, fixed clockOut call |
| tRPC context | Full auto-sync: user → tenant (by clerkOrgId) → membership (admin role for creator) |
