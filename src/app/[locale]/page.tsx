import type { Metadata } from "next";
import { notFound } from "next/navigation";

import HomeContent from "@/components/HomeContent";
import StructuredData from "@/components/StructuredData";
import {
  getHomePageContent,
  getSiteContent,
} from "@/content/repository";
import { contentLanguageByLocale, isLocale } from "@/i18n/config";
import { createHomeMetadata } from "@/lib/pageMetadata";
import { createHomeStructuredData } from "@/lib/structuredData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const content = await getSiteContent(contentLanguageByLocale[locale]);

  return createHomeMetadata(locale, content);
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const content = await getHomePageContent(contentLanguageByLocale[locale]);

  return (
    <>
      <StructuredData data={createHomeStructuredData(locale, content)} />
      <HomeContent content={content} />
    </>
  );
}
