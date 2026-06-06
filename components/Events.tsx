"use client";

import { useLang } from "./LanguageProvider";
import { Reveal } from "./Reveal";
import { MAP_LINKS } from "@/lib/content";

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

export default function Events() {
  const { t } = useLang();

  return (
    <section className="events" data-screen-label="Events">
      <div className="wrap">
        <Reveal as="span" className="eyebrow">
          {t("events_eyebrow")}
        </Reveal>
        <Reveal as="h2" className="section-title" d={1}>
          {t("events_title")}
        </Reveal>
        <Reveal className="divider" d={1}>
          <span className="line rev" />
          <span className="dia" />
          <span className="line" />
        </Reveal>

        <div className="ev-grid">
          {/* Nikah */}
          <Reveal className="ev-card" d={1}>
            <svg
              className="ev-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.3}
              aria-hidden="true"
            >
              <path d="M12 21c5-3.5 7-7 7-10.5A4.5 4.5 0 0 0 12 6a4.5 4.5 0 0 0-7 4.5C5 14 7 17.5 12 21Z" />
            </svg>
            <div className="ev-label">{t("nikah_label")}</div>
            <div className="ev-day">{t("nikah_day")}</div>
            <div className="ev-date">{t("nikah_date")}</div>
            <div className="ev-rule" />
            <div className="ev-time">{t("nikah_time")}</div>
            <div className="ev-venue">{t("nikah_venue")}</div>
            <div className="ev-place">{t("nikah_place")}</div>
            <a
              className="ev-dir"
              href={MAP_LINKS.nikah}
              target="_blank"
              rel="noopener noreferrer"
            >
              <PinIcon />
              <span>{t("btn_directions")}</span>
            </a>
          </Reveal>

          {/* Reception */}
          <Reveal className="ev-card" d={2}>
            <svg
              className="ev-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.3}
              aria-hidden="true"
            >
              <path d="M7 11a5 5 0 0 1 10 0v1H7v-1Z" />
              <path d="M5 12h14M12 12v7M9 19h6" />
              <path d="M12 6V4" />
            </svg>
            <div className="ev-label">{t("recep_label")}</div>
            <div className="ev-day">{t("recep_day")}</div>
            <div className="ev-date">{t("recep_date")}</div>
            <div className="ev-rule" />
            <div className="ev-time">{t("recep_time")}</div>
            <div className="ev-venue">{t("recep_venue")}</div>
            <div className="ev-place">{t("recep_place")}</div>
            <a
              className="ev-dir"
              href={MAP_LINKS.reception}
              target="_blank"
              rel="noopener noreferrer"
            >
              <PinIcon />
              <span>{t("btn_directions")}</span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
