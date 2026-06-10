"use client";

import { useLang } from "./LanguageProvider";

export function LanguageToggle() {
  const { lang, toggle } = useLang();
  return (
    <button
      className="lang-toggle"
      onClick={toggle}
      aria-label="Switch language"
      data-track="language-toggle"
    >
      <svg
        className="globe"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
      </svg>
      <span className="lbl">{lang === "en" ? "മലയാളം" : "English"}</span>
    </button>
  );
}
