"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useLang } from "./LanguageProvider";
import { Reveal, Multi } from "./Reveal";

/**
 * The "bond" beat — a line-art mosque that traces itself in gold as the visitor
 * scrolls through this (tall, pinned) section: the prayer hall, two minarets, a
 * central onion dome, an arched mihrab doorway, and crescents.
 *
 * Scroll position drives a single `--draw` (0→1); each group of strokes reveals
 * within its own slice of that range, so the mosque builds bottom-to-top like a
 * hand drawing it. Reduced-motion visitors see it finished at rest.
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

            {/* ── ground & prayer-hall outline ── */}
            <path className="m-base" pathLength={1} d="M92 474 L388 474" />
            <path
              className="m-base"
              pathLength={1}
              d="M160 472 L160 312 Q160 300 172 300 L308 300 Q320 300 320 312 L320 472"
            />
            {/* dome base lintel */}
            <path className="m-base" pathLength={1} d="M178 300 L302 300" />

            {/* ── two minarets ── */}
            <path
              className="m-minaret"
              pathLength={1}
              d="M122 472 L122 256 L138 256 L138 472"
            />
            <path className="m-minaret" pathLength={1} d="M114 256 L146 256" />
            <path
              className="m-minaret"
              pathLength={1}
              d="M124 256 C 121 244 126 234 130 226 C 134 234 139 244 136 256"
            />
            <path
              className="m-minaret"
              pathLength={1}
              d="M358 472 L358 256 L342 256 L342 472"
            />
            <path className="m-minaret" pathLength={1} d="M334 256 L366 256" />
            <path
              className="m-minaret"
              pathLength={1}
              d="M356 256 C 359 244 354 234 350 226 C 346 234 341 244 344 256"
            />

            {/* ── central onion dome ── */}
            <path
              className="m-dome"
              pathLength={1}
              d="M186 300 C 168 268 178 238 206 220 C 226 208 233 196 240 182"
            />
            <path
              className="m-dome"
              pathLength={1}
              d="M294 300 C 312 268 302 238 274 220 C 254 208 247 196 240 182"
            />

            {/* ── mihrab doorway & windows ── */}
            <path
              className="m-door"
              pathLength={1}
              d="M210 472 L210 372 C 210 348 224 338 240 338 C 256 338 270 348 270 372 L270 472"
            />
            <path
              className="m-door"
              pathLength={1}
              d="M176 360 L176 340 C 176 332 182 328 188 328 C 194 328 200 332 200 340 L200 360"
            />
            <path
              className="m-door"
              pathLength={1}
              d="M304 360 L304 340 C 304 332 298 328 292 328 C 286 328 280 332 280 340 L280 360"
            />

            {/* ── finials & crescents ── */}
            <path className="m-crescent" pathLength={1} d="M240 182 L240 166" />
            <path
              className="m-crescent"
              pathLength={1}
              d="M246 150 A 12 12 0 1 0 246 174 A 9 9 0 1 1 246 150"
            />
            <path className="m-crescent" pathLength={1} d="M130 226 L130 214" />
            <path className="m-crescent" pathLength={1} d="M350 226 L350 214" />

            {/* ── stars in the sky ── */}
            <circle className="m-dot" cx="130" cy="210" r="2.6" />
            <circle className="m-dot" cx="350" cy="210" r="2.6" />
            <circle className="m-dot" cx="240" cy="128" r="3" />
            <circle className="m-dot" cx="190" cy="166" r="2.4" />
            <circle className="m-dot" cx="290" cy="166" r="2.4" />
            <circle className="m-dot" cx="150" cy="232" r="2.4" />
            <circle className="m-dot" cx="330" cy="232" r="2.4" />
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
