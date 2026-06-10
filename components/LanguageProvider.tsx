"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { content, type Lang } from "@/lib/content";

// How long the text fades out before the language swaps (kept in sync with the
// `main` opacity transition in globals.css).
const SWITCH_MS = 260;

type LangContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: string) => string;
  tLines: (key: string) => string[];
};

const LangContext = createContext<LangContextValue | null>(null);

const STORAGE_KEY = "ar_lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const langRef = useRef<Lang>("en");
  const timer = useRef<number | null>(null);

  // Restore saved preference after mount (avoids SSR/hydration mismatch).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "ml") setLangState(saved);
    } catch {
      /* ignore */
    }
  }, []);

  // Reflect language on <html> so the [data-lang] CSS hooks (fonts, spacing)
  // apply, and persist the choice.
  useEffect(() => {
    langRef.current = lang;
    document.documentElement.setAttribute("data-lang", lang);
    document.documentElement.setAttribute("lang", lang === "ml" ? "ml" : "en");
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  // Crossfade between languages: fade the text out, swap while it's hidden (so
  // the font/length reflow isn't visible), then fade back in. Falls back to an
  // instant swap when the user prefers reduced motion.
  const transition = useCallback((next: Lang) => {
    const root = document.documentElement;
    if (next === langRef.current) return;
    langRef.current = next;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setLangState(next);
      return;
    }

    if (timer.current) window.clearTimeout(timer.current);
    root.setAttribute("data-lang-switching", "1"); // fade out (CSS)
    timer.current = window.setTimeout(() => {
      setLangState(next); // swap text while invisible
      // Wait for the new text to paint, then fade back in.
      requestAnimationFrame(() =>
        requestAnimationFrame(() =>
          root.setAttribute("data-lang-switching", "0"),
        ),
      );
    }, SWITCH_MS);
  }, []);

  const setLang = useCallback((l: Lang) => transition(l), [transition]);
  const toggle = useCallback(
    () => transition(langRef.current === "en" ? "ml" : "en"),
    [transition],
  );
  const t = useCallback(
    (key: string) => {
      const entry = content[key];
      return entry ? entry[lang] ?? entry.en : key;
    },
    [lang],
  );
  const tLines = useCallback((key: string) => t(key).split("\n"), [t]);

  return (
    <LangContext.Provider value={{ lang, setLang, toggle, t, tLines }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within a LanguageProvider");
  return ctx;
}
