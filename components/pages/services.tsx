"use client";

import Link from "next/link";
import { GhostButton, GradientButton, Reveal } from "@/components/ui";

/* ── inline icon set (gradient-stroked to match the brand) ──────────── */
const FILLED = new Set(["star", "heart", "play", "spark", "bolt"]);

const ICONS: Record<string, React.ReactNode> = {
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </>
  ),
  penTool: (
    <>
      <path d="M12 19H5" />
      <path d="M15.5 4.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </>
  ),
  code: (
    <>
      <path d="m8 7-5 5 5 5" />
      <path d="m16 7 5 5-5 5" />
      <path d="m13 4-2 16" />
    </>
  ),
  cube: (
    <>
      <path d="M12 2 3 7v10l9 5 9-5V7Z" />
      <path d="m3 7 9 5 9-5M12 12v10" />
    </>
  ),
  feather: (
    <>
      <path d="M20 4C13 4 8 9 6 15l-2 5 5-2c6-2 11-7 11-14Z" />
      <path d="M16 8 4 20" />
      <path d="M10 14h6" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-3.5-3.5" />
      <path d="M8 12v-1M11 13V9M14 12v-2" />
    </>
  ),
  bolt: <path d="M13 2 4 14h6l-1 8 9-12h-6Z" />,
  headset: (
    <>
      <path d="M4 13a8 8 0 0 1 16 0v4a3 3 0 0 1-3 3h-2" />
      <rect x="2.5" y="13" width="4" height="7" rx="1.5" />
      <rect x="17.5" y="13" width="4" height="7" rx="1.5" />
    </>
  ),
  rocket: (
    <>
      <path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2" />
      <path d="M9 15l-3-3c3-7 8-9 12-9 0 4-2 9-9 12l-3-3Z" />
      <circle cx="14.5" cy="9.5" r="1.6" />
    </>
  ),
  spark: <path d="M12 3l1.9 5.6L19 10l-5.1 1.4L12 17l-1.9-5.6L5 10l5.1-1.4Z" />,
  shield: <path d="M12 3l7 3v5c0 5-7 10-7 10s-7-5-7-10V6Z" />,
  star: <path d="M12 3.5l2.6 5.6 6 .6-4.5 4 1.3 5.9L12 16.9 6.6 19.6 7.9 13.7 3.4 9.7l6-.6Z" />,
  heart: <path d="M12 20s-7-4.3-7-9.3A3.7 3.7 0 0 1 12 8a3.7 3.7 0 0 1 7 2.7c0 5-7 9.3-7 9.3Z" />,
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M20.5 20a5.5 5.5 0 0 0-3.8-5.2" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18A14 14 0 0 1 12 3Z" />
    </>
  ),
  play: <path d="M8 5.5v13l11-6.5Z" />,
};

function Icon({ name, className }: { name: string; className?: string }) {
  const filled = FILLED.has(name);
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "url(#svc-grad)" : "none"}
      stroke={filled ? "none" : "url(#svc-grad)"}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}

function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gradient ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" aria-hidden="true" />
      {children}
    </p>
  );
}

/* ── content ────────────────────────────────────────────────────────── */
const CHIPS = [
  { icon: "rocket", title: "Fast & Reliable", sub: "Built for performance" },
  { icon: "spark", title: "Premium Quality", sub: "Pixel-perfect results" },
  { icon: "shield", title: "Secure & Scalable", sub: "Future-ready solutions" },
];

const SERVICES = [
  { icon: "monitor", title: "Website Design", desc: "Beautiful, high-impact websites that connect, engage, and convert." },
  { icon: "penTool", title: "UI / UX Design", desc: "Intuitive, user-centered designs that elevate experience and brand." },
  { icon: "code", title: "Website Development", desc: "Clean, scalable, and modern websites built with best practices." },
  { icon: "cube", title: "3D & Motion", desc: "Immersive 3D visuals and motion graphics that bring ideas to life." },
  { icon: "feather", title: "Branding", desc: "Strong brand identities that create recognition and build trust." },
  { icon: "search", title: "SEO Optimization", desc: "Data-driven SEO strategies that boost rankings and drive organic growth." },
  { icon: "bolt", title: "Performance", desc: "Lightning-fast websites optimized for speed, core web vitals & SEO." },
  { icon: "headset", title: "Maintenance & Support", desc: "Ongoing care and support to keep your website secure and updated." },
];

const STATS = [
  { icon: "star", value: "50+", label: "Projects Delivered" },
  { icon: "users", value: "30+", label: "Happy Clients" },
  { icon: "globe", value: "15+", label: "Countries Served" },
  { icon: "rocket", value: "99%", label: "Client Satisfaction" },
];

const PACKAGES = [
  ["Presence", "A polished small-business website with essential pages and launch setup."],
  ["Growth", "A custom website with stronger strategy, SEO, and conversion-focused sections."],
  ["Signature", "A high-touch digital experience with motion, 3D, integrations, and ongoing support."],
];

function StationCard({ service, index }: { service: (typeof SERVICES)[number]; index: number }) {
  return (
    <div className="group relative h-full overflow-hidden rounded-2xl border border-line bg-surface/40 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-brand-violet/40">
      {/* purple top glow */}
      <div
        className="pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-brand-violet/20 opacity-50 blur-3xl transition-opacity duration-300 group-hover:opacity-90"
        aria-hidden="true"
      />
      <div className="relative">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          Station {String(index + 1).padStart(2, "0")}
        </span>
        <div className="mt-5 grid h-14 w-14 place-items-center rounded-full border border-white/10 bg-gradient-to-br from-brand-blue/20 to-brand-violet/25 shadow-[0_0_24px_rgba(107,102,255,0.35)]">
          <Icon name={service.icon} className="h-6 w-6" />
        </div>
        <h3 className="font-display mt-6 text-xl font-bold">{service.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{service.desc}</p>
        <div className="mt-6 flex justify-end">
          <span
            className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition-colors group-hover:border-brand-blue/50 group-hover:text-brand-mint"
            aria-hidden="true"
          >
            →
          </span>
        </div>
      </div>
    </div>
  );
}

export function ServicesPage() {
  return (
    <main className="relative">
      <div className="pointer-events-none fixed inset-0 bg-background/55" aria-hidden="true" />

      {/* shared gradient for every inline icon */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <linearGradient id="svc-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3777ff" />
            <stop offset="0.55" stopColor="#6b66ff" />
            <stop offset="1" stopColor="#ce4fff" />
          </linearGradient>
        </defs>
      </svg>

      {/* ── hero ─────────────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-36 md:pt-44">
        <div className="max-w-3xl">
            <Eyebrow>Services</Eyebrow>
            <h1 className="glow-text font-display mt-5 text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              Everything your brand needs to look <span className="text-gradient">premium online.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-foreground/75">
              From stunning website design to fast development, branding, motion, and SEO — Wecho builds digital
              experiences that feel world-class from the first click.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <GradientButton href="/contact">Start a project</GradientButton>
              <GhostButton href="/work">See our work</GhostButton>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-5">
              {CHIPS.map((chip) => (
                <div key={chip.title} className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-surface/60">
                    <Icon name={chip.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{chip.title}</p>
                    <p className="text-xs text-muted">{chip.sub}</p>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </section>

      {/* ── capabilities grid ────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow className="justify-center">Capabilities</Eyebrow>
            <h2 className="font-display mt-5 text-4xl font-bold tracking-tight md:text-5xl">
              Eight stations. One complete <span className="text-gradient">digital journey.</span>
            </h2>
            <p className="mt-4 text-muted">
              Follow the comet — every service is a station on the route, and the trail lights up as you travel.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service, i) => (
            <Reveal key={service.title} delay={(i % 4) * 0.06}>
              <StationCard service={service} index={i} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── stats ────────────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <Reveal>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex items-center gap-4 bg-background/80 p-6 backdrop-blur">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line bg-surface/60">
                  <Icon name={stat.icon} className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-gradient font-display text-3xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── packages / CTA ───────────────────────────────────────────── */}
      <section className="relative z-10 border-y border-line bg-surface/30">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <Reveal>
            <Eyebrow>Ways to work together</Eyebrow>
            <h2 className="font-display mt-5 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
              Choose the level of digital presence your business needs now.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {PACKAGES.map(([title, text], i) => (
              <Reveal key={title} delay={i * 0.08}>
                <div className={i === 1 ? "card-glow h-full p-8" : "card h-full p-8"}>
                  <span className="font-mono text-sm text-muted">0{i + 1}</span>
                  <h3 className="font-display mt-5 text-3xl font-bold">{title}</h3>
                  <p className="mt-4 leading-relaxed text-muted">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-14 flex flex-wrap items-center gap-4">
              <GradientButton href="/contact">Tell us what you need</GradientButton>
              <Link href="/work" className="font-semibold text-muted transition-colors hover:text-foreground">
                See examples
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
