import type { Metadata } from "next";
import {
  pageContent,
  type PageContentItem,
  type PageKey,
} from "@/data/pageContent";
import { siteContent } from "@/data/siteContent";
import {
  contentLanguageByLocale,
  getLocalizedPath,
  htmlLangByLocale,
  openGraphLocaleByLocale,
  supportedLocales,
  type Locale,
} from "@/i18n/config";
import { getAbsoluteSiteUrl, siteUrl } from "@/lib/siteUrl";
import { brandName } from "@/lib/siteIdentity";

function buildMetadata(
  title: string,
  description: string,
  locale: Locale,
  pathname: string
): Metadata {
  const canonicalPath = getLocalizedPath(pathname, locale);
  const languages = Object.fromEntries([
    ...supportedLocales.map((supportedLocale) => [
      htmlLangByLocale[supportedLocale],
      getAbsoluteSiteUrl(getLocalizedPath(pathname, supportedLocale)),
    ]),
    ["x-default", getAbsoluteSiteUrl(getLocalizedPath(pathname, "en"))],
  ]);

  return {
    title,
    description,
    alternates: {
      canonical: getAbsoluteSiteUrl(canonicalPath),
      languages,
    },
    openGraph: {
      title,
      description,
      siteName: brandName,
      locale: openGraphLocaleByLocale[locale],
      type: "website",
      url: getAbsoluteSiteUrl(canonicalPath),
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
    metadataBase: siteUrl,
    title: `${brandName} | ${content.heroSubtitle}`,
    description: content.heroDescription,
    keywords: [
      brandName,
      "Sound Beyond Boundaries",
      "Audio Innovation",
      "Creative Technology",
      "Sound Design",
      "Creative Brand",
      "Future Experience",
    ],
    authors: [{ name: brandName }],
    creator: brandName,
    icons: {
      icon: "/icon.png",
      apple: "/apple-icon.png",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export function createHomeMetadata(locale: Locale): Metadata {
  const language = contentLanguageByLocale[locale];
  const content = siteContent[language];

  return buildMetadata(
    `${brandName} | ${content.heroSubtitle}`,
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
    `${page.hero.title} | ${brandName}`,
    page.hero.description,
    locale,
    `/${pageKey}`
  );
}

export function createProductionMetadata(
  production: PageContentItem,
  locale: Locale
): Metadata {
  return buildMetadata(
    `${production.title} | ${brandName}`,
    production.description,
    locale,
    `/productions/${production.slug}`
  );
}
