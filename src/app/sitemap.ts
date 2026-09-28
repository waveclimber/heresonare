import type { MetadataRoute } from "next";

import { navigationRoutes } from "@/data/navigation";
import { productionSlugs } from "@/data/productionRoutes";
import {
  getLocalizedPath,
  htmlLangByLocale,
  supportedLocales,
  type Locale,
} from "@/i18n/config";
import { getAbsoluteSiteUrl } from "@/lib/siteUrl";
import { getPublishedEntries } from "@/platform/server";
import { recordPath } from "@/platform/domain";

export const revalidate = 60;

const publicPaths = [
  "/",
  ...navigationRoutes.map(({ path }) => path),
  ...productionSlugs.map((slug) => `/productions/${slug}`),
];

function getLanguageAlternates(pathname: string) {
  return Object.fromEntries(
    supportedLocales.map((locale) => [
      htmlLangByLocale[locale],
      getAbsoluteSiteUrl(getLocalizedPath(pathname, locale)),
    ])
  );
}

function getChangeFrequency(pathname: string): "weekly" | "monthly" {
  return pathname === "/" ? "weekly" : "monthly";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const published = await getPublishedEntries();
  return [...publicPaths.flatMap((pathname) =>
    supportedLocales.map((locale: Locale) => ({
      url: getAbsoluteSiteUrl(getLocalizedPath(pathname, locale)),
      changeFrequency: getChangeFrequency(pathname),
      priority: pathname === "/" ? 1 : 0.7,
      alternates: {
        languages: getLanguageAlternates(pathname),
      },
    }))
  ), ...published.flatMap((entry) => supportedLocales.map((locale) => ({
    url: getAbsoluteSiteUrl(recordPath(entry, locale)), lastModified: entry.updatedAt,
    alternates: { languages: Object.fromEntries(supportedLocales.map((language) => [htmlLangByLocale[language], getAbsoluteSiteUrl(recordPath(entry, language))])) },
  })))];
}
