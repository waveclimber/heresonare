import { pageContent, type PageContentItem } from "@/data/pageContent";
import {
  contentLanguageByLocale,
  type ContentLanguage,
  type Locale,
} from "@/i18n/config";

export const productionSlugs = [
  "audio-innovation",
  "creative-platform",
  "live-experience",
] as const;

export type ProductionSlug = (typeof productionSlugs)[number];

export function isProductionSlug(value: string): value is ProductionSlug {
  return productionSlugs.some((slug) => slug === value);
}

function getProductions(language: ContentLanguage): PageContentItem[] {
  return pageContent[language].productions.sections.flatMap(
    (section) => section.items ?? []
  );
}

export function getProductionBySlug(
  language: ContentLanguage,
  slug: ProductionSlug
): PageContentItem | undefined {
  return getProductions(language).find((item) => item.slug === slug);
}

export function getLocalizedProduction(
  locale: Locale,
  slug: ProductionSlug
): PageContentItem | undefined {
  return getProductionBySlug(contentLanguageByLocale[locale], slug);
}

for (const language of ["EN", "JP", "CN"] as const) {
  const items = getProductions(language);
  const supportedItems = items.filter((item) => isProductionSlug(item.slug));

  if (
    supportedItems.length !== productionSlugs.length ||
    productionSlugs.some(
      (slug) => supportedItems.filter((item) => item.slug === slug).length !== 1
    )
  ) {
    throw new Error(
      `Production detail content must contain each approved slug exactly once for ${language}.`
    );
  }
}
