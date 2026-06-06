"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useLang } from "./LanguageProvider";
import { Reveal, Multi } from "./Reveal";

/**
 * The "bond" beat — an original, symbolic emblem that traces itself in gold as
 * the visitor scrolls through this (tall, pinned) section:
 *
 *   • a pointed ogee arch (mihrab) — echoing the hero's arch; the sacred
 *     threshold the couple crosses together
 *   • a star & crescent at the apex — faith
 *   • an eight-pointed Khatam star (Rub el Hizb) at its heart — completeness
 *   • arabesque vines, buds and a lotus — two lives flourishing as one
 *
 * Scroll position drives a single `--draw` (0→1); each group of strokes reveals
 * within its own slice of that range, so the drawing builds up in layers.
 * Reduced-motion visitors see it finished at rest.
 */

export default function Bond() {
  const { t, tLines } = useLang();
  const sectionRef = useRef<HTMLElement | null>(null);
  const artRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const art = artRef.current;
    if (!section || !art) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      art.style.setProperty("--draw", "1");
      return;
    }

    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      // Complete a touch before the section unpins, so the finished art rests.
      art.style.setProperty("--draw", Math.min(1, p * 1.18).toFixed(3));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="bond" data-screen-label="Bond">
      <div className="bond-sticky">
        <Reveal as="span" className="eyebrow bond-eyebrow">
          {t("bond_eyebrow")}
        </Reveal>

        <div
          ref={artRef}
          className="bond-art"
          style={{ "--draw": 0 } as CSSProperties}
        >
          <svg
            className="bond-svg"
            viewBox="0 0 480 540"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="bond-gold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#e7cd86" />
                <stop offset=".5" stopColor="#b88a3a" />
                <stop offset="1" stopColor="#93692a" />
              </linearGradient>
            </defs>

            {/* ── pointed ogee arch (mihrab) ── */}
            <path
              className="g-arch"
              pathLength={1}
              d="M240 122 C 200 152 186 202 202 252 C 216 300 178 332 152 382 C 136 422 150 456 176 470"
            />
            <path
              className="g-arch"
              pathLength={1}
              d="M240 122 C 280 152 294 202 278 252 C 264 300 302 332 328 382 C 344 422 330 456 304 470"
            />
            {/* inner echo of the arch, fainter */}
            <path
              className="g-arch inner"
              pathLength={1}
              d="M240 150 C 210 174 200 214 212 252 C 224 292 196 318 176 360"
            />
            <path
              className="g-arch inner"
              pathLength={1}
              d="M240 150 C 270 174 280 214 268 252 C 256 292 284 318 304 360"
            />

            {/* ── arabesque vine scrolls inside the arch ── */}
            <path
              className="g-flourish"
              pathLength={1}
              d="M240 168 C 216 184 208 210 218 234 C 226 252 214 266 196 262 C 184 259 182 246 193 241"
            />
            <path
              className="g-flourish"
              pathLength={1}
              d="M240 168 C 264 184 272 210 262 234 C 254 252 266 266 284 262 C 296 259 298 246 287 241"
            />
            {/* small leaves along the arch */}
            <path
              className="g-flourish"
              pathLength={1}
              d="M168 300 C 156 312 154 330 166 340 C 170 326 172 312 168 300 Z"
            />
            <path
              className="g-flourish"
              pathLength={1}
              d="M312 300 C 324 312 326 330 314 340 C 310 326 308 312 312 300 Z"
            />
            {/* upper buds */}
            <path
              className="g-flourish"
              pathLength={1}
              d="M188 230 C 180 222 180 211 188 203 C 196 211 196 222 188 230 Z"
            />
            <path
              className="g-flourish"
              pathLength={1}
              d="M292 230 C 300 222 300 211 292 203 C 284 211 284 222 292 230 Z"
            />

            {/* ── eight-pointed Khatam star (Rub el Hizb) ── */}
            <path
              className="g-medallion"
              pathLength={1}
              d="M240 318 L282 360 L240 402 L198 360 Z"
            />
            <path
              className="g-medallion"
              pathLength={1}
              d="M211 331 L269 331 L269 389 L211 389 Z"
            />
            <circle
              className="g-medallion ring"
              pathLength={1}
              cx="240"
              cy="360"
              r="13"
            />

            {/* ── lotus at the base ── */}
            <path
              className="g-blossom"
              pathLength={1}
              d="M240 474 C 231 459 231 446 240 432 C 249 446 249 459 240 474 Z"
            />
            <path
              className="g-blossom"
              pathLength={1}
              d="M223 470 C 211 461 205 449 209 436 C 221 445 227 458 223 470 Z"
            />
            <path
              className="g-blossom"
              pathLength={1}
              d="M257 470 C 269 461 275 449 271 436 C 259 445 253 458 257 470 Z"
            />
            {/* base flourish line with end curls */}
            <path
              className="g-blossom"
              pathLength={1}
              d="M146 470 C 142 478 148 484 156 484 C 200 498 280 498 324 484 C 332 484 338 478 334 470"
            />

            {/* ── star & crescent at the apex ── */}
            <path
              className="g-crescent"
              pathLength={1}
              d="M250 56 A 30 30 0 1 0 250 116 A 23 23 0 1 1 250 56"
            />
            <path
              className="g-crescent"
              pathLength={1}
              d="M276 60 C 277 68 279 71 287 72 C 279 73 277 76 276 84 C 275 76 273 73 265 72 C 273 71 275 68 276 60 Z"
            />

            {/* ── final gold accents ── */}
            <circle className="g-dot" cx="240" cy="360" r="3" />
            <circle className="g-dot" cx="240" cy="138" r="2.5" />
            <circle className="g-dot" cx="170" cy="300" r="2.5" />
            <circle className="g-dot" cx="310" cy="300" r="2.5" />
            <circle className="g-dot" cx="158" cy="402" r="2.5" />
            <circle className="g-dot" cx="322" cy="402" r="2.5" />
          </svg>
        </div>

        <Reveal as="h2" className="section-title bond-title" d={1}>
          {t("bond_title")}
        </Reveal>
        <Reveal as="p" className="bond-text" d={2}>
          <Multi lines={tLines("bond_text")} />
        </Reveal>
      </div>
    </section>
  );
}
