"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { content, type Lang } from "@/lib/content";

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
    document.documentElement.setAttribute("data-lang", lang);
    document.documentElement.setAttribute("lang", lang === "ml" ? "ml" : "en");
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggle = useCallback(
    () => setLangState((prev) => (prev === "en" ? "ml" : "en")),
    [],
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
