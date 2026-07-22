import "server-only";

import { cache } from "react";

import { staticContentRepository } from "@/content/staticContentRepository";
import {
  assertProductionContent,
  assertSiteContent,
  assertStaticPageContent,
} from "@/content/validation.mjs";
import type {
  HomePageContent,
  PublicContentRepository,
  SiteShellContent,
} from "@/content/contracts";
import type { PageKey } from "@/data/pageContent";
import type { ProductionSlug } from "@/data/productionRoutes";
import type { ContentLanguage } from "@/i18n/config";

const contentRepository: PublicContentRepository = staticContentRepository;
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

export const getSiteContent = cache(async (language: ContentLanguage) => {
  const content = await contentRepository.getSiteContent(language);
  assertSiteContent(content, { language });
  return content;
});
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
  async (
    language: ContentLanguage,
    pageKey: PageKey,
  ) => {
    const content = await contentRepository.getPageContent(language, pageKey);
    if (content !== null) {
      assertStaticPageContent(content, { language, pageKey });
    }
    return content;
  },
);
export const getProductionContent = cache(
  async (
    language: ContentLanguage,
    slug: ProductionSlug,
  ) => {
    const content = await contentRepository.getProductionContent(language, slug);
    if (content !== null) {
      assertProductionContent(content, { language, slug });
    }
    return content;
  },
);
