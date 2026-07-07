"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { GradientButton, Reveal, SectionTag, TiltCard } from "@/components/ui";

const PROJECTS = [
  {
    monogram: "K",
    title: "Kundan Srinivas",
    kind: "Personal Portfolio",
    domain: "kundansrinivas.vercel.app",
    url: "https://kundansrinivas.vercel.app",
    collab: null,
    preview: "live" as const,
    services: ["Website Design", "Development", "3D & Motion"],
    brief:
      "A full-stack and AI engineer with production systems, hackathon wins, and research papers — but no digital presence that carried that weight.",
    build:
      "A cinematic, dark personal site with an immersive intro, visual storytelling through project galleries, and a structure built to be read by recruiters in under a minute.",
    echo: "A portfolio that feels like a launch sequence — memorable enough to stand out in a stack of resumes.",
    metrics: [
      ["< 60s", "To grasp the story"],
      ["3D", "Immersive intro"],
      ["100%", "Custom built"],
    ],
    accent: "#16b6d8",
  },
  {
    monogram: "G",
    title: "Glamora",
    kind: "Beauty Brand",
    domain: "glamore-ten.vercel.app",
    url: "https://glamore-ten.vercel.app",
    collab: { name: "Pocketfriend", url: "https://pocketfriend.io" },
    preview: "live" as const,
    services: ["Website Design", "Brand Identity", "UI / UX"],
    brief:
      "A beauty brand that needed its online presence to feel as polished as the experience it sells — glamorous, editorial, and effortless to browse.",
    build:
      "Partnering with Pocketfriend, we shaped a fashion-editorial experience: rich visuals, elegant type, and a flow that moves visitors from inspiration to action without friction.",
    echo: "A brand presence that looks premium on every screen and echoes the name it carries.",
    metrics: [
      ["Editorial", "Visual language"],
      ["+180%", "Engagement"],
      ["1:1", "Design partnership"],
    ],
    accent: "#2ee6a0",
  },
  {
    monogram: "O",
    title: "OpsFlow",
    kind: "Workflow Product",
    domain: "opsflow-27e09.web.app",
    url: "https://opsflow-27e09.web.app",
    collab: null,
    preview: "live" as const,
    services: ["Web App", "Dashboard UX", "Development"],
    brief:
      "A workflow product that needed to feel clear, operational, and fast from the first screen instead of looking like a generic admin template.",
    build:
      "A focused web-app experience with structured navigation, polished interface states, and a clean visual system built for teams that need to move quickly.",
    echo: "A sharper product presence that makes the platform feel useful, modern, and ready for real business operations.",
    metrics: [
      ["Clear", "From first screen"],
      ["System", "Reusable UI states"],
      ["Fast", "Operational feel"],
    ],
    accent: "#5cf0da",
  },
  {
    monogram: "H",
    title: "High Life Studios",
    kind: "Recording Studio",
    domain: "highlifestudios.com",
    url: "https://highlifestudios.com",
    collab: null,
    preview: "shot" as const,
    services: ["Website Design", "Development", "SEO"],
    brief:
      "A premium recording and content studio in Clearwater, Florida — pro equipment and a creative home for Tampa Bay artists, invisible to the people searching for it.",
    build:
      "An atmospheric, neon-accented site with studio tours, equipment inventory, artist testimonials, and a booking flow that turns visitors into sessions.",
    echo: "The studio's online presence finally matches the room — artists book before they've even walked in.",
    metrics: [
      ["Neon", "Atmospheric design"],
      ["SEO", "Found on search"],
      ["Booking", "Visitors to sessions"],
    ],
    accent: "#12c2b0",
  },
];

type Project = (typeof PROJECTS)[number];

const INDEX_STATS = [
  ["04", "Live projects"],
  ["100%", "Real, shippable sites"],
  ["1:1", "Founder-level care"],
];

const DEMOS = [
  "Restaurant Website",
  "Real Estate Website",
  "Clinic Website",
  "E-commerce Store",
  "Startup Landing Page",
  "Local Service Business",
];

const FRAME_W = 1280;
const FRAME_RATIO = 0.66; // preview window aspect (h / w)

function ArrowUpRight({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M7 17L17 7M8 7h9v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* A live window onto the real site: an iframe rendered at desktop width and
   scaled to fit the card (kept non-interactive so it can't hijack scroll),
   or a live screenshot for sites that refuse to be framed. */
function LiveWindow({ project }: { project: Project }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);
  const [loaded, setLoaded] = useState(false);
  const [shotTry, setShotTry] = useState(0);

  useLayoutEffect(() => {
    if (project.preview !== "live") return;
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / FRAME_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, [project.preview]);

  /* mShots (free, no key) captures sites that refuse to be framed. Its first
     response is a "generating" placeholder, then it caches the real shot
     globally. Re-request on a timer (the extra param forces a browser refetch
     of the same capture job) until the real image lands. */
  useEffect(() => {
    if (project.preview !== "shot") return;
    const timers = [3000, 7000, 12000, 18000, 26000].map((ms) =>
      setTimeout(() => setShotTry((n) => n + 1), ms)
    );
    return () => timers.forEach(clearTimeout);
  }, [project.preview]);

  const shotSrc = `https://s.wordpress.com/mshots/v1/${encodeURIComponent(project.url)}?w=1280&h=850&r=${shotTry}`;

  return (
    <div
      ref={wrapRef}
      className="scanlines relative w-full overflow-hidden bg-surface"
      style={{ aspectRatio: `${1 / FRAME_RATIO}` }}
    >
      {/* skeleton shimmer until the frame reports ready */}
      <div
        className={`absolute inset-0 grid place-items-center bg-surface-2 transition-opacity duration-700 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
        aria-hidden="true"
      >
        <span className="text-gradient font-display text-7xl font-bold opacity-40">{project.monogram}</span>
      </div>

      {project.preview === "live" ? (
        <iframe
          src={project.url}
          title={`${project.title} — live preview`}
          loading="lazy"
          scrolling="no"
          tabIndex={-1}
          onLoad={() => setLoaded(true)}
          className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
          style={{ width: FRAME_W, height: FRAME_W * FRAME_RATIO, transform: `scale(${scale})` }}
        />
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={shotSrc}
          alt={`${project.title} — live screenshot`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      )}

      {/* cohesion tint + top sheen */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: `linear-gradient(160deg, ${project.accent}14, transparent 55%)` }}
        aria-hidden="true"
      />
    </div>
  );
}

/* Browser-chrome shell around the live window, with a hover "Visit" overlay. */
function BrowserFrame({ project }: { project: Project }) {
  return (
    <div className="glass-card group/frame relative overflow-hidden">
      {/* browser chrome */}
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-brand-magenta/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-brand-violet/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-brand-mint/70" />
        </div>
        <div className="flex flex-1 items-center gap-2 truncate rounded-full border border-line bg-background/60 px-3 py-1">
          <span className="text-brand-mint" aria-hidden="true">
            ⬤
          </span>
          <span className="truncate font-mono text-[11px] text-muted">{project.domain}</span>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-emerald-300">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          {project.preview === "live" ? "Live" : "Shot"}
        </span>
      </div>

      {/* live window + visit overlay */}
      <div className="relative">
        <LiveWindow project={project} />
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10 grid place-items-center bg-background/0 transition-colors duration-300 hover:bg-background/35"
        >
          <span className="flex translate-y-1 items-center gap-2 rounded-full border border-white/25 bg-background/75 px-5 py-2 text-sm font-semibold opacity-0 backdrop-blur transition-all duration-300 group-hover/frame:translate-y-0 group-hover/frame:opacity-100">
            Visit live site <ArrowUpRight />
          </span>
        </a>
      </div>
    </div>
  );
}

/* One project, presented as a full editorial case study. Alternating sides on
   large screens, each carrying its own accent glow and index number. */
function CaseStudy({ project, index, reversed }: { project: Project; index: number; reversed: boolean }) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <article id={`case-${index}`} className="relative scroll-mt-28">
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        {/* preview */}
        <div className={`relative lg:col-span-7 ${reversed ? "lg:order-2" : ""}`}>
          <div
            className="pointer-events-none absolute -inset-6 -z-10 rounded-[40px] opacity-70 blur-3xl"
            style={{ background: `radial-gradient(60% 60% at 50% 45%, ${project.accent}33, transparent 70%)` }}
            aria-hidden="true"
          />
          <Reveal y={30}>
            <TiltCard>
              <BrowserFrame project={project} />
            </TiltCard>
          </Reveal>
        </div>

        {/* dossier */}
        <div className={`relative lg:col-span-5 ${reversed ? "lg:order-1" : ""}`}>
          {/* giant ghost index */}
          <span
            className="font-display pointer-events-none absolute -top-16 right-0 select-none text-[9rem] font-extrabold leading-none opacity-[0.06] lg:-top-20 lg:text-[12rem]"
            style={{ color: project.accent }}
            aria-hidden="true"
          >
            {num}
          </span>

          <Reveal y={24} delay={0.05}>
            <div className="relative">
              <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.32em]">
                <span style={{ color: project.accent }}>{num}</span>
                <span className="h-px w-8 bg-line" />
                <span className="text-muted">{project.kind}</span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <h3 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{project.title}</h3>
                {project.collab && (
                  <a
                    href={project.collab.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-brand-magenta/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-magenta transition-colors hover:border-brand-magenta hover:text-foreground"
                  >
                    With {project.collab.name}
                  </a>
                )}
              </div>

              <p className="mt-4 max-w-xl leading-relaxed text-foreground/75">{project.brief}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {project.services.map((service) => (
                  <span
                    key={service}
                    className="rounded-full border border-line bg-background/35 px-3 py-1 text-xs font-semibold text-muted"
                  >
                    {service}
                  </span>
                ))}
              </div>

              {/* metrics */}
              <div className="mt-7 grid max-w-xl grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line">
                {project.metrics.map(([value, label]) => (
                  <div key={label} className="bg-background/55 p-3.5">
                    <p className="font-display text-lg font-bold" style={{ color: project.accent }}>
                      {value}
                    </p>
                    <p className="mt-1 text-[11px] leading-snug text-muted">{label}</p>
                  </div>
                ))}
              </div>

              {/* build / echo */}
              <div className="mt-7 grid max-w-xl gap-5 sm:grid-cols-2">
                <div>
                  <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">The build</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{project.build}</p>
                </div>
                <div>
                  <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">The echo</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{project.echo}</p>
                </div>
              </div>

              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/cta mt-8 inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-white/25"
                style={{ backgroundColor: `${project.accent}14` }}
              >
                Visit live site
                <span className="transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5">
                  <ArrowUpRight />
                </span>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </article>
  );
}

function WorkHero() {
  return (
    <section className="scrim relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-40 md:pt-44">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="flex items-center gap-3 font-mono text-sm font-semibold uppercase tracking-[0.42em] text-gradient">
              <span className="grid h-5 w-5 place-items-center rounded-full border border-brand-violet/35 bg-brand-violet/15">
                <span className="h-2 w-2 rounded-full bg-brand-violet shadow-[0_0_18px_rgba(18,194,176,0.9)]" />
              </span>
              Selected Work
            </p>
            <h1 className="glow-text font-display mt-7 text-5xl font-extrabold leading-[1.02] tracking-tight md:text-7xl">
              Work that <span className="text-gradient">echoes</span> beyond launch day.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-foreground/75 md:text-xl">
              A boutique studio means every project gets founder-level attention. Below are real, live
              websites — framed exactly as they ship. Browse the index, then step inside each one.
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line">
              {INDEX_STATS.map(([value, label]) => (
                <div key={label} className="bg-background/50 p-5 backdrop-blur">
                  <p className="text-gradient font-display text-2xl font-bold md:text-3xl">{value}</p>
                  <p className="mt-1.5 text-xs leading-snug text-muted">{label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* project index — a magazine-style contents list */}
        <div className="lg:col-span-5">
          <Reveal delay={0.18}>
            <div className="glass-card overflow-hidden">
              <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">The Index</span>
                <span className="font-mono text-[11px] text-muted">04 / 04</span>
              </div>
              <ul>
                {PROJECTS.map((p, i) => (
                  <li key={p.title}>
                    <a
                      href={`#case-${i}`}
                      className="group flex items-center gap-4 border-b border-line px-5 py-4 transition-colors last:border-b-0 hover:bg-white/[0.03]"
                    >
                      <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                      <span
                        className="font-display grid h-9 w-9 flex-none place-items-center rounded-lg text-sm font-bold text-white"
                        style={{ backgroundColor: p.accent }}
                      >
                        {p.monogram}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-display font-semibold">{p.title}</span>
                        <span className="block truncate font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                          {p.kind}
                        </span>
                      </span>
                      <span className="flex h-8 w-8 flex-none place-items-center justify-center rounded-full border border-line text-muted transition-colors group-hover:border-brand-mint/50 group-hover:text-brand-mint">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function SelectedWork() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 pb-28">
      <div className="space-y-28 md:space-y-36">
        {PROJECTS.map((project, i) => (
          <CaseStudy key={project.title} project={project} index={i} reversed={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

function DemoDirections() {
  return (
    <section className="relative z-10 border-y border-line bg-surface/30">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <SectionTag>Demo directions</SectionTag>
          <h2 className="font-display mt-5 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            The same craft can be shaped for many business types.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {DEMOS.map((demo, i) => (
            <Reveal key={demo} delay={i * 0.04}>
              <div className="sheen group relative h-full overflow-hidden bg-background/82 p-7 backdrop-blur transition-colors hover:bg-white/[0.045]">
                <span className="font-mono text-sm text-muted">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display mt-10 text-2xl font-semibold">{demo}</h3>
                <span className="mt-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Concept available <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-16 text-center">
            <SectionTag>Your project here</SectionTag>
            <h2 className="font-display mx-auto mt-5 max-w-2xl text-3xl font-bold md:text-4xl">
              This page grows with every client we make proud.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted">
              Early clients get founder-level attention, honest strategy, and a website built to become the next strong
              example.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <GradientButton href="/contact">Start your project</GradientButton>
              <Link
                href="/services"
                className="px-5 py-3 font-semibold text-muted transition-colors hover:text-foreground"
              >
                Explore services
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function WorkPage() {
  return (
    <main className="relative">
      <div className="pointer-events-none fixed inset-0 bg-background/75" aria-hidden="true" />

      <WorkHero />
      <SelectedWork />
      <DemoDirections />
    </main>
  );
}
