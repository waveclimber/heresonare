import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PlatformFrame from "@/components/platform/PlatformFrame";
import Basket from "@/components/platform/Basket";
import { platformContent } from "@/data/platformContent";
import { isLocale } from "@/i18n/config";
import { getPublishedEntries } from "@/platform/server";
import { storageConfigured } from "@/platform/store";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: true } };
export default async function BagPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = platformContent[locale];
  return (
    <PlatformFrame title={c.bag} kicker={c.catalog}>
      <Basket
        locale={locale}
        entries={(await getPublishedEntries()).filter(
          (entry) => entry.module === "store",
        ).map((entry) => ({ id: entry.id, slug: entry.slug, module: entry.module, title: entry.translations[locale].title, price: entry.price, currency: entry.currency, available: entry.available }))}
        enabled={storageConfigured()}
      />
    </PlatformFrame>
  );
}
