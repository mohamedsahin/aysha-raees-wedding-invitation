"use client";

import { useLang } from "./LanguageProvider";
import { Reveal } from "./Reveal";
import { ARABIC } from "@/lib/content";

export default function Footer() {
  const { t } = useLang();
  return (
    <section className="footer" data-screen-label="Footer">
      <div className="wrap">
        <Reveal as="span" className="eyebrow">
          {t("footer_eyebrow")}
        </Reveal>
        <Reveal as="p" className="footer-text" d={1}>
          {t("footer_text")}
        </Reveal>
        <Reveal className="footer-names" d={2}>
          {t("footer_names")}
        </Reveal>
        <Reveal className="footer-dua" d={3}>
          {ARABIC.dua}
        </Reveal>
        <Reveal className="footer-dua-t" d={3}>
          {t("footer_dua_t")}
        </Reveal>
      </div>
    </section>
  );
}
