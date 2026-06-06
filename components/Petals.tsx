"use client";

import { useEffect, useState, type CSSProperties } from "react";

/**
 * Minimalist falling-petal ambiance.
 *
 * A handful of soft white petals drift down the whole viewport, each with its
 * own size, speed, drift and sway so the motion never looks mechanical. The
 * layer sits behind the page content (pointer-events: none) and is skipped
 * entirely for visitors who prefer reduced motion.
 */

const COUNT = 24;
const SHAPES = ["leaf", "oval", "blob", "dot"] as const;

type Petal = { style: CSSProperties & Record<string, string | number>; shape: string };

function build(): Petal[] {
  const rand = (min: number, max: number) => min + Math.random() * (max - min);
  const pick = <T,>(arr: readonly T[]) =>
    arr[Math.floor(Math.random() * arr.length)];

  return Array.from({ length: COUNT }, () => {
    const shape = pick(SHAPES);
    // Bokeh dots sit "further away": larger, softer, slower, more blurred.
    const dot = shape === "dot";
    return {
      shape,
      style: {
        left: `${rand(0, 100)}%`,
        "--size": `${(dot ? rand(10, 22) : rand(8, 17)).toFixed(1)}px`,
        "--dur": `${rand(12, 26).toFixed(1)}s`,
        "--delay": `${rand(-26, 0).toFixed(1)}s`,
        "--drift": `${rand(-60, 60).toFixed(0)}px`,
        "--sway": `${rand(2.5, 6).toFixed(1)}s`,
        "--spin": `${rand(-30, 30).toFixed(0)}deg`,
        "--opacity": (dot ? rand(0.25, 0.5) : rand(0.55, 0.95)).toFixed(2),
        "--blur": `${(dot ? rand(1.5, 3.5) : rand(0, 0.6)).toFixed(2)}px`,
      },
    };
  });
}

export function Petals() {
  // Build on the client only, so randomized values never trigger a hydration
  // mismatch.
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!reduce) setPetals(build());
  }, []);

  if (petals.length === 0) return null;

  return (
    <div className="petals" aria-hidden="true">
      {petals.map((p, i) => (
        <span key={i} className={`petal v-${p.shape}`} style={p.style}>
          <span className="petal-i" />
        </span>
      ))}
    </div>
  );
}
