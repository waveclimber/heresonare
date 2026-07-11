import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductionDetail from "@/components/ProductionDetail";
import { interfaceContent } from "@/data/interfaceContent";
import {
  getLocalizedProduction,
} from "@/data/productionContent";
import {
  isProductionSlug,
  productionSlugs,
} from "@/data/productionRoutes";
import {
  contentLanguageByLocale,
  isLocale,
} from "@/i18n/config";
import { createProductionMetadata } from "@/lib/pageMetadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return productionSlugs.map((slug) => ({ slug }));
}

type ProductionPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

function getProduction(localeValue: string, slugValue: string) {
  if (!isLocale(localeValue) || !isProductionSlug(slugValue)) {
    notFound();
  }

  const production = getLocalizedProduction(localeValue, slugValue);
  if (!production) notFound();

  return { locale: localeValue, production };
}

export async function generateMetadata({
  params,
}: ProductionPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const result = getProduction(locale, slug);

  return createProductionMetadata(result.production, result.locale);
}

export default async function ProductionPage({ params }: ProductionPageProps) {
  const { locale, slug } = await params;
  const result = getProduction(locale, slug);
  const language = contentLanguageByLocale[result.locale];

  return (
    <ProductionDetail
      production={result.production}
      locale={result.locale}
      labels={interfaceContent[language].staticPage}
      detailLabels={interfaceContent[language].productionDetail}
    />
  );
}
