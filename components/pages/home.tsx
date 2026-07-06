"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent, useTransform } from "motion/react";
import { EASE, Magnetic, Reveal } from "@/components/ui";

const CHAPTERS = ["Intro", "Craft", "Work", "Ethos", "Start"];

const HEADLINE_LINES = [
  { text: "Design that", gradient: false },
  { text: "echoes", gradient: true },
  { text: "everywhere.", gradient: false },
];

const SERVICES = [
  "Website Design",
  "Brand Identity",
  "UI / UX",
  "Development",
  "SEO",
  "Performance",
  "AI Integrations",
  "Maintenance",
];

const PROJECTS = [
  {
    title: "Luxury Interior Design",
    tags: ["Website", "Brand", "Development"],
    line: "An editorial, image-led experience with quiet-luxury pacing that feels like walking through a finished space.",
  },
  {
    title: "Medical Startup",
    tags: ["UI / UX", "Development", "SEO"],
    line: "A calm, plain-language site with accessibility-minded content so patients and partners trust it instantly.",
  },
  {
    title: "Construction Company",
    tags: ["Website", "Development", "Performance"],
    line: "A bold, proof-driven, mobile-fast presence that finally matches decades of serious real-world work.",
  },
];

const VALUES = [
  ["Boutique by design", "Small enough for care, sharp enough for premium execution."],
  ["Every pixel has purpose", "Visual decisions tie to trust, clarity, emotion, or conversion."],
  ["Performance matters", "Beautiful still has to load fast and feel smooth on mobile."],
  ["Story before decoration", "Motion and 3D guide attention, never distract from the business."],
];

const BRANDS = ["SOLARIS", "PULSE", "VISION", "NEXORA", "ELEVATE", "CLOUD9"];

const ArrowRight = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={`h-4 w-4 ${className}`} aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
    <path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M3 7l9 5 9-5M12 12v10" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

const MotionIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
    <path d="M12 3l2.2 4.9L19 10l-4.8 2.1L12 17l-2.2-4.9L5 10l4.8-2.1L12 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="18.5" cy="18.5" r="2" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const CodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
    <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13 5l-2 14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BoltIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
    <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

const FEATURES = [
  { title: "Web Design", desc: "Beautiful, high-impact designs that connect and convert.", Icon: CubeIcon, href: "/services" },
  { title: "3D & Motion", desc: "Immersive 3D and motion graphics that bring ideas to life.", Icon: MotionIcon, href: "/services" },
  { title: "Development", desc: "Clean, scalable, and performant code built for the future.", Icon: CodeIcon, href: "/services" },
  { title: "Performance", desc: "Lightning fast, SEO optimized, and built to scale.", Icon: BoltIcon, href: "/services" },
];

function PrimaryCTA({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Magnetic>
      <Link
        href={href}
        className="bg-gradient-brand inline-flex items-center gap-3 rounded-full py-2 pl-6 pr-2 font-semibold text-white transition-opacity hover:opacity-90"
      >
        {children}
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
          <ArrowRight />
        </span>
      </Link>
    </Magnetic>
  );
}

function GhostCTA({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Magnetic>
      <Link
        href={href}
        className="group inline-flex items-center gap-3 rounded-full border border-line py-2 pl-6 pr-2 font-semibold transition-colors hover:border-brand-violet/60"
      >
        {children}
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors group-hover:text-foreground">
          <ArrowRight />
        </span>
      </Link>
    </Magnetic>
  );
}

function ProgressRail() {
  const { scrollYProgress } = useScroll();
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(CHAPTERS.length - 1, Math.floor(v * CHAPTERS.length + 0.15)));
  });

  return (
    <div className="pointer-events-none fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex">
      <span className="mb-1 h-14 w-px bg-gradient-to-b from-transparent to-line" />
      {CHAPTERS.map((label, i) => (
        <div key={label} className="flex items-center gap-2.5">
          <span
            className={`font-mono text-xs tabular-nums transition-all duration-300 ${
              active === i ? "text-foreground" : "text-muted/50"
            }`}
          >
            0{i + 1}
          </span>
          <span
            className={`block h-1.5 w-1.5 rounded-full transition-all duration-300 ${
              active === i ? "bg-gradient-brand scale-125" : "bg-muted/30"
            }`}
          />
        </div>
      ))}
      <span className="mt-1 h-14 w-px bg-gradient-to-b from-line to-transparent" />
    </div>
  );
}

function FeatureBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 1, ease: EASE }}
      className="panel grid grid-cols-1 gap-px overflow-hidden sm:grid-cols-2 lg:grid-cols-4"
    >
      {FEATURES.map(({ title, desc, Icon, href }) => (
        <Link
          key={title}
          href={href}
          className="group flex items-start gap-4 p-6 transition-colors hover:bg-white/[0.03]"
        >
          <span className="bg-gradient-brand/10 flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-line text-brand-violet">
            <Icon />
          </span>
          <div className="min-w-0 flex-1">
            <h4 className="font-display font-bold">{title}</h4>
            <p className="mt-1 text-xs leading-relaxed text-muted">{desc}</p>
          </div>
          <span className="mt-1 flex h-8 w-8 flex-none items-center justify-center rounded-full border border-line text-muted transition-colors group-hover:border-brand-violet/60 group-hover:text-foreground">
            <ArrowRight />
          </span>
        </Link>
      ))}
    </motion.div>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section ref={ref} className="relative z-10 min-h-screen px-6 pb-10 pt-32">
      <motion.div style={{ opacity }} className="mx-auto flex min-h-[calc(100vh-11rem)] max-w-7xl flex-col">
        <div className="flex flex-1 items-center">
          <div className="w-full">
            <div className="scrim max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="panel inline-flex items-center gap-2.5 rounded-full px-4 py-2"
              >
                <span className="bg-gradient-brand h-2 w-2 rounded-full" />
                <span className="font-mono text-xs uppercase tracking-[0.28em] text-foreground/80">
                  Boutique digital studio
                </span>
              </motion.div>

              <h1 className="glow-text font-display mt-7 text-6xl font-extrabold leading-[0.92] tracking-tight sm:text-7xl lg:text-8xl">
                {HEADLINE_LINES.map((line, i) => (
                  <motion.span
                    key={line.text}
                    initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.7, delay: 0.15 + i * 0.12, ease: EASE }}
                    className="block"
                  >
                    <span className={line.gradient ? "text-gradient" : ""}>{line.text}</span>
                  </motion.span>
                ))}
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
                className="font-script mt-6 text-3xl text-foreground/90 md:text-4xl"
              >
                Ideas that echo. Experiences that stay.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.65, ease: EASE }}
                className="mt-6 max-w-lg text-lg leading-relaxed text-foreground/75"
              >
                We&apos;re a boutique digital studio helping startups and growing businesses create
                modern websites that look exceptional, perform flawlessly, and leave a lasting impression.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.75, ease: EASE }}
                className="mt-9 flex flex-wrap items-center gap-4"
              >
                <PrimaryCTA href="/contact">Start a project</PrimaryCTA>
                <GhostCTA href="/work">See our work</GhostCTA>
              </motion.div>
            </div>

          </div>
        </div>

        <div className="mt-10 space-y-8">
          <FeatureBar />
          <div className="text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
              Trusted by ambitious brands worldwide
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {BRANDS.map((b) => (
                <span
                  key={b}
                  className="flex items-center gap-2 font-display text-sm font-semibold tracking-[0.2em] text-muted/70"
                >
                  <span className="text-brand-violet/70">*</span>
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Chapter({ index, children, className = "" }: { index: number; children: React.ReactNode; className?: string }) {
  return (
    <section className={`relative z-10 flex min-h-screen items-center px-6 py-24 ${className}`}>
      <div className="mx-auto w-full max-w-6xl">
        <span className="mb-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-muted">
          <span className="text-gradient font-bold">0{index + 1}</span>
          <span className="h-px w-10 bg-line" />
          {CHAPTERS[index]}
        </span>
        {children}
      </div>
    </section>
  );
}

function CraftChapter() {
  return (
    <Chapter index={1}>
      <div className="scrim max-w-3xl">
        <Reveal>
          <h2 className="glow-text font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            Everything your <span className="text-gradient">digital presence</span> needs, under one roof.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl text-lg text-foreground/75">
            Strategy, design, motion, and engineering handled by the same small team.
            Fewer handoffs, fewer generic decisions, more care in every detail.
          </p>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s, i) => (
          <Reveal key={s} delay={i * 0.05}>
            <div className="panel sheen group flex h-full items-center gap-3 p-5 transition-colors hover:border-brand-violet/50">
              <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-display font-semibold">{s}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </Chapter>
  );
}

function WorkChapter() {
  return (
    <Chapter index={2}>
      <div className="scrim max-w-3xl">
        <Reveal>
          <h2 className="glow-text font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            Work that <span className="text-gradient">echoes</span> beyond launch day.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl text-lg text-foreground/75">
            Boutique means every project gets founder-level attention. A look at the
            kind of business problems we design around.
          </p>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.08}>
            <article className="panel sheen flex h-full flex-col p-7 transition-colors hover:border-brand-violet/50">
              <div className="flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t} className="rounded-full border border-line px-2.5 py-0.5 text-[11px] font-semibold text-muted">
                    {t}
                  </span>
                ))}
              </div>
              <h3 className="font-display mt-6 text-2xl font-bold">{p.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/70">{p.line}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <Link href="/work" className="mt-10 inline-flex items-center gap-2 font-semibold text-muted transition-colors hover:text-foreground">
          Explore all work <span aria-hidden="true">-&gt;</span>
        </Link>
      </Reveal>
    </Chapter>
  );
}

function EthosChapter() {
  return (
    <Chapter index={3}>
      <div className="scrim">
        <Reveal>
          <h2 className="glow-text font-display max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight md:text-6xl">
            Great design shouldn&apos;t be reserved for{" "}
            <span className="text-gradient">billion-dollar companies</span>.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-2xl text-lg text-foreground/75">
            Premium isn&apos;t about pretending to be huge. It&apos;s about being precise,
            and giving every ambitious business a website that feels world-class.
          </p>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
        {VALUES.map(([title, text], i) => (
          <Reveal key={title} delay={i * 0.07}>
            <div className="h-full bg-background/60 p-7 backdrop-blur">
              <span className="font-mono text-sm text-muted">0{i + 1}</span>
              <h3 className="font-display mt-6 text-xl font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/65">{text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Chapter>
  );
}

function StartChapter() {
  return (
    <Chapter index={4} className="text-center">
      <div className="scrim mx-auto flex flex-col items-center">
        <Reveal>
          <p className="font-display text-2xl md:text-3xl">
            <span className="text-gradient font-bold">Ideas that echo.</span>{" "}
            <span className="font-script text-3xl md:text-4xl">Experiences that stay.</span>
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="glow-text font-display mt-6 max-w-4xl text-5xl font-extrabold leading-[1] tracking-tight md:text-7xl">
            Let&apos;s build something <span className="text-gradient">that echoes</span>.
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-xl text-lg text-foreground/75">
            Early clients get founder-level attention, honest strategy, and a website
            built to become the next strong example.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <PrimaryCTA href="/contact">Start a project</PrimaryCTA>
            <GhostCTA href="/services">Explore services</GhostCTA>
          </div>
        </Reveal>
      </div>
    </Chapter>
  );
}

export function HomePage() {
  return (
    <main className="relative">
      <ProgressRail />
      <Hero />
      <CraftChapter />
      <WorkChapter />
      <EthosChapter />
      <StartChapter />
    </main>
  );
}
