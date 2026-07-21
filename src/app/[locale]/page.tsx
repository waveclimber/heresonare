import type { Metadata } from "next";
import { notFound } from "next/navigation";

import HomeContent from "@/components/HomeContent";
import StructuredData from "@/components/StructuredData";
import { isLocale } from "@/i18n/config";
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

  return createHomeMetadata(locale);
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

  return (
    <>
      <StructuredData data={createHomeStructuredData(locale)} />
      <HomeContent />
    </>
  );
}
