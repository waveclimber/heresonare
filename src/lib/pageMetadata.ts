import type { Metadata } from "next";
import { pageContent, type PageKey } from "@/data/pageContent";
import { siteContent } from "@/data/siteContent";
import {
  contentLanguageByLocale,
  getLanguageAlternates,
  openGraphLocaleByLocale,
  type Locale,
} from "@/i18n/config";

const BRAND_NAME = "h\u00e9ReSonare";

function buildMetadata(
  title: string,
  description: string,
  locale: Locale,
  pathname: string
): Metadata {
  return {
    title,
    description,
    alternates: {
      languages: getLanguageAlternates(pathname),
    },
    openGraph: {
      title,
      description,
      siteName: BRAND_NAME,
      locale: openGraphLocaleByLocale[locale],
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export function createSiteMetadata(locale: Locale): Metadata {
  const language = contentLanguageByLocale[locale];
  const content = siteContent[language];

  return {
    title: `${BRAND_NAME} | ${content.heroSubtitle}`,
    description: content.heroDescription,
    keywords: [
      BRAND_NAME,
      "Sound Beyond Boundaries",
      "Audio Innovation",
      "Creative Technology",
      "Sound Design",
      "Creative Brand",
      "Future Experience",
    ],
    authors: [{ name: BRAND_NAME }],
    creator: BRAND_NAME,
    icons: {
      icon: "/icon.png",
      apple: "/apple-icon.png",
    },
  };
}

export function createHomeMetadata(locale: Locale): Metadata {
  const language = contentLanguageByLocale[locale];
  const content = siteContent[language];

  return buildMetadata(
    `${BRAND_NAME} | ${content.heroSubtitle}`,
    content.heroDescription,
    locale,
    "/"
  );
}

export function createPageMetadata(
  pageKey: PageKey,
  locale: Locale
): Metadata {
  const language = contentLanguageByLocale[locale];
  const page = pageContent[language][pageKey];

  return buildMetadata(
    `${page.hero.title} | ${BRAND_NAME}`,
    page.hero.description,
    locale,
    `/${pageKey}`
  );
}
