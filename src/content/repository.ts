import "server-only";

import { cache } from "react";

import { staticContentRepository } from "@/content/staticContentRepository";
import type {
  HomePageContent,
  SiteShellContent,
} from "@/content/contracts";
import type { ContentLanguage } from "@/i18n/config";

const contentRepository = staticContentRepository;
const homePageExcludedFields = [
  "footerCopyright",
  "footerSlogan",
  "pages",
  "product1Text",
  "product1Title",
  "product2Text",
  "product2Title",
  "product3Text",
  "product3Title",
  "productsTitle",
] as const;

function omitFields<T extends object, K extends keyof T>(
  value: T,
  excludedFields: readonly K[],
): Omit<T, K> {
  const excluded = new Set<PropertyKey>(excludedFields);

  return Object.fromEntries(
    Object.entries(value).filter(([key]) => !excluded.has(key)),
  ) as Omit<T, K>;
}

export const getSiteContent = cache(
  contentRepository.getSiteContent.bind(contentRepository),
);
export const getHomePageContent = cache(async (language: ContentLanguage) => {
  const content = await getSiteContent(language);

  return omitFields(
    content,
    homePageExcludedFields,
  ) satisfies HomePageContent;
});
export const getSiteShellContent = cache(async (language: ContentLanguage) => {
  const content = await getSiteContent(language);

  return {
    footerCopyright: content.footerCopyright,
    footerSlogan: content.footerSlogan,
  } satisfies SiteShellContent;
});
export const getPageContent = cache(
  contentRepository.getPageContent.bind(contentRepository),
);
export const getProductionContent = cache(
  contentRepository.getProductionContent.bind(contentRepository),
);
