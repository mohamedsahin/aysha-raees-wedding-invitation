"use client";

import { useLang } from "./LanguageProvider";
import { Reveal, Multi } from "./Reveal";

/**
 * The "bond" beat — the couple's gold monogram. It (and the surrounding text)
 * simply fades/rises into view once the section is scrolled to. Reduced-motion
 * visitors see it at rest.
 */

export default function Bond() {
  const { t, tLines } = useLang();

  return (
    <section className="bond" data-screen-label="Bond">
      <Reveal as="span" className="eyebrow bond-eyebrow">
        {t("bond_eyebrow")}
      </Reveal>

      <Reveal className="bond-art" d={1}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="bond-mono" src="/name.svg" alt="" aria-hidden="true" />
        <span className="bond-shine" aria-hidden="true" />
      </Reveal>

      <Reveal as="h2" className="section-title bond-title" d={2}>
        {t("bond_title")}
      </Reveal>
      <Reveal as="p" className="bond-text" d={3}>
        <Multi lines={tLines("bond_text")} />
      </Reveal>
    </section>
  );
}
