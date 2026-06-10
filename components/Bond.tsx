"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useLang } from "./LanguageProvider";
import { Reveal, Multi } from "./Reveal";

/**
 * The "bond" beat — the couple's gold monogram, revealed top→bottom as the
 * visitor scrolls through this (tall, pinned) section. Scroll position drives a
 * single `--draw` (0→1) that controls the reveal mask. Reduced-motion visitors
 * see it finished at rest.
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="bond-mono" src="/monography.png" alt="" aria-hidden="true" />
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
