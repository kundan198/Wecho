/* Single source of truth for scroll, shared between the WebGL world (read
   every frame inside useFrame, no React re-render) and the DOM overlays.
   Fed by Lenis in <SmoothScroll>, with a native-scroll fallback for
   reduced-motion users. */

export type ScrollState = {
  /** 0 → 1 across the whole document */
  progress: number;
  /** signed, roughly px/frame, decays to 0 when idle */
  velocity: number;
  scrollY: number;
};

const state: ScrollState = { progress: 0, velocity: 0, scrollY: 0 };

export function setScroll(next: Partial<ScrollState>) {
  if (next.progress !== undefined) state.progress = next.progress;
  if (next.velocity !== undefined) state.velocity = next.velocity;
  if (next.scrollY !== undefined) state.scrollY = next.scrollY;
}

/** Read the live scroll state. Safe to call every frame. */
export function getScroll(): Readonly<ScrollState> {
  return state;
}

/** Linear interpolation helper used all over the scene. */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Frame-rate independent damping toward a target. */
export function damp(current: number, target: number, lambda: number, dt: number) {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}

/** Smoothstep 0..1 between edge0 and edge1. */
export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}
