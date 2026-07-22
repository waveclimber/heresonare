import { isLocale } from "@/i18n/config";
import {
  createSocialCard,
  createSocialCardMetadata,
} from "@/lib/socialCard";

export async function generateImageMetadata({
  params,
}: {
  params: { locale: string };
}) {
  return isLocale(params.locale)
    ? [await createSocialCardMetadata(params.locale)]
    : [];
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
  id: Promise<string | number>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    throw new Error(`Unsupported social-card locale: ${locale}`);
  }

  return createSocialCard(locale);
}

