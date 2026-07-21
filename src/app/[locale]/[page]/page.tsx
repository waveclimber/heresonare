import type { Metadata } from "next";
import { notFound } from "next/navigation";

import StaticPage from "@/components/StaticPage";
import StructuredData from "@/components/StructuredData";
import {
  isNavigationKey,
  navigationRoutes,
} from "@/data/navigation";
import { isLocale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/pageMetadata";
import { createPageStructuredData } from "@/lib/structuredData";

export const dynamicParams = true;

export function generateStaticParams() {
  return navigationRoutes.map(({ key }) => ({ page: key }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; page: string }>;
}): Promise<Metadata> {
  const { locale, page } = await params;

  if (!isLocale(locale) || !isNavigationKey(page)) {
    notFound();
  }

  return createPageMetadata(page, locale);
}

export default async function PublicPage({
  params,
}: {
  params: Promise<{ locale: string; page: string }>;
}) {
  const { locale, page } = await params;

  if (!isLocale(locale) || !isNavigationKey(page)) {
    notFound();
  }

  return (
    <>
      <StructuredData data={createPageStructuredData(page, locale)} />
      <StaticPage pageKey={page} />
    </>
  );
}
