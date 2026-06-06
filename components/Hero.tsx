"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useLang } from "./LanguageProvider";
import { Multi } from "./Reveal";
import { ARABIC } from "@/lib/content";

const archVar = (len: number) => ({ "--len": len }) as CSSProperties;

export default function Hero() {
  const { t, tLines } = useLang();
  const [loaded, setLoaded] = useState(false);

  // Trigger the entrance choreography after first paint.
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setLoaded(true)),
    );
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section
      className={`hero${loaded ? " is-loaded" : ""}`}
      data-screen-label="Hero"
    >
      <svg
        className="arch"
        viewBox="0 0 300 380"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <path
          d="M30 372 L30 150 Q30 40 150 18 Q270 40 270 150 L270 372"
          style={archVar(1100)}
        />
        <path
          className="inner"
          d="M48 372 L48 156 Q48 60 150 40 Q252 60 252 156 L252 372"
          style={archVar(1020)}
        />
      </svg>

      <div className="hero-inner">
        <div className="bismillah anim d0">{ARABIC.bismillah}</div>
        <span className="eyebrow hero-eyebrow anim d1">{t("hero_eyebrow")}</span>

        <div className="names">
          <div className="nm script anim d2">{t("hero_bride")}</div>
          <div className="amp anim d3">&amp;</div>
          <div className="nm script anim d3">{t("hero_groom")}</div>
        </div>

        <p className="hero-intro anim d4">
          <Multi lines={tLines("hero_intro")} />
        </p>
        <div className="hero-date anim d5">{t("hero_date")}</div>
      </div>

      <div className="scroll-cue anim d5">
        <span>{t("hero_scroll")}</span>
        <span className="chev" />
      </div>
    </section>
  );
}
