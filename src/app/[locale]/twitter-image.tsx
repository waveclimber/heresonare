import { isLocale } from "@/i18n/config";
import {
  createSocialCard,
  createSocialCardMetadata,
} from "@/lib/socialCard";

export function generateImageMetadata({
  params,
}: {
  params: { locale: string };
}) {
  return isLocale(params.locale)
    ? [createSocialCardMetadata(params.locale)]
    : [];
}

export default async function TwitterImage({
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

