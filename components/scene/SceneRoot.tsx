"use client";

import dynamic from "next/dynamic";

/* The entire WebGL world is loaded client-only. Keeping `ssr: false` here is
   what stops Next from server-rendering the three.js scene graph on every
   route (which pegs the dev server at hundreds of % CPU). It lives fixed
   behind all page content as a single persistent canvas. */
const Experience = dynamic(() => import("./Experience"), { ssr: false });

export function SceneRoot() {
  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Experience />
    </div>
  );
}
