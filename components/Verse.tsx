"use client";

import { useLang } from "./LanguageProvider";
import { Reveal } from "./Reveal";
import { GemVelvet } from "./GemVelvet";
import { ARABIC } from "@/lib/content";

export default function Verse() {
  const { t } = useLang();

  return (
    <section className="verse" data-screen-label="Verse">
      <GemVelvet />

      <div className="wrap">
        <Reveal as="span" className="eyebrow">
          {t("verse_eyebrow")}
        </Reveal>
        <Reveal className="verse-arabic" d={1}>
          {ARABIC.verse}
        </Reveal>
        <Reveal as="p" className="verse-text" d={2}>
          {t("verse_text")}
        </Reveal>
        <Reveal className="verse-ref" d={3}>
          {t("verse_ref")}
        </Reveal>
      </div>
    </section>
  );
}
