"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import {
  contentLanguageByLocale,
  type ContentLanguage,
  type Locale,
} from "@/i18n/config";

type LanguageContextType = {
  language: ContentLanguage;
  locale: Locale;
};

const LanguageContext =
  createContext<LanguageContextType | null>(null);

export function LanguageProvider({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Locale;
}) {
  const language = contentLanguageByLocale[locale];

  return (
    <LanguageContext.Provider
      value={{ language, locale }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used within LanguageProvider"
    );
  }

  return context;
}
