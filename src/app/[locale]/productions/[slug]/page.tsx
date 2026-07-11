import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductionDetail from "@/components/ProductionDetail";
import { interfaceContent } from "@/data/interfaceContent";
import {
  getLocalizedProduction,
  isProductionSlug,
  productionSlugs,
} from "@/data/productionContent";
import {
  contentLanguageByLocale,
  isLocale,
} from "@/i18n/config";
import { createProductionMetadata } from "@/lib/pageMetadata";

export const dynamicParams = true;

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

  if (!isLocale(locale)) notFound();

  const language = contentLanguageByLocale[locale];
  if (!isProductionSlug(slug)) {
    return {
      title: interfaceContent[language].productionDetail.notFoundTitle,
      description:
        interfaceContent[language].productionDetail.notFoundDescription,
    };
  }

  const production = getLocalizedProduction(locale, slug);
  if (!production) {
    return {
      title: interfaceContent[language].productionDetail.notFoundTitle,
      description:
        interfaceContent[language].productionDetail.notFoundDescription,
    };
  }

  return createProductionMetadata(production, locale);
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
      backLabel={interfaceContent[language].productionDetail.backToProductions}
    />
  );
}
