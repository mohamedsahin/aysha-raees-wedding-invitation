"use client";

import { useLang } from "./LanguageProvider";
import { Reveal, Multi } from "./Reveal";

export default function Families() {
  const { t, tLines } = useLang();

  return (
    <section className="families" data-screen-label="Families">
      <div className="wrap">
        <Reveal as="span" className="eyebrow fam-head">
          {t("fam_eyebrow")}
        </Reveal>
        <Reveal as="h2" className="section-title" d={1}>
          {t("fam_title")}
        </Reveal>
        <Reveal className="divider" d={1}>
          <span className="line rev" />
          <span className="dia" />
          <span className="line" />
        </Reveal>

        <div className="fam-grid">
          {/* Bride */}
          <Reveal className="fam-card" d={1}>
            <div className="fam-label">{t("bride_label")}</div>
            <div className="fam-name">{t("bride_name")}</div>
            <p className="fam-line">
              <Multi lines={tLines("bride_parents")} />
            </p>
            <p className="fam-line">
              <Multi lines={tLines("bride_grand")} />
            </p>
            <div className="fam-addr">{t("bride_address")}</div>
          </Reveal>

          {/* centre ornament */}
          <Reveal className="fam-mid" d={2}>
            <div className="ring">&amp;</div>
          </Reveal>

          {/* Groom */}
          <Reveal className="fam-card" d={3}>
            <div className="fam-label">{t("groom_label")}</div>
            <div className="fam-name">{t("groom_name")}</div>
            <p className="fam-line">
              <Multi lines={tLines("groom_parents")} />
            </p>
            <p className="fam-line">
              <Multi lines={tLines("groom_grand")} />
            </p>
            <div className="fam-addr">{t("groom_address")}</div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
