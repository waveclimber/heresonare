import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PlatformFrame from "@/components/platform/PlatformFrame";
import SubmissionForm from "@/components/platform/SubmissionForm";
import { platformContent } from "@/data/platformContent";
import { isLocale } from "@/i18n/config";
import { storageConfigured } from "@/platform/store";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: true } };
export default async function ConnectPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = platformContent[locale];
  return (
    <PlatformFrame title={c.connect} kicker={c.topic}>
      <a href={`/${locale}/contact`}>{c.home}</a>
      <SubmissionForm locale={locale} enabled={storageConfigured()} />
    </PlatformFrame>
  );
}
