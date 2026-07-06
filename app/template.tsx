"use client";

import { motion } from "motion/react";

/* Cinematic page-enter transition — remounts on every route change.
   Opacity only: transform/filter here would turn this div into a containing
   block and break every position:fixed element inside the pages
   (film stage, HUD, letterbox bars). */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.65, ease: [0.21, 0.65, 0.35, 1] }}
    >
      {children}
    </motion.div>
  );
}
