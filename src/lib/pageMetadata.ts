import type { Metadata } from "next";
import type {
  PageContentItem,
  StaticPageContent,
} from "@/data/pageContent";
import type { SiteMetadataContent } from "@/content/contracts";
import {
  getLocalizedPath,
  htmlLangByLocale,
  openGraphLocaleByLocale,
  supportedLocales,
  type Locale,
} from "@/i18n/config";
import { getAbsoluteSiteUrl, siteUrl } from "@/lib/siteUrl";
import { brandName } from "@/lib/siteIdentity";
import {
  getSocialCardAlt,
  socialCardContentType,
  socialCardSize,
} from "@/lib/socialCard";

function buildMetadata(
  title: string,
  description: string,
  locale: Locale,
  pathname: string,
  siteContent: SiteMetadataContent,
): Metadata {
  const canonicalPath = getLocalizedPath(pathname, locale);
  const socialCardAlt = getSocialCardAlt(siteContent);
  const openGraphImage = {
    url: getAbsoluteSiteUrl(`/${locale}/opengraph-image/brand-share`),
    ...socialCardSize,
    alt: socialCardAlt,
    type: socialCardContentType,
  };
  const twitterImage = {
    url: getAbsoluteSiteUrl(`/${locale}/twitter-image/brand-share`),
    ...socialCardSize,
    alt: socialCardAlt,
    type: socialCardContentType,
  };
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
      images: [openGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [twitterImage],
    },
  };
}

export function createSiteMetadata(content: SiteMetadataContent): Metadata {
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

export function createHomeMetadata(
  locale: Locale,
  content: SiteMetadataContent,
): Metadata {
  return buildMetadata(
    `${brandName} | ${content.heroSubtitle}`,
    content.heroDescription,
    locale,
    "/",
    content,
  );
}

export function createPageMetadata(
  page: StaticPageContent,
  locale: Locale,
  siteContent: SiteMetadataContent,
): Metadata {
  return buildMetadata(
    `${page.hero.title} | ${brandName}`,
    page.hero.description,
    locale,
    `/${page.slug}`,
    siteContent,
  );
}

export function createProductionMetadata(
  production: PageContentItem,
  locale: Locale,
  siteContent: SiteMetadataContent,
): Metadata {
  return buildMetadata(
    `${production.title} | ${brandName}`,
    production.description,
    locale,
    `/productions/${production.slug}`,
    siteContent,
  );
}
