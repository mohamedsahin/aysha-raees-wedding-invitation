"use client";

import { useEffect, useState } from "react";

/**
 * Cinematic opening sequence.
 *
 * The couple's gold monogram fades in inside a self-tracing ring, then the
 * cream screen parts like a curtain to reveal the invitation beneath. Scroll is
 * locked for the ~2.2s reveal. Visitors who prefer reduced motion skip straight
 * to the page.
 */

type Phase = "show" | "open" | "done";

export function Intro() {
  const [phase, setPhase] = useState<Phase>("show");

  useEffect(() => {
    const w = window as unknown as { __introRevealed?: boolean };
    // Signal the hero (and anything else) that the curtain is opening, so they
    // can choreograph their entrance to the reveal.
    const reveal = () => {
      w.__introRevealed = true;
      window.dispatchEvent(new Event("intro-reveal"));
    };

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Skip only for reduced-motion visitors — otherwise play on every load.
    if (reduce) {
      setPhase("done");
      reveal();
      return;
    }

    document.body.style.overflow = "hidden";
    const toOpen = setTimeout(() => {
      setPhase("open");
      reveal();
    }, 2200);
    const toDone = setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
    }, 3300);

    return () => {
      clearTimeout(toOpen);
      clearTimeout(toDone);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div className={`intro ${phase}`} aria-hidden="true">
      <span className="intro-panel top" />
      <span className="intro-panel bottom" />

      <div className="intro-mark">
        <div className="intro-emblem">
          <svg className="intro-ring" viewBox="0 0 200 200">
            <circle className="r-out" cx="100" cy="100" r="74" />
            <circle className="r-in" cx="100" cy="100" r="66" />
          </svg>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="intro-mono" src="/name.svg" alt="" />
        </div>
        <div className="intro-sub">August 2026</div>
      </div>
    </div>
  );
}
