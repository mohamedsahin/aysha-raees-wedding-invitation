"use client";

import { useEffect, useState, type CSSProperties } from "react";

/**
 * Decorative layer for the emerald sections: flowing velvet + scattered jewels.
 * Jewels are placed around the edges so centred text stays clean. Render it as
 * the first child of a `position: relative; isolation: isolate` section, with
 * the section's real content given a higher z-index.
 */

// Jewel palettes — [highlight, body, shadow] — echoing the reference image.
const TONES: [string, string, string][] = [
  ["#7ff0bf", "#1fae6a", "#064e3b"], // emerald
  ["#ff9fae", "#e11d48", "#6b0f1a"], // ruby
  ["#9cc0ff", "#2f6bf0", "#14245e"], // sapphire
  ["#dcb0ff", "#9333ea", "#3b1466"], // amethyst
  ["#ffe39c", "#f3a712", "#7c4a07"], // citrine
  ["#fff1c6", "#e6b53f", "#8a6516"], // topaz
  ["#ffbcde", "#ec4899", "#7a1247"], // pink
  ["#a6f3e9", "#15b8a6", "#0b4f49"], // aqua
  ["#ffffff", "#cfe0ff", "#9fb4d8"], // diamond
];
const CUTS = ["round", "pear", "marquise", "oval", "cushion"];

// Place jewels around the edges so the text in the centre stays clean.
const REGIONS: { l: [number, number]; t: [number, number] }[] = [
  { l: [1, 15], t: [6, 94] }, // left margin
  { l: [85, 99], t: [6, 94] }, // right margin
  { l: [14, 86], t: [1, 17] }, // top band
  { l: [14, 86], t: [82, 97] }, // bottom band
];

type Gem = { style: CSSProperties & Record<string, string | number>; cut: string };

function buildGems(count: number): Gem[] {
  const rand = (a: number, b: number) => a + Math.random() * (b - a);
  const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

  return Array.from({ length: count }, () => {
    const region = pick(REGIONS);
    const [c1, c2, c3] = pick(TONES);
    return {
      cut: pick(CUTS),
      style: {
        "--x": `${rand(region.l[0], region.l[1]).toFixed(2)}%`,
        "--y": `${rand(region.t[0], region.t[1]).toFixed(2)}%`,
        "--size": `${rand(15, 40).toFixed(1)}px`,
        "--c1": c1,
        "--c2": c2,
        "--c3": c3,
        "--rot": `${rand(-14, 14).toFixed(1)}deg`,
        "--fdur": `${rand(6.5, 12).toFixed(2)}s`,
        "--fdelay": `${rand(-9, 0).toFixed(2)}s`,
        "--tdur": `${rand(2.4, 4.6).toFixed(2)}s`,
        "--tdelay": `${rand(-4, 0).toFixed(2)}s`,
      },
    };
  });
}

export function GemVelvet({ count = 18 }: { count?: number }) {
  const [gems, setGems] = useState<Gem[]>([]);

  // Build client-side so randomized values never cause a hydration mismatch.
  useEffect(() => {
    setGems(buildGems(count));
  }, [count]);

  return (
    <>
      <div className="velvet" aria-hidden="true" />
      <div className="gems" aria-hidden="true">
        {gems.map((g, i) => (
          <span key={i} className={`gem cut-${g.cut}`} style={g.style} />
        ))}
      </div>
    </>
  );
}
