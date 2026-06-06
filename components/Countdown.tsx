"use client";

import { useEffect, useState } from "react";
import { useLang } from "./LanguageProvider";
import { Reveal } from "./Reveal";
import { TARGET_ISO } from "@/lib/content";

const TARGET = new Date(TARGET_ISO).getTime();

type Remaining = { days: number; hours: number; mins: number; secs: number };

function calc(): Remaining | null {
  const diff = TARGET - Date.now();
  if (diff <= 0) return null;
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    mins: Math.floor((s % 3600) / 60),
    secs: s % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function Countdown() {
  const { t } = useLang();
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<Remaining | null>(null);

  useEffect(() => {
    setMounted(true);
    setTime(calc());
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  const cells: { key: string; value: number }[] = [
    { key: "count_days", value: time?.days ?? 0 },
    { key: "count_hours", value: time?.hours ?? 0 },
    { key: "count_mins", value: time?.mins ?? 0 },
    { key: "count_secs", value: time?.secs ?? 0 },
  ];

  return (
    <section className="countdown" data-screen-label="Countdown">
      <div className="wrap">
        <Reveal as="span" className="eyebrow">
          {t("count_eyebrow")}
        </Reveal>
        <Reveal className="section-title script" d={1} style={{ marginTop: 14 }}>
          {t("count_title")}
        </Reveal>

        {mounted && !time ? (
          <Reveal className="count-done" d={2}>
            {t("count_done")}
          </Reveal>
        ) : (
          <Reveal className="count-grid" d={2}>
            {cells.map(({ key, value }) => (
              <div className="count-cell" key={key}>
                <div className="count-num">
                  {/* `key` on the span remounts it each change, replaying the pop */}
                  <span className="tick" key={mounted ? value : "init"}>
                    {mounted ? pad(value) : "--"}
                  </span>
                </div>
                <div className="count-label">{t(key)}</div>
              </div>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
}
