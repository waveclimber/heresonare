import "server-only";

import { pageContent, type PageContentItem } from "@/data/pageContent";
import {
  isProductionSlug,
  productionSlugs,
} from "@/data/productionRoutes";
import { siteContent } from "@/data/siteContent";
import type { PublicContentRepository } from "@/content/contracts";
import type { ContentLanguage } from "@/i18n/config";

function getProductions(language: ContentLanguage): PageContentItem[] {
  return pageContent[language].productions.sections.flatMap(
    (section) => section.items ?? [],
  );
}

function assertProductionContentContract() {
  for (const language of ["EN", "JP", "CN"] as const) {
    const supportedItems = getProductions(language).filter((item) =>
      isProductionSlug(item.slug),
    );

    if (
      supportedItems.length !== productionSlugs.length ||
      productionSlugs.some(
        (slug) =>
          supportedItems.filter((item) => item.slug === slug).length !== 1,
      )
    ) {
      throw new Error(
        `Production detail content must contain each approved slug exactly once for ${language}.`,
      );
    }
  }
}

assertProductionContentContract();

export const staticContentRepository = {
  async getSiteContent(language) {
    return siteContent[language];
  },

  async getPageContent(language, pageKey) {
    return pageContent[language][pageKey] ?? null;
  },

  async getProductionContent(language, slug) {
    return (
      getProductions(language).find((item) => item.slug === slug) ?? null
    );
  },
} satisfies PublicContentRepository;
