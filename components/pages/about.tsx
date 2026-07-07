"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "motion/react";
import { EASE, GradientButton, GhostButton, SectionTag } from "@/components/ui";
import { LogoMark } from "@/components/Logo";

/* ---------------- data ---------------- */

const MISSION = ["Tell your story", "Build trust", "Create meaningful connections", "Drive measurable growth"];

const DIFFERENT = [
  { icon: "human", title: "Human-first Design", text: "We create experiences for people, not algorithms." },
  { icon: "bolt", title: "Built for Performance", text: "Beautiful websites should also be incredibly fast." },
  { icon: "spark", title: "Thoughtful Details", text: "The smallest interactions create the biggest impressions." },
  { icon: "rocket", title: "Future Ready", text: "Scalable architecture built for tomorrow's business." },
  { icon: "gem", title: "Quality Over Quantity", text: "We choose craftsmanship over shortcuts." },
  { icon: "link", title: "Partnership", text: "We work alongside our clients — not just for them." },
];

const VALUES = [
  { title: "Creativity", text: "Every project starts with curiosity." },
  { title: "Excellence", text: "Good isn't enough." },
  { title: "Simplicity", text: "Simple experiences create powerful results." },
  { title: "Innovation", text: "Always exploring better ways to build." },
  { title: "Trust", text: "Long-term relationships matter more than short-term projects." },
  { title: "Growth", text: "When our clients grow, we grow with them." },
];

const PROCESS: [string, string][] = [
  ["Discover", "Understanding your vision."],
  ["Strategy", "Planning every interaction."],
  ["Design", "Crafting intuitive experiences."],
  ["Development", "Building fast, scalable websites."],
  ["Launch", "Delivering with confidence."],
  ["Support", "Helping you continue growing."],
];

const DRIVES = [
  "Creating meaningful digital experiences",
  "Building products that solve real problems",
  "Combining creativity with technology",
  "Continuously learning and improving",
  "Helping businesses grow through thoughtful design",
];

const PHIL_WORDS = ["Every animation.", "Every transition.", "Every interaction.", "Every pixel."];

/* deterministic pseudo-random (stable across SSR/client → no hydration drift) */
const rand = (i: number, s: number) => {
  const x = Math.sin(i * 99.13 + s * 57.7) * 43758.5453;
  return x - Math.floor(x);
};

/* =====================================================================
 * VFX reveal toolkit
 * ===================================================================== */

/* Letters scatter through space, then blur-focus + lock into place. */
function AssembleText({ text, className, delay = 0, stagger = 0.028 }: { text: string; className?: string; delay?: number; stagger?: number }) {
  const reduce = useReducedMotion();
  const container = { hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } };
  return (
    <motion.span
      className={className}
      style={{ display: "inline-block", transformStyle: "preserve-3d" }}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-70px" }}
      aria-label={text}
    >
      {[...text].map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="inline-block whitespace-pre will-change-transform"
          variants={{
            hidden: reduce
              ? { opacity: 0 }
              : {
                  opacity: 0,
                  x: Math.round((rand(i, 1) - 0.5) * 200),
                  y: Math.round((rand(i, 2) - 0.5) * 170),
                  z: -220,
                  rotate: Math.round((rand(i, 3) - 0.5) * 100),
                  filter: "blur(9px)",
                },
            show: {
              opacity: 1,
              x: 0,
              y: 0,
              z: 0,
              rotate: 0,
              filter: "blur(0px)",
              transition: { duration: 0.75, ease: EASE },
            },
          }}
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </motion.span>
  );
}

/* Reveal a (gradient) phrase with a rise + blur-focus.
   `immediate` animates on mount (for above-the-fold headings that are already
   in view on load); otherwise it triggers when scrolled into view. */
function SweepReveal({
  children,
  className,
  delay = 0,
  immediate = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  immediate?: boolean;
}) {
  const reduce = useReducedMotion();
  const shown = { opacity: 1, y: 0, filter: "blur(0px)" };
  const trigger = immediate
    ? { animate: shown }
    : { whileInView: shown, viewport: { once: true, margin: "-70px" } };
  return (
    <span className={`relative inline-block ${className ?? ""}`}>
      <motion.span
        className="inline-block will-change-transform"
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26, filter: "blur(8px)" }}
        {...trigger}
        transition={{ duration: 0.9, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* Card reveal: blur + 3D tilt into place. */
function HoloCard({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={{ transformPerspective: 1200 }}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 58, rotateX: 12, filter: "blur(9px)" }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* Depth parallax while a section passes through the viewport. */
function Parallax({ children, amount = 50, className }: { children: React.ReactNode; amount?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);
  return (
    <motion.div ref={ref} style={reduce ? undefined : { y }} className={className}>
      {children}
    </motion.div>
  );
}

/* Simple 3D-rise wrapper for body copy / lists. */
function Rise({ children, delay = 0, className, y = 48 }: { children: React.ReactNode; delay?: number; className?: string; y?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={{ transformPerspective: 1000 }}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y, rotateX: 8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return <motion.div style={{ scaleX }} className="bg-gradient-brand fixed inset-x-0 top-0 z-50 h-[3px] origin-left" aria-hidden="true" />;
}

/* ---------------- icons ---------------- */

function DiffIcon({ type }: { type: string }) {
  const common = { fill: "none", className: "h-6 w-6", "aria-hidden": true } as const;
  switch (type) {
    case "human":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.7" />
          <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );
    case "bolt":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        </svg>
      );
    case "spark":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M12 3l2 5.8L20 11l-6 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        </svg>
      );
    case "rocket":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M9 15l-3-3c3-7 8-9 12-9 0 4-2 9-9 12l-3-3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <circle cx="14.5" cy="9.5" r="1.6" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );
    case "gem":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M6 3h12l3 5-9 13L3 8l3-5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M3 8h18M9 3 7 8l5 13 5-13-2-5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M9.5 14.5 14.5 9.5M8 12l-2 2a3.5 3.5 0 0 0 5 5l2-2M16 12l2-2a3.5 3.5 0 0 0-5-5l-2 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

function Check() {
  return (
    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-brand-mint/30 bg-brand-mint/10 text-brand-mint">
      <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
        <path d="M5 12.5 10 17l9-11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/* Big floating logo mark filling the hero's right side. */
function EchoLogo() {
  const reduce = useReducedMotion();
  return (
    <div
      className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 lg:block xl:right-4"
      aria-hidden="true"
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -18, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ filter: "drop-shadow(0 0 40px rgba(18,194,176,0.4))" }}
      >
        <LogoMark size={360} />
      </motion.div>
    </div>
  );
}

/* =====================================================================
 * Hero
 * ===================================================================== */

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section ref={ref} className="scrim relative z-10 mx-auto flex min-h-[94vh] max-w-6xl flex-col justify-center px-6 pt-40 pb-20">
      <EchoLogo />
      <motion.div style={reduce ? undefined : { y, scale, opacity }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
          <SectionTag>About Wecho</SectionTag>
        </motion.div>

        <h1 className="glow-text font-display relative mt-6 max-w-5xl text-5xl font-extrabold leading-[1.04] tracking-tight md:text-7xl">
          <motion.span
            className="block text-foreground"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28, filter: "blur(9px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.75, delay: 0.12, ease: EASE }}
          >
            Building
          </motion.span>
          <motion.span
            className="block text-foreground"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28, filter: "blur(9px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.75, delay: 0.24, ease: EASE }}
          >
            the future of
          </motion.span>
          <motion.span
            className="block text-gradient"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28, filter: "blur(9px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.85, delay: 0.42, ease: EASE }}
          >
            digital experiences.
          </motion.span>
        </h1>

        <motion.div
          className="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed text-foreground/75"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
        >
          <p>
            Every brand has a story worth telling. At Wecho, we transform ideas into immersive digital experiences that
            inspire, connect, and leave a lasting impression.
          </p>
          <p>
            Whether you&apos;re launching your first startup or growing your business, we believe your website should be
            your strongest asset — not just another online presence.
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-14 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted"
        style={reduce ? undefined : { opacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <motion.span animate={reduce ? undefined : { y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
          ↓
        </motion.span>
        Scroll to explore
      </motion.div>
    </section>
  );
}

/* =====================================================================
 * Process timeline (scroll-fill)
 * ===================================================================== */

function ProcessTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.4 });

  return (
    <div ref={ref} className="relative mt-14 pl-10">
      <span className="absolute left-[15px] top-2 bottom-2 w-px bg-line" aria-hidden="true" />
      <motion.span style={{ scaleY }} className="absolute left-[15px] top-2 bottom-2 w-px origin-top" aria-hidden="true">
        <span className="block h-full w-full" style={{ background: "linear-gradient(to bottom, var(--brand-blue), var(--brand-violet), var(--brand-magenta))" }} />
      </motion.span>

      <div className="space-y-9">
        {PROCESS.map(([title, text], i) => (
          <Rise key={title} delay={i * 0.04} y={36}>
            <div className="relative">
              <motion.span
                className="bg-gradient-brand absolute -left-10 top-1 grid h-7 w-7 place-items-center rounded-full text-xs font-bold text-white"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.04, ease: EASE }}
              >
                {i + 1}
              </motion.span>
              <h3 className="font-display text-2xl font-bold">{title}</h3>
              <p className="mt-1 text-muted">{text}</p>
            </div>
          </Rise>
        ))}
      </div>
    </div>
  );
}

/* =====================================================================
 * Page
 * ===================================================================== */

export function AboutPage() {
  return (
    <main className="relative">
      <div className="pointer-events-none fixed inset-0 bg-background/55" aria-hidden="true" />
      <ScrollProgress />

      <Hero />

      {/* ── Our Story ─────────────────────────── */}
      <section className="relative z-10 border-y border-line bg-surface/30">
        <div className="mx-auto max-w-6xl px-6 py-28">
          <Parallax amount={40}>
            <SectionTag>Our Story</SectionTag>
            <h2 className="font-display relative mt-5 text-4xl font-bold tracking-tight md:text-5xl">
              <AssembleText text="Small beginnings. " /> <SweepReveal delay={0.3} className="text-gradient">Big ambitions.</SweepReveal>
            </h2>
          </Parallax>
          <div className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <Rise>
              <p className="font-display text-2xl font-semibold leading-snug md:text-3xl">
                Wecho was founded with one simple belief: great design shouldn&apos;t be exclusive to big companies.
              </p>
            </Rise>
            <Rise delay={0.12}>
              <div className="space-y-5 text-lg leading-relaxed text-muted">
                <p>
                  Every startup, entrepreneur, and growing business deserves a website that feels premium, performs
                  flawlessly, and builds trust from the very first click.
                </p>
                <p>
                  We&apos;re a boutique digital studio focused on thoughtful design, clean development, and meaningful user
                  experiences. Rather than chasing volume, we dedicate ourselves to crafting websites that truly
                  represent the businesses behind them.
                </p>
                <p className="text-foreground/85">
                  Because we believe exceptional experiences are created through attention to detail — not company size.
                </p>
              </div>
            </Rise>
          </div>
        </div>
      </section>

      {/* ── Mission + Vision ──────────────────── */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-28">
        <div className="grid gap-6 lg:grid-cols-2" style={{ perspective: 1400 }}>
          <HoloCard className="card p-9">
            <SectionTag>Our Mission</SectionTag>
            <h2 className="font-display mt-4 text-3xl font-bold md:text-4xl">
              Creating experiences that <span className="text-gradient">echo</span>.
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              Our mission is to help businesses build a digital presence that is beautiful, fast, and unforgettable.
              Every website we create is designed to:
            </p>
            <ul className="mt-6 space-y-3">
              {MISSION.map((item, i) => (
                <motion.li
                  key={item}
                  className="flex items-start gap-3 text-foreground/90"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: EASE }}
                >
                  <Check />
                  <span className="pt-0.5 font-medium">{item}</span>
                </motion.li>
              ))}
            </ul>
          </HoloCard>
          <HoloCard className="card-glow p-9" delay={0.12}>
            <SectionTag>Our Vision</SectionTag>
            <h2 className="font-display mt-4 text-3xl font-bold md:text-4xl">
              Designing the future of <span className="text-gradient">digital experiences</span>.
            </h2>
            <div className="mt-4 space-y-4 leading-relaxed text-muted">
              <p>We envision a future where every business — regardless of its size — can compete through exceptional digital experiences.</p>
              <p>Our goal is to become a globally recognized creative studio known for quality, innovation, and thoughtful design.</p>
            </div>
            <p className="mt-6 font-display text-xl font-semibold">
              Not by creating the most websites. <span className="text-gradient">But by creating the most memorable ones.</span>
            </p>
          </HoloCard>
        </div>
      </section>

      {/* ── Philosophy ────────────────────────── */}
      <section className="relative z-10 border-y border-line bg-surface/30">
        <div className="scrim mx-auto max-w-5xl px-6 py-32 text-center">
          <Rise>
            <SectionTag>Our Philosophy</SectionTag>
          </Rise>
          <h2 className="glow-text font-display relative mx-auto mt-6 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
            <AssembleText text="Design is how people " /> <SweepReveal delay={0.4} className="text-gradient">feel.</SweepReveal>
          </h2>
          <Rise delay={0.1}>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted">
              We believe design is more than colors and layouts. It&apos;s emotion. It&apos;s storytelling. It&apos;s
              interaction. It&apos;s the invisible experience that makes someone trust your business.
            </p>
          </Rise>
          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 font-display text-2xl font-semibold md:text-4xl">
            {PHIL_WORDS.map((line, i) => (
              <motion.span
                key={line}
                className={i % 2 ? "text-gradient" : "text-foreground"}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)", scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: EASE }}
              >
                {line}
              </motion.span>
            ))}
          </div>
          <Rise delay={0.2}>
            <p className="mt-8 text-muted">Everything exists for a reason.</p>
          </Rise>
        </div>
      </section>

      {/* ── What makes us different ────────────── */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-28">
        <Parallax amount={40}>
          <SectionTag>What makes us different</SectionTag>
          <h2 className="font-display relative mt-5 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            <AssembleText text="The difference is in how we " /> <SweepReveal delay={0.3} className="text-gradient">think.</SweepReveal>
          </h2>
        </Parallax>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3" style={{ perspective: 1400 }}>
          {DIFFERENT.map((item, i) => (
            <HoloCard key={item.title} className="card sheen p-7" delay={(i % 3) * 0.08}>
              <motion.span
                className="grid h-12 w-12 place-items-center rounded-2xl border border-brand-violet/20 bg-brand-violet/10 text-brand-violet"
                initial={{ rotate: -25, scale: 0.7, opacity: 0 }}
                whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.08 + 0.2, ease: EASE }}
              >
                <DiffIcon type={item.icon} />
              </motion.span>
              <h3 className="font-display mt-6 text-xl font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.text}</p>
            </HoloCard>
          ))}
        </div>
      </section>

      {/* ── Core values (3D flip) ─────────────── */}
      <section className="relative z-10 border-y border-line bg-surface/30">
        <div className="mx-auto max-w-7xl px-6 py-28">
          <Parallax amount={36}>
            <SectionTag>Our Core Values</SectionTag>
            <h2 className="font-display mt-5 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
              The standards behind every decision.
            </h2>
          </Parallax>
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3" style={{ perspective: 1200 }}>
            {VALUES.map((value, i) => (
              <motion.div
                key={value.title}
                className="group h-full origin-left bg-background/70 p-8 backdrop-blur transition-colors hover:bg-white/[0.05]"
                style={{ transformStyle: "preserve-3d" }}
                initial={{ opacity: 0, rotateY: -85 }}
                whileInView={{ opacity: 1, rotateY: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.75, delay: (i % 3) * 0.09, ease: EASE }}
              >
                <span className="font-mono text-sm text-brand-mint">0{i + 1}</span>
                <h3 className="font-display mt-5 text-2xl font-bold transition-transform duration-300 group-hover:translate-x-1">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{value.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ───────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 py-28">
        <Parallax amount={30}>
          <SectionTag>The Wecho Process</SectionTag>
          <h2 className="font-display mt-5 text-4xl font-bold tracking-tight md:text-5xl">From first idea to lasting growth.</h2>
        </Parallax>
        <ProcessTimeline />
      </section>

      {/* ── Meet the Founder ──────────────────── */}
      <section className="relative z-10 border-y border-line bg-surface/30">
        <div className="mx-auto max-w-6xl px-6 py-28">
          <Parallax amount={40}>
            <SectionTag>Meet the Founder</SectionTag>
            <h2 className="font-display mt-5 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
              Building experiences that people remember.
            </h2>
          </Parallax>

          <div className="mt-12 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]" style={{ perspective: 1400 }}>
            <HoloCard className="card-glow overflow-hidden p-[1.5px]">
              <div className="group relative overflow-hidden rounded-[15px]">
                {/* portrait */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/founder.jpg"
                  alt="Kundan Srinivas Sakkuru, founder of Wecho"
                  className="aspect-[4/5] w-full scale-105 object-cover object-top grayscale-[0.15] transition-transform duration-700 group-hover:scale-110"
                />
                {/* teal duotone wash + readability scrim */}
                <div
                  className="pointer-events-none absolute inset-0 mix-blend-color"
                  style={{ background: "linear-gradient(150deg, rgba(22,182,216,0.5), rgba(18,194,176,0.15) 45%, rgba(46,230,160,0.35))" }}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
                {/* CRT scanline texture to match the site */}
                <div className="scanlines pointer-events-none absolute inset-0" />
                {/* identity overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-mint">Founder, Wecho</p>
                  <h3 className="font-display mt-1 text-2xl font-bold leading-tight">Kundan Srinivas Sakkuru</h3>
                  <p className="font-script mt-2 text-xl text-foreground/90">&ldquo;Let&apos;s create something that echoes.&rdquo;</p>
                </div>
              </div>
            </HoloCard>

            <Rise delay={0.12}>
              <div className="space-y-5 text-lg leading-relaxed text-muted">
                <p>
                  Hi, I&apos;m <span className="font-semibold text-foreground">Kundan Srinivas Sakkuru</span>, the founder of
                  Wecho. I started Wecho with a simple belief: every business — whether it&apos;s a startup, a local brand,
                  or a growing company — deserves a digital presence that feels world-class.
                </p>
                <p>
                  For me, web design isn&apos;t just about creating something beautiful. It&apos;s about solving problems,
                  telling stories, and building experiences that help businesses connect with people. Every project I take
                  on is approached with the same mindset: understand the vision, obsess over the details, and create
                  something that leaves a lasting impression.
                </p>
                <p>
                  Today, Wecho is just getting started, but the ambition is much bigger — to build a creative studio known
                  for exceptional design, innovative technology, and meaningful digital experiences.
                </p>
              </div>
            </Rise>
          </div>

          <HoloCard className="card-glow mt-12 p-10 text-center" delay={0.05}>
            <p className="font-display text-2xl font-semibold leading-snug md:text-3xl">
              &ldquo;Design isn&apos;t decoration. It&apos;s the first conversation between a brand and its
              <span className="text-gradient"> audience</span>.&rdquo;
            </p>
          </HoloCard>

          <div className="mt-10 grid gap-6 lg:grid-cols-2" style={{ perspective: 1400 }}>
            <HoloCard className="card p-8">
              <h3 className="font-display text-xl font-bold">What drives me</h3>
              <ul className="mt-5 space-y-3">
                {DRIVES.map((d, i) => (
                  <motion.li
                    key={d}
                    className="flex items-start gap-3 text-foreground/90"
                    initial={{ opacity: 0, x: -18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: 0.25 + i * 0.08, ease: EASE }}
                  >
                    <Check />
                    <span className="pt-0.5">{d}</span>
                  </motion.li>
                ))}
              </ul>
            </HoloCard>
            <div className="flex flex-col gap-6">
              <HoloCard className="card p-8" delay={0.08}>
                <h3 className="font-display text-xl font-bold">Beyond work</h3>
                <p className="mt-3 leading-relaxed text-muted">
                  Outside of client projects, I enjoy exploring modern web technologies, AI-powered solutions, and
                  interactive experiences — constantly refining my craft to create work that&apos;s both beautiful and
                  impactful.
                </p>
              </HoloCard>
              <HoloCard className="card p-8" delay={0.16}>
                <h3 className="font-display text-xl font-bold">A note from me</h3>
                <p className="mt-3 leading-relaxed text-muted">
                  Wecho isn&apos;t just a business to me — it&apos;s a long-term vision. Every website we create represents
                  someone&apos;s dream, ambition, or next chapter. That&apos;s a responsibility I take seriously.
                </p>
              </HoloCard>
            </div>
          </div>
        </div>
      </section>

      {/* ── Studio + Timeline ─────────────────── */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-28">
        <div className="grid gap-10 lg:grid-cols-2">
          <Parallax amount={30}>
            <SectionTag>Meet the Studio</SectionTag>
            <h2 className="font-display mt-5 text-3xl font-bold md:text-4xl">A growing creative studio.</h2>
            <p className="mt-5 leading-relaxed text-muted">
              Wecho is a growing creative studio driven by a passion for thoughtful design and exceptional digital
              experiences. We collaborate closely with every client, combining creativity, strategy, and modern
              technology to deliver work that reflects both our standards and your vision.
            </p>
          </Parallax>
          <div className="space-y-5" style={{ perspective: 1200 }}>
            <HoloCard className="card flex gap-5 p-7">
              <span className="font-display text-gradient text-3xl font-bold">2026</span>
              <p className="text-muted">Wecho is founded with a mission to create world-class digital experiences for startups and growing businesses.</p>
            </HoloCard>
            <HoloCard className="card flex gap-5 p-7" delay={0.12}>
              <span className="font-display text-gradient text-3xl font-bold">Today</span>
              <p className="text-muted">Helping ambitious brands build websites that inspire confidence, connect with audiences, and support long-term growth.</p>
            </HoloCard>
          </div>
        </div>
      </section>

      {/* ── Why clients choose + Closing ──────── */}
      <section className="relative z-10 border-t border-line bg-surface/30">
        <div className="scrim mx-auto max-w-4xl px-6 py-32 text-center">
          <Rise>
            <SectionTag>Why clients choose Wecho</SectionTag>
            <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-foreground/85">
              We don&apos;t promise thousands of completed projects. We promise{" "}
              <span className="text-gradient">complete dedication</span> to every project we take on — every website
              carefully designed, every interaction intentional, every decision made with your business goals in mind.
            </p>
          </Rise>
          <h2 className="glow-text font-display relative mx-auto mt-16 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
            <AssembleText text="Let's build something " /> <SweepReveal delay={0.4} className="text-gradient">extraordinary.</SweepReveal>
          </h2>
          <Rise delay={0.12}>
            <p className="mt-6 text-lg text-muted">
              Whether you&apos;re launching something new or redefining your digital presence, we&apos;d love to help bring
              your vision to life.
            </p>
            <p className="font-script mt-4 text-3xl text-foreground/90">Your next chapter starts here.</p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <GradientButton href="/contact" large>
                Start Your Project →
              </GradientButton>
              <GhostButton href="/work">See our work</GhostButton>
            </div>
          </Rise>
        </div>
      </section>
    </main>
  );
}
