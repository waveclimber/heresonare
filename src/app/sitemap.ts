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

function getChangeFrequency(pathname: string) {
  return pathname === "/" ? "weekly" : "monthly";
}

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPaths.flatMap((pathname) =>
    supportedLocales.map((locale: Locale) => ({
      url: getAbsoluteSiteUrl(getLocalizedPath(pathname, locale)),
      changeFrequency: getChangeFrequency(pathname),
      priority: pathname === "/" ? 1 : 0.7,
      alternates: {
        languages: getLanguageAlternates(pathname),
      },
    }))
  );
}
