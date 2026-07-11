import type { Metadata } from "next";
import { notFound } from "next/navigation";

import HomeContent from "@/components/HomeContent";
import { isLocale } from "@/i18n/config";
import { createHomeMetadata } from "@/lib/pageMetadata";

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

export default function HomePage() {
  return <HomeContent />;
}
