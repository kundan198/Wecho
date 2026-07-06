"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setScroll } from "@/lib/scroll";

/* Drives Lenis smooth scrolling and publishes normalized scroll to the shared
   store so the WebGL camera and the DOM overlays stay in perfect lockstep.
   Reduced-motion users get native scrolling with the same store fed by a
   passive scroll listener. */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setScroll({
          scrollY: window.scrollY,
          progress: max > 0 ? window.scrollY / max : 0,
          velocity: 0,
        });
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    }

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      anchors: true,
      touchMultiplier: 1.5,
    });

    lenis.on("scroll", (e: { scroll: number; limit: number; velocity: number }) => {
      setScroll({
        scrollY: e.scroll,
        progress: e.limit > 0 ? e.scroll / e.limit : 0,
        velocity: e.velocity,
      });
    });

    let frame: number;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
