"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Logo, LogoMark } from "@/components/Logo";
import { Magnetic } from "@/components/ui";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/* Comet cursor: a glowing head follows the pointer with a springy lagging
   ring, trailing a tail of tiny teal star-particles that drift and fade —
   a small comet streaking through the space scene. Canvas-based + additive
   blending so it stays crisp and cheap. Desktop + fine-pointer only. */
type Particle = { x: number; y: number; vx: number; vy: number; life: number; size: number; color: string };

export function CursorGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const COLORS = ["#5cf0da", "#12c2b0", "#16b6d8", "#2ee6a0"];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = [];
    let mx = -100;
    let my = -100;
    let rx = -100; // springy ring position
    let ry = -100;
    let lastX = -100;
    let lastY = -100;
    let started = false;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!started) {
        lastX = rx = mx;
        lastY = ry = my;
        started = true;
      }
      // seed particles along the travelled segment → a continuous tail
      const dx = mx - lastX;
      const dy = my - lastY;
      const steps = Math.min(6, Math.floor(Math.hypot(dx, dy) / 6));
      for (let i = 0; i <= steps; i++) {
        const t = steps ? i / steps : 0;
        particles.push({
          x: lastX + dx * t,
          y: lastY + dy * t,
          vx: (Math.random() - 0.5) * 0.7,
          vy: (Math.random() - 0.5) * 0.7 - 0.15,
          life: 1,
          size: 0.8 + Math.random() * 2.2,
          color: COLORS[(Math.random() * COLORS.length) | 0],
        });
      }
      lastX = mx;
      lastY = my;
      if (particles.length > 130) particles.splice(0, particles.length - 130);
    };
    window.addEventListener("mousemove", onMove);

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      ctx.clearRect(0, 0, w, h);
      if (!started) return;

      ctx.globalCompositeOperation = "lighter";

      // star-dust tail
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;
        p.size *= 0.985;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.max(0, p.life) * 0.75;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // glowing comet head
      ctx.globalAlpha = 1;
      const head = ctx.createRadialGradient(mx, my, 0, mx, my, 22);
      head.addColorStop(0, "rgba(220,255,250,0.9)");
      head.addColorStop(0.35, "rgba(92,240,218,0.35)");
      head.addColorStop(1, "rgba(92,240,218,0)");
      ctx.fillStyle = head;
      ctx.beginPath();
      ctx.arc(mx, my, 22, 0, Math.PI * 2);
      ctx.fill();

      // springy lagging ring
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = "rgba(92,240,218,0.6)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(rx, ry, 15, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[5] hidden md:block" />;
}

/* Floating capsule navigation */
export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <div className="panel mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-5 py-3">
        <Link href="/" aria-label="wecho home" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 transition-colors ${
                  active ? "text-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="bg-gradient-brand absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Magnetic>
            <Link
              href="/contact"
              className="bg-gradient-brand inline-flex items-center gap-2.5 rounded-full py-2 pl-5 pr-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              Start a project
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </Magnetic>
        </div>

        <button
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`block h-0.5 w-6 bg-foreground transition-transform ${open ? "translate-y-1 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-6 bg-foreground transition-transform ${open ? "-translate-y-1 -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="panel mx-auto mt-2 max-w-7xl rounded-2xl px-5 py-4 md:hidden"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block py-2.5 text-lg ${
                pathname === link.href ? "text-gradient font-semibold" : "text-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="bg-gradient-brand mt-3 inline-block rounded-full px-6 py-3 font-semibold text-white"
          >
            Start a project
          </Link>
        </motion.nav>
      )}
    </header>
  );
}

/* Cosmetic day/night toggle to match the theme (site stays in its dark space mode) */
export function ThemeToggle() {
  const [dark, setDark] = useState(true);
  return (
    <button
      onClick={() => setDark((v) => !v)}
      aria-label="Toggle theme"
      title="Theme"
      className="panel fixed bottom-6 left-6 z-40 hidden items-center gap-1 rounded-full p-1 md:flex"
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
          !dark ? "bg-gradient-brand text-white" : "text-muted"
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
          <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.7" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      </span>
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
          dark ? "bg-gradient-brand text-white" : "text-muted"
        }`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
          <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
        </svg>
      </span>
    </button>
  );
}

/* Floating contact / chat button */
export function ChatButton() {
  return (
    <Magnetic>
      <Link
        href="/contact"
        aria-label="Start a conversation"
        className="bg-gradient-brand fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg shadow-brand-violet/30 transition-opacity hover:opacity-90"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
          <path d="M4 5h16v10H8l-4 4V5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
        <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full border-2 border-[#06131a] bg-green-400" />
      </Link>
    </Magnetic>
  );
}

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
          <div>
            <LogoMark size={64} />
            <p className="font-display mt-5 text-2xl font-bold tracking-wide">
              <span className="text-gradient">Ideas that echo.</span>
            </p>
            <p className="font-script mt-1 text-3xl text-foreground/90">Experiences that stay.</p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-sm text-muted md:flex-row">
          <p>© {new Date().getFullYear()} wecho — Creative Websites</p>
          <p>We design. We build. We echo.</p>
        </div>
      </div>
    </footer>
  );
}
