import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductionDetail from "@/components/ProductionDetail";
import StructuredData from "@/components/StructuredData";
import {
  getPageContent,
  getProductionContent,
  getSiteContent,
} from "@/content/repository";
import { interfaceContent } from "@/data/interfaceContent";
import {
  isProductionSlug,
  productionSlugs,
} from "@/data/productionRoutes";
import {
  contentLanguageByLocale,
  isLocale,
} from "@/i18n/config";
import { createProductionMetadata } from "@/lib/pageMetadata";
import { createProductionStructuredData } from "@/lib/structuredData";

export const dynamicParams = true;

export function generateStaticParams() {
  return productionSlugs.map((slug) => ({ slug }));
}

type ProductionPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

async function getProduction(localeValue: string, slugValue: string) {
  if (!isLocale(localeValue) || !isProductionSlug(slugValue)) {
    notFound();
  }

  const language = contentLanguageByLocale[localeValue];
  const production = await getProductionContent(language, slugValue);
  if (!production) notFound();

  return { language, locale: localeValue, production };
}

export async function generateMetadata({
  params,
}: ProductionPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const result = await getProduction(locale, slug);
  const siteContent = await getSiteContent(result.language);

  return createProductionMetadata(
    result.production,
    result.locale,
    siteContent,
  );
}

export default async function ProductionPage({ params }: ProductionPageProps) {
  const { locale, slug } = await params;
  const result = await getProduction(locale, slug);
  const productionsPage = await getPageContent(
    result.language,
    "productions",
  );

  if (!productionsPage) notFound();

  return (
    <>
      <StructuredData
        data={createProductionStructuredData(
          result.production,
          result.locale,
          productionsPage.hero.title,
        )}
      />
      <ProductionDetail
        production={result.production}
        locale={result.locale}
        labels={interfaceContent[result.language].staticPage}
        detailLabels={interfaceContent[result.language].productionDetail}
      />
    </>
  );
}
