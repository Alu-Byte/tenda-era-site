"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { Lang } from "./i18n";
import { translations } from "./i18n";

type AnyTranslation = (typeof translations)[Lang];

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: AnyTranslation;
}

const LangContext = createContext<LangContextValue>({
  lang: "sq",
  setLang: () => {},
  t: translations.sq,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("sq");

  useEffect(() => {
    const stored = localStorage.getItem("te_lang") as Lang | null;
    if (stored === "en" || stored === "sq") setLangState(stored);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("te_lang", l);
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
