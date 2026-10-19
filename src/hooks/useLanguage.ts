"use client";

import { useState, useCallback, useEffect } from "react";
import { type Language, LANGUAGES, t } from "@/lib/i18n";

interface UseLanguageReturn {
  lang: Language;
  setLang: (l: Language) => void;
  tr: (key: string) => string;
  speechCode: string;
  languages: typeof LANGUAGES;
}

export function useLanguage(): UseLanguageReturn {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("kisanlens-lang") as Language;
      if (saved && LANGUAGES.some((l) => l.code === saved)) {
        setLangState(saved);
      }
    }
  }, []);

  const setLang = useCallback((l: Language) => {
    setLangState(l);
    if (typeof window !== "undefined") {
      localStorage.setItem("kisanlens-lang", l);
    }
  }, []);

  const tr = useCallback(
    (key: string) => t(lang, key),
    [lang]
  );

  const speechCode = LANGUAGES.find((l) => l.code === lang)?.speechCode || "en-IN";

  return { lang, setLang, tr, speechCode, languages: LANGUAGES };
}
