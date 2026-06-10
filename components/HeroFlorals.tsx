"use client";

import type { CSSProperties } from "react";

/**
 * Hero florals, in two parts:
 *  1. A floral crown that sits ON TOP of the arch (drawn in the arch's own
 *     viewBox so it aligns + scales with it) — kept above the apex so it never
 *     touches the names/bismillah inside the arch.
 *  2. Two corner sprays (top-left + bottom-right of the hero).
 *
 * Every blossom/leaf blooms from a bud once the hero loads — see globals.css
 * (`.hero.is-loaded .item`).
 */

const d = (delay: number) => ({ "--d": `${delay}s` }) as CSSProperties;

function Blossom({
  cx,
  cy,
  r,
  petal,
  center,
  delay,
}: {
  cx: number;
  cy: number;
  r: number;
  petal: string;
  center: string;
  delay: number;
}) {
  return (
    <g className="item" style={d(delay)}>
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse
          key={i}
          cx={cx}
          cy={cy - r * 0.46}
          rx={r * 0.4}
          ry={r * 0.56}
          fill={petal}
          transform={`rotate(${i * 72} ${cx} ${cy})`}
        />
      ))}
      <circle cx={cx} cy={cy} r={r * 0.34} fill={center} />
      <circle cx={cx} cy={cy} r={r * 0.13} fill="#fff" opacity={0.55} />
    </g>
  );
}

function Leaf({
  x,
  y,
  rot,
  len,
  fill,
  delay,
}: {
  x: number;
  y: number;
  rot: number;
  len: number;
  fill: string;
  delay: number;
}) {
  return (
    <g className="item" style={d(delay)}>
      <g transform={`translate(${x} ${y}) rotate(${rot})`}>
        <path
          d={`M0 0 Q ${len * 0.36} ${-len * 0.5} 0 ${-len} Q ${-len * 0.36} ${-len * 0.5} 0 0 Z`}
          fill={fill}
        />
        <path d={`M0 0 L0 ${-len}`} stroke="rgba(0,0,0,.14)" strokeWidth={1} />
      </g>
    </g>
  );
}

/**
 * Left half of the garland: a crown on the apex, trailing down the upper-left
 * arch curve toward the text (mirrored for the right). Flowers sit behind the
 * text layer, so the names stay readable where they meet.
 */
function CrownHalf() {
  return (
    <>
      {/* leaves (behind) */}
      <Leaf x={112} y={-14} rot={26} len={24} fill="#4d7359" delay={0.1} />
      <Leaf x={86} y={-6} rot={-16} len={22} fill="#3f6149" delay={0.15} />
      <Leaf x={130} y={14} rot={54} len={20} fill="#57805f" delay={0.2} />
      <Leaf x={74} y={56} rot={28} len={24} fill="#456b53" delay={0.25} />
      <Leaf x={32} y={82} rot={-42} len={24} fill="#4d7359" delay={0.3} />
      <Leaf x={64} y={110} rot={20} len={22} fill="#3f6149" delay={0.35} />
      <Leaf x={34} y={140} rot={-28} len={22} fill="#57805f" delay={0.4} />

      {/* blossoms — apex crown, then down the shoulder */}
      <Blossom cx={124} cy={6} r={18} petal="#8e3b44" center="#b88a3a" delay={0.46} />
      <Blossom cx={100} cy={16} r={14} petal="#e0a7a0" center="#b88a3a" delay={0.54} />
      <Blossom cx={80} cy={4} r={12} petal="#b86b72" center="#caa23a" delay={0.6} />
      <Blossom cx={58} cy={54} r={15} petal="#8e3b44" center="#b88a3a" delay={0.66} />
      <Blossom cx={46} cy={96} r={13} petal="#e0a7a0" center="#caa23a" delay={0.72} />
      <Blossom cx={50} cy={134} r={12} petal="#b86b72" center="#caa23a" delay={0.78} />

      {/* small buds */}
      <Blossom cx={140} cy={-12} r={8} petal="#9c4a52" center="#caa23a" delay={0.84} />
      <Blossom cx={38} cy={74} r={7} petal="#9c4a52" center="#caa23a" delay={0.88} />
      <Blossom cx={42} cy={158} r={7} petal="#e0a7a0" center="#caa23a" delay={0.92} />
    </>
  );
}

/** A corner spray (viewBox 240×240, anchored at the corner). */
function CornerSpray() {
  return (
    <svg className="floral-svg" viewBox="0 0 240 240" aria-hidden="true">
      <Leaf x={150} y={70} rot={40} len={48} fill="#4d7359" delay={0.12} />
      <Leaf x={36} y={92} rot={-46} len={40} fill="#3f6149" delay={0.18} />
      <Leaf x={118} y={128} rot={74} len={44} fill="#57805f" delay={0.24} />
      <Leaf x={70} y={156} rot={-18} len={40} fill="#456b53" delay={0.3} />
      <Leaf x={168} y={120} rot={118} len={38} fill="#4d7359" delay={0.36} />

      <Blossom cx={66} cy={72} r={32} petal="#8e3b44" center="#b88a3a" delay={0.44} />
      <Blossom cx={118} cy={54} r={22} petal="#e0a7a0" center="#b88a3a" delay={0.56} />
      <Blossom cx={52} cy={120} r={20} petal="#b86b72" center="#caa23a" delay={0.64} />

      <Blossom cx={150} cy={96} r={11} petal="#9c4a52" center="#caa23a" delay={0.72} />
      <Blossom cx={98} cy={152} r={10} petal="#e0a7a0" center="#caa23a" delay={0.8} />
    </svg>
  );
}

export function HeroFlorals() {
  return (
    <>
      {/* crown resting on the arch top */}
      <svg
        className="arch-florals"
        viewBox="0 0 300 380"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <g className="garland" transform="translate(0,-12)">
          <CrownHalf />
        </g>
        <g className="garland" transform="translate(300,-12) scale(-1,1)">
          <CrownHalf />
        </g>
      </svg>

      {/* corner sprays */}
      <div className="hero-florals" aria-hidden="true">
        <div className="floral tl">
          <CornerSpray />
        </div>
        <div className="floral br">
          <CornerSpray />
        </div>
      </div>
    </>
  );
}
