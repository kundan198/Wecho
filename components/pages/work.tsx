"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { GradientButton, Reveal, SectionTag } from "@/components/ui";

const PROJECTS = [
  {
    monogram: "K",
    title: "Kundan Srinivas",
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
    accent: "#16b6d8",
  },
  {
    monogram: "G",
    title: "Glamora",
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
    accent: "#2ee6a0",
  },
  {
    monogram: "O",
    title: "OpsFlow",
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
    accent: "#5cf0da",
  },
  {
    monogram: "H",
    title: "High Life Studios",
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
    accent: "#12c2b0",
  },
];

type Project = (typeof PROJECTS)[number];

const SCRAMBLE = "!<>-_\\/[]{}=+*^?#$%&";

const HERO_CHIPS = [
  { icon: "rocket", title: "Built for impact", text: "Results that matter" },
  { icon: "spark", title: "Pixel perfect", text: "Crafted with precision" },
  { icon: "shield", title: "Secure & scalable", text: "Built to grow with you" },
];

const METRICS = [
  ["+180%", "Engagement"],
  ["2.4x", "Session Time"],
  ["98/100", "Performance"],
];

function ChipIcon({ type }: { type: string }) {
  if (type === "rocket") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M9 15l-3-3c3-7 8-9 12-9 0 4-2 9-9 12l-3-3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <circle cx="14.5" cy="9.5" r="1.6" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    );
  }
  if (type === "shield") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <path d="M12 3l7 3v5c0 5-7 10-7 10s-7-5-7-10V6l7-3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path d="M12 3l2 5.8L20 11l-6 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M19 4v3M20.5 5.5h-3M5 17v2M6 18H4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

/* Title resolves out of signal noise once, on mount. */
function DecodeText({ text }: { text: string }) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const duration = Math.min(900, 300 + text.length * 24);
    let raf = 0;
    let start: number | null = null;
    const tick = (now: number) => {
      if (start === null) start = now;
      const t = (now - start) / duration;
      if (t >= 1) {
        setOut(text);
        return;
      }
      const n = Math.floor(t * text.length);
      let s = text.slice(0, n);
      for (let i = n; i < text.length; i++) {
        s += text[i] === " " ? " " : SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
      }
      setOut(s);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text]);
  return <>{out}</>;
}

const FRAME_W = 1280;
const FRAME_RATIO = 0.66; // preview window aspect (h / w)

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

/* One project as a landscape panel (live window | dossier). Rendered as a
   pinned card in the scroll-stack. */
function PanelCard({ project, index, total }: { project: Project; index: number; total: number }) {
  const glareRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const onMove = (e: React.MouseEvent) => {
    if (!glareRef.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * 100;
    const py = ((e.clientY - r.top) / r.height) * 100;
    glareRef.current.style.background = `radial-gradient(520px circle at ${px}% ${py}%, rgba(255,255,255,0.08), transparent 55%)`;
    glareRef.current.style.opacity = "1";
  };
  const onLeave = () => {
    if (glareRef.current) glareRef.current.style.opacity = "0";
  };

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="glass-card sheen group relative overflow-hidden shadow-[0_42px_120px_-46px_rgba(22,182,216,0.45)]"
    >
      {/* cursor glare */}
      <div
        ref={glareRef}
        className="pointer-events-none absolute inset-0 z-30 opacity-0 transition-opacity duration-300"
        aria-hidden="true"
      />

      <div className="grid lg:grid-cols-[1.16fr_0.84fr]">
        {/* ── left: the live window ────────────────────────────── */}
        <div className="flex flex-col border-b border-line lg:border-b-0 lg:border-r">
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
              Live
            </span>
          </div>

          {/* live window → opens the real site on click */}
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="relative block flex-1">
            <LiveWindow project={project} />
            <div className="absolute inset-0 z-10 grid place-items-center bg-background/45 opacity-0 backdrop-blur-[1px] transition-opacity duration-300 group-hover:opacity-100">
              <span className="rounded-full border border-white/25 bg-background/70 px-5 py-2 text-sm font-semibold">
                Visit live ↗
              </span>
            </div>
          </a>
        </div>

        {/* ── right: the dossier ───────────────────────────────── */}
          <div className="flex flex-col p-6 md:p-8">
          <div className="flex items-baseline justify-between font-mono text-xs text-muted">
            <span>CH·{String(index + 1).padStart(2, "0")}</span>
            <span aria-hidden="true">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            <h2 className="font-display text-2xl font-bold md:text-3xl">
              <DecodeText text={project.title} />
            </h2>
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

          <p className="mt-3 leading-relaxed text-muted">{project.brief}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {project.services.map((service) => (
              <span key={service} className="rounded-full border border-line bg-background/35 px-3 py-1 text-xs font-semibold text-muted">
                {service}
              </span>
            ))}
          </div>

          <p className="mt-6 font-mono text-xs uppercase tracking-widest text-brand-mint">
            Signal log
          </p>
          <div className="mt-3 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
            {METRICS.map(([value, label]) => (
              <div key={label} className="bg-background/55 p-4">
                <p className="text-gradient font-display text-xl font-bold">{value}</p>
                <p className="mt-1 text-xs text-muted">{label}</p>
              </div>
            ))}
          </div>

          <div
            className="grid transition-[grid-template-rows] duration-500 ease-out"
            style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
          >
            <div className="overflow-hidden">
              <div className="mt-4 space-y-4 border-t border-line pt-4">
                <div>
                  <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">The build</h3>
                  <p className="mt-1.5 leading-relaxed text-muted">{project.build}</p>
                </div>
                <div>
                  <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">The echo</h3>
                  <p className="mt-1.5 leading-relaxed text-muted">{project.echo}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-violet/25 transition-transform hover:scale-[1.03]"
            >
              Visit live site ↗
            </a>
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="inline-flex items-center gap-3 rounded-full border border-line px-5 py-3 text-sm font-semibold text-muted transition-colors hover:border-brand-violet/50 hover:text-foreground"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full border border-line">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                  <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" strokeWidth="1.7" />
                  <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.7" />
                </svg>
              </span>
              View case study
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Upgraded scroll-stack: each card pins a little lower than the last
   (STACK_STEP = the visible peek), so the next slides up and covers it. As a
   card is covered, a scroll-driven rAF loop writes its coverage into --recede,
   and the .stack-card CSS scales + dims it back into the deck for real depth. */
const STACK_TOP = 6.5; // rem — where the first card pins (clears the fixed nav)
const STACK_STEP = 1.7; // rem — extra offset per card => the visible peek

function WorkStack({ projects }: { projects: Project[] }) {
  const cards = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const els = cards.current;
      for (let i = 0; i < els.length; i++) {
        const el = els[i];
        if (!el) continue;
        const next = els[i + 1];
        let r = 0;
        if (next) {
          const a = el.getBoundingClientRect();
          const b = next.getBoundingClientRect();
          const h = a.height || 1;
          // 0 when the next card sits below this one's foot, → 1 as it climbs over it
          r = Math.min(1, Math.max(0, (a.top + h - b.top) / h));
        }
        el.style.setProperty("--recede", r.toFixed(3));
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // recompute when a card's height changes (e.g. Signal log expands)
    const ro = new ResizeObserver(schedule);
    cards.current.forEach((el) => el && ro.observe(el));
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [projects.length]);

  return (
    <div>
      {projects.map((project, i) => (
        <div
          key={project.title}
          ref={(el) => {
            cards.current[i] = el;
          }}
          className="stack-card mb-6 md:sticky md:mb-8"
          style={{ top: `${STACK_TOP + i * STACK_STEP}rem` }}
        >
          <PanelCard project={project} index={i} total={projects.length} />
        </div>
      ))}
    </div>
  );
}

const DEMOS = [
  "Restaurant Website",
  "Real Estate Website",
  "Clinic Website",
  "E-commerce Store",
  "Startup Landing Page",
  "Local Service Business",
];

function WorkHero() {
  return (
    <section className="scrim relative z-10 mx-auto max-w-7xl px-6 pb-6 pt-40 md:pt-44">
      <Reveal>
        <div className="max-w-3xl">
          <p className="flex items-center gap-3 font-mono text-sm font-semibold uppercase tracking-[0.42em] text-gradient">
            <span className="grid h-5 w-5 place-items-center rounded-full border border-brand-violet/35 bg-brand-violet/15">
              <span className="h-2 w-2 rounded-full bg-brand-violet shadow-[0_0_18px_rgba(18,194,176,0.9)]" />
            </span>
            Featured Projects
          </p>
          <h1 className="glow-text font-display mt-7 text-5xl font-extrabold leading-[1.04] tracking-tight md:text-7xl">
            Work that <span className="text-gradient">echoes</span> beyond launch day.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-foreground/75 md:text-xl">
            A boutique studio means every project gets founder-level attention. Each card is a window onto
            the real, live website. Scroll to move through the stack, click to step inside.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.12}>
        <div className="mt-8 grid max-w-3xl gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
          {HERO_CHIPS.map((chip) => (
            <div key={chip.title} className="flex items-center gap-4 bg-background/50 p-5 backdrop-blur">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-brand-violet/20 bg-brand-violet/10 text-brand-violet shadow-[0_0_34px_rgba(18,194,176,0.18)]">
                <ChipIcon type={chip.icon} />
              </span>
              <span>
                <span className="block text-sm font-semibold text-foreground">{chip.title}</span>
                <span className="mt-1 block text-xs text-muted">{chip.text}</span>
              </span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

export function WorkPage() {
  return (
    <main className="relative">
      <div className="pointer-events-none fixed inset-0 bg-background/75" aria-hidden="true" />

      <WorkHero />

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-32 pt-2">
        <WorkStack projects={PROJECTS} />
      </section>

      <section className="relative z-10 border-y border-line bg-surface/30">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <Reveal>
            <SectionTag>Demo directions</SectionTag>
            <h2 className="font-display mt-5 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
              The same craft can be shaped for many business types.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {DEMOS.map((demo, i) => (
              <Reveal key={demo} delay={i * 0.04}>
                <div className="bg-background/82 p-7 backdrop-blur transition-colors hover:bg-white/[0.045]">
                  <span className="font-mono text-sm text-muted">0{i + 1}</span>
                  <h3 className="font-display mt-8 text-2xl font-semibold">{demo}</h3>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-14 text-center">
              <SectionTag>Your project here</SectionTag>
              <h2 className="font-display mx-auto mt-5 max-w-2xl text-3xl font-bold md:text-4xl">
                This page grows with every client we make proud.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted">
                Early clients get founder-level attention, honest strategy, and a website built to become the next strong example.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <GradientButton href="/contact">Start your project</GradientButton>
                <Link href="/services" className="px-5 py-3 font-semibold text-muted transition-colors hover:text-foreground">
                  Explore services
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
