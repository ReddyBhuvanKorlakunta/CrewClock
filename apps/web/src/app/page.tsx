import Link from "next/link";
import { ArrowRight, Clock, Brain, Shield, Zap, Globe, Users, CheckCircle, Star, BarChart3 } from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    title: "AI-Powered Scheduling",
    desc: "Auto-fill open shifts based on skills, fairness scores, and compliance rules. Zero manual work.",
    color: "bg-violet-100 text-violet-700",
  },
  {
    icon: Clock,
    title: "GPS Time Clock",
    desc: "Geofence-verified clock-ins with offline support and indoor WiFi fallback. Works everywhere.",
    color: "bg-blue-100 text-blue-700",
  },
  {
    icon: Shield,
    title: "Payroll Compliance",
    desc: "CA meal penalties, daily OT, 7th-day premiums — calculated automatically, audit-ready.",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    desc: "Instant push notifications for schedule changes, shift swaps, and approvals.",
    color: "bg-amber-100 text-amber-700",
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    desc: "Native iOS & Android app, mobile web, tablet, kiosk, and desktop — one codebase.",
    color: "bg-cyan-100 text-cyan-700",
  },
  {
    icon: Users,
    title: "CrewAI Assistant",
    desc: "RAG-powered chatbot trained on your policies and schedules. Available 24/7.",
    color: "bg-rose-100 text-rose-700",
  },
];

const STATS = [
  { value: "10,000+", label: "Shifts scheduled" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "< 2s", label: "Clock-in time" },
  { value: "Free", label: "Up to 10 employees" },
];

const TESTIMONIALS = [
  {
    text: "CrewClock cut our scheduling time from 3 hours to 15 minutes. The AI just fills the gaps.",
    name: "Sarah M.",
    role: "Restaurant GM, San Francisco",
  },
  {
    text: "Finally a time clock that works indoors. Our warehouse team loves the WiFi verification.",
    name: "James K.",
    role: "Warehouse Ops, Los Angeles",
  },
  {
    text: "Meal break tracking used to cost us thousands in penalties. Not anymore.",
    name: "Lisa T.",
    role: "HR Director, Retail Chain",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Clock className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">CrewClock</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Features</a>
            <a href="#testimonials" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Reviews</a>
            <a href="#pricing" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              Start free <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-violet-50" />
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-100 opacity-40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-violet-100 opacity-40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
              <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
              AI-powered scheduling is here
            </div>

            {/* Headline */}
            <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              The workforce platform
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                your crew deserves
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
              AI-first scheduling, GPS time-clocking, automated payroll, and a built-in crew
              assistant — for restaurants, retail, healthcare, and logistics teams.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200"
              >
                Get started free <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-8 py-4 text-base font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                See how it works
              </a>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Free for up to 10 employees · No credit card required · Setup in 5 minutes
            </p>
          </div>

          {/* Hero mockup */}
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200 overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
                <div className="mx-auto flex h-6 w-64 items-center justify-center rounded-md bg-white border border-slate-200 text-xs text-slate-400">
                  app.crewclock.com/schedule
                </div>
              </div>
              {/* Dashboard preview */}
              <div className="grid grid-cols-4 gap-0 p-6 bg-slate-50">
                {/* Sidebar */}
                <div className="col-span-1 space-y-1 pr-4 border-r border-slate-200">
                  <div className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">CrewClock</div>
                  {["Schedule","Time Clock","Timecards","Payroll","Team","CrewAI"].map((item, i) => (
                    <div key={item} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${i === 0 ? "bg-blue-600 text-white" : "text-slate-600"}`}>
                      <div className={`h-2 w-2 rounded-full ${i === 0 ? "bg-white/70" : "bg-slate-300"}`} />
                      {item}
                    </div>
                  ))}
                </div>
                {/* Main content */}
                <div className="col-span-3 pl-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-800">Week of Jun 16 – 22, 2025</div>
                    <div className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white">AI Fill</div>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {["M","T","W","T","F","S","S"].map((d, i) => (
                      <div key={i} className="text-center">
                        <div className="text-xs text-slate-400 mb-1">{d}</div>
                        <div className={`rounded-lg p-1 ${[0,2,4].includes(i) ? "bg-blue-100" : "bg-slate-100"}`}>
                          {[0,2,4].includes(i) && <div className="h-6 rounded bg-blue-500/80 text-[9px] text-white flex items-center justify-center">Morning</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {[["12", "Shifts this week"],["98%","Fill rate"],["$4,280","Est. labor cost"]].map(([v,l]) => (
                      <div key={l} className="rounded-xl bg-white border border-slate-200 p-3">
                        <div className="text-lg font-bold text-slate-900">{v}</div>
                        <div className="text-xs text-slate-500">{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <section className="border-y border-slate-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-extrabold text-blue-600">{value}</div>
                <div className="mt-1 text-sm text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Everything your team needs
            </h2>
            <p className="text-lg text-slate-600">
              One platform replaces your scheduling spreadsheet, punch clock, payroll calculator, and team chat.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────────────── */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Up and running in minutes
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: "1", title: "Set up your workspace", desc: "Add your locations, roles, and invite your team. Takes under 5 minutes." },
              { step: "2", title: "Build your schedule", desc: "Let AI auto-fill shifts based on availability, skills, and compliance rules." },
              { step: "3", title: "Your crew clocks in", desc: "GPS-verified clock-ins via the mobile app or kiosk. Payroll calculates itself." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-200">
                  {step}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{desc}</p>
                {step !== "3" && (
                  <div className="absolute top-6 left-full hidden h-0.5 w-8 bg-blue-200 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────────────────── */}
      <section id="testimonials" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Loved by operations teams
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map(({ text, name, role }) => (
              <div key={name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mb-4 text-sm leading-relaxed text-slate-700">"{text}"</p>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{name}</p>
                  <p className="text-xs text-slate-500">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────────────────────────────── */}
      <section id="pricing" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="text-slate-600">Start free. Scale as you grow.</p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                desc: "Perfect for small teams",
                features: ["Up to 10 employees", "Basic scheduling", "GPS time clock", "Mobile app"],
                cta: "Get started",
                featured: false,
              },
              {
                name: "Starter",
                price: "$49",
                period: "per month",
                desc: "For growing businesses",
                features: ["Up to 50 employees", "AI scheduling", "Payroll export", "Team chat", "CrewAI assistant"],
                cta: "Start free trial",
                featured: true,
              },
              {
                name: "Growth",
                price: "$149",
                period: "per month",
                desc: "For multi-location teams",
                features: ["Unlimited employees", "Multi-location", "Advanced analytics", "API access", "Priority support"],
                cta: "Start free trial",
                featured: false,
              },
            ].map(({ name, price, period, desc, features, cta, featured }) => (
              <div
                key={name}
                className={`rounded-2xl border p-6 ${
                  featured
                    ? "border-blue-600 bg-blue-600 shadow-xl shadow-blue-200 text-white"
                    : "border-slate-200 bg-white shadow-sm"
                }`}
              >
                {featured && (
                  <div className="mb-3 inline-block rounded-full bg-white/20 px-3 py-0.5 text-xs font-semibold">
                    Most popular
                  </div>
                )}
                <div className={`text-sm font-semibold ${featured ? "text-blue-100" : "text-slate-500"}`}>{name}</div>
                <div className={`mt-1 text-4xl font-extrabold ${featured ? "text-white" : "text-slate-900"}`}>{price}</div>
                <div className={`mb-1 text-sm ${featured ? "text-blue-200" : "text-slate-400"}`}>/{period}</div>
                <div className={`mb-6 text-sm ${featured ? "text-blue-100" : "text-slate-500"}`}>{desc}</div>
                <ul className="mb-6 space-y-2">
                  {features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${featured ? "text-blue-50" : "text-slate-700"}`}>
                      <CheckCircle className={`h-4 w-4 flex-shrink-0 ${featured ? "text-blue-200" : "text-emerald-500"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sign-up"
                  className={`block rounded-xl py-2.5 text-center text-sm font-semibold transition-colors ${
                    featured
                      ? "bg-white text-blue-600 hover:bg-blue-50"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 px-8 py-16 text-center shadow-2xl shadow-blue-200">
            <h2 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl">
              Ready to modernise your workforce?
            </h2>
            <p className="mb-8 text-blue-100">
              Free for up to 10 employees. No credit card required. Setup in 5 minutes.
            </p>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-blue-600 hover:bg-blue-50 transition-colors shadow-lg"
            >
              Get started free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
                <Clock className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-bold text-slate-900">CrewClock</span>
            </div>
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} CrewClock. Built for shift workers everywhere.
            </p>
            <div className="flex gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
