"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export const EASE = [0.21, 0.65, 0.35, 1] as const;

export function Reveal({
  children,
  delay = 0,
  className,
  y = 40,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14 });
  const sy = useSpring(y, { stiffness: 180, damping: 14 });

  return (
    <motion.div
      ref={ref}
      className="inline-block"
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((e.clientX - rect.left - rect.width / 2) * 0.35);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

export function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 220, damping: 18 });
  const sry = useSpring(ry, { stiffness: 220, damping: 18 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        ry.set(((e.clientX - rect.left) / rect.width - 0.5) * 8);
        rx.set(-((e.clientY - rect.top) / rect.height - 0.5) * 8);
      }}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

export function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gradient">{children}</p>
  );
}

export function GradientButton({
  href,
  children,
  large = false,
}: {
  href: string;
  children: React.ReactNode;
  large?: boolean;
}) {
  return (
    <Magnetic>
      <a
        href={href}
        className={`bg-gradient-brand inline-block rounded-full font-semibold text-white transition-opacity hover:opacity-90 ${
          large ? "px-10 py-4.5 text-lg" : "px-7 py-3.5"
        }`}
      >
        {children}
      </a>
    </Magnetic>
  );
}

export function GhostButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Magnetic>
      <a
        href={href}
        className="inline-block rounded-full border border-line px-7 py-3.5 font-semibold transition-colors hover:border-brand-violet/60"
      >
        {children}
      </a>
    </Magnetic>
  );
}

/* Standard sub-page header */
export function PageHeader({
  tag,
  title,
  lead,
}: {
  tag: string;
  title: React.ReactNode;
  lead?: string;
}) {
  return (
    <div className="scrim relative z-10 mx-auto max-w-6xl px-6 pt-44 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <SectionTag>{tag}</SectionTag>
        <h1 className="glow-text font-display mt-5 max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">
          {title}
        </h1>
        {lead ? <p className="mt-6 max-w-2xl text-lg text-foreground/75">{lead}</p> : null}
      </motion.div>
    </div>
  );
}
