import type { Metadata } from "next";
import { notFound } from "next/navigation";

import StaticPage from "@/components/StaticPage";
import StructuredData from "@/components/StructuredData";
import { getPageContent, getSiteContent } from "@/content/repository";
import {
  isNavigationKey,
  navigationRoutes,
} from "@/data/navigation";
import { contentLanguageByLocale, isLocale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/pageMetadata";
import { createPageStructuredData } from "@/lib/structuredData";

export const dynamicParams = true;

export function generateStaticParams() {
  return navigationRoutes.map(({ key }) => ({ page: key }));
}

async function getPage(localeValue: string, pageValue: string) {
  if (!isLocale(localeValue) || !isNavigationKey(pageValue)) {
    notFound();
  }

  const language = contentLanguageByLocale[localeValue];
  const content = await getPageContent(language, pageValue);

  if (!content) {
    notFound();
  }

  return { content, language, locale: localeValue };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; page: string }>;
}): Promise<Metadata> {
  const { locale, page } = await params;

  const result = await getPage(locale, page);
  const siteContent = await getSiteContent(result.language);

  return createPageMetadata(result.content, result.locale, siteContent);
}

export default async function PublicPage({
  params,
}: {
  params: Promise<{ locale: string; page: string }>;
}) {
  const { locale, page } = await params;

  const result = await getPage(locale, page);

  return (
    <>
      <StructuredData
        data={createPageStructuredData(result.content, result.locale)}
      />
      <StaticPage content={result.content} />
    </>
  );
}
