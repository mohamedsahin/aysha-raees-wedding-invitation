"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Minimalist water-ripple effect that trails the cursor.
 *
 * As the pointer moves, soft concentric rings bloom and fade at its position.
 * Spawns are throttled by both time and distance so the trail stays calm and
 * pleasant rather than noisy. Disabled for reduced-motion visitors and on
 * touch-only devices (no hovering cursor to follow).
 */

type Ripple = { id: number; x: number; y: number };

const MIN_INTERVAL = 90; // ms between ripples
const MIN_DISTANCE = 24; // px the cursor must travel between ripples
const MAX_ON_SCREEN = 14;

export function Ripples() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const idRef = useRef(0);
  const last = useRef({ x: 0, y: 0, t: 0 });

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !fine) return;

    const onMove = (e: PointerEvent) => {
      const t = performance.now();
      const dist = Math.hypot(e.clientX - last.current.x, e.clientY - last.current.y);
      if (t - last.current.t < MIN_INTERVAL || dist < MIN_DISTANCE) return;
      last.current = { x: e.clientX, y: e.clientY, t };
      const id = idRef.current++;
      setRipples((r) =>
        [...r, { id, x: e.clientX, y: e.clientY }].slice(-MAX_ON_SCREEN),
      );
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const remove = (id: number) =>
    setRipples((r) => r.filter((p) => p.id !== id));

  return (
    <div className="ripple-layer" aria-hidden="true">
      {ripples.map((r) => (
        <span
          key={r.id}
          className="ripple"
          style={{ left: r.x, top: r.y }}
          onAnimationEnd={() => remove(r.id)}
        />
      ))}
    </div>
  );
}
