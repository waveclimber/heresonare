import type {
  PageContentItem,
  PageKey,
  StaticPageContent,
} from "@/data/pageContent";
import type { ProductionSlug } from "@/data/productionRoutes";
import type { SiteContentEntry } from "@/data/siteContent";
import type { ContentLanguage } from "@/i18n/config";

export type HomePageContent = Omit<
  SiteContentEntry,
  | "footerCopyright"
  | "footerSlogan"
  | "pages"
  | "product1Text"
  | "product1Title"
  | "product2Text"
  | "product2Title"
  | "product3Text"
  | "product3Title"
  | "productsTitle"
>;

export type SiteShellContent = Pick<
  SiteContentEntry,
  "footerCopyright" | "footerSlogan"
>;

export type SiteMetadataContent = Pick<
  SiteContentEntry,
  "heroDescription" | "heroSubtitle"
>;

export type PublicContentRepository = {
  getSiteContent(language: ContentLanguage): Promise<SiteContentEntry>;
  getPageContent(
    language: ContentLanguage,
    pageKey: PageKey,
  ): Promise<StaticPageContent | null>;
  getProductionContent(
    language: ContentLanguage,
    slug: ProductionSlug,
  ): Promise<PageContentItem | null>;
};
