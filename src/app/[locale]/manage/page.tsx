import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AdminWorkspace from "@/components/platform/AdminWorkspace";
import PlatformFrame from "@/components/platform/PlatformFrame";
import { getAdminState } from "@/platform/server";
import { isLocale } from "@/i18n/config";
import { platformContent } from "@/data/platformContent";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "héReSonare workspace",
  robots: { index: false, follow: false },
};
export default async function ManagePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const result = await getAdminState();
  const c = platformContent[locale];
  return (
    <PlatformFrame title={c.manage} kicker={c.adminOnly}>
      <AdminWorkspace locale={locale} {...result} />
    </PlatformFrame>
  );
}
