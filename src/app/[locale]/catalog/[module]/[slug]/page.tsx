import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PlatformFrame from "@/components/platform/PlatformFrame";
import CoverImage from "@/components/platform/CoverImage";
import RichText from "@/components/platform/RichText";
import { BasketButton } from "@/components/platform/Basket";
import StructuredData from "@/components/StructuredData";
import { platformContent } from "@/data/platformContent";
import { getNavigationItems, isNavigationKey } from "@/data/navigation";
import {
  contentLanguageByLocale,
  isLocale,
  supportedLocales,
} from "@/i18n/config";
import { getPublishedEntries } from "@/platform/server";
import { money, recordPath } from "@/platform/domain";
import { getAbsoluteSiteUrl } from "@/lib/siteUrl";
export const dynamic = "force-dynamic";
type Params = Promise<{ locale: string; module: string; slug: string }>;
async function context(params: Params) {
  const { locale, module, slug } = await params;
  if (!isLocale(locale) || !isNavigationKey(module)) notFound();
  const entries = await getPublishedEntries();
  const entry = entries.find(
    (item) => item.module === module && item.slug === slug,
  );
  if (!entry) notFound();
  return {
    locale,
    module,
    entry,
    entries,
    c: platformContent[locale],
    label: getNavigationItems(contentLanguageByLocale[locale], locale).find(
      (item) => item.key === module,
    )!.label,
  };
}
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, entry } = await context(params);
  const content = entry.translations[locale];
  return {
    title: content.title,
    description: content.summary,
    alternates: {
      canonical: getAbsoluteSiteUrl(recordPath(entry, locale)),
      languages: Object.fromEntries(
        supportedLocales.map((language) => [
          language,
          getAbsoluteSiteUrl(recordPath(entry, language)),
        ]),
      ),
    },
    openGraph: {
      title: content.title,
      description: content.summary,
      url: getAbsoluteSiteUrl(recordPath(entry, locale)),
    },
  };
}
export default async function EntryPage({ params }: { params: Params }) {
  const { locale, module, entry, entries, c, label } = await context(params);
  const content = entry.translations[locale];
  const related = entries.filter((item) => entry.related.includes(item.id));
  const structured = {
    "@context": "https://schema.org",
    "@type":
      module === "tour"
        ? "Event"
        : module === "venues"
          ? "Place"
          : "CreativeWork",
    name: content.title,
    description: content.summary,
    url: getAbsoluteSiteUrl(recordPath(entry, locale)),
    ...(module === "tour"
      ? {
          startDate: entry.startsAt,
          endDate: entry.endsAt,
          location: { "@type": "Place", name: entry.location },
        }
      : {}),
  };
  return (
    <PlatformFrame title={content.title} kicker={label}>
      <StructuredData data={structured} />
      <div className="p-detail">
        <a href={`/${locale}/catalog/${module}`}>← {c.back}</a>
        <p>{content.summary}</p>
        <CoverImage cover={entry.cover} locale={locale} />
        {entry.location && (
          <p>
            {c.location}: {entry.location}
          </p>
        )}
        {entry.startsAt && (
          <div className="p-notice">
            <p>
              {c.dates}:{" "}
              {new Intl.DateTimeFormat(locale, {
                dateStyle: "full",
                timeStyle: "short",
                timeZone: "UTC",
              }).format(new Date(entry.startsAt))}{" "}
              —{" "}
              {new Intl.DateTimeFormat(locale, {
                dateStyle: "full",
                timeStyle: "short",
                timeZone: "UTC",
              }).format(new Date(entry.endsAt))}
            </p>
            <a
              className="p-button"
              href={`/api/platform/calendar/${entry.id}?locale=${locale}`}
            >
              {c.calendar}
            </a>
          </div>
        )}
        <div className="p-divider">
          <RichText text={content.body} />
        </div>
        <div className="p-row">
          {entry.externalUrl && (
            <a
              className="p-button"
              href={entry.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {c.external} ↗
            </a>
          )}
          <a className="p-button" href={`/${locale}/connect`}>
            {c.connect}
          </a>
        </div>
        {module === "store" && (
          <div className="p-divider">
            <h2>
              {entry.price > 0
                ? money(entry.price, entry.currency, locale)
                : c.unavailable}
            </h2>
            <p>{c.orderNote}</p>
            <BasketButton
              entry={{ id: entry.id, available: entry.available }}
              locale={locale}
            />
          </div>
        )}
        {related.length > 0 && (
          <section className="p-divider">
            <h2>{c.related}</h2>
            <ul>
              {related.map((item) => (
                <li key={item.id}>
                  <a href={recordPath(item, locale)}>
                    {item.translations[locale].title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </PlatformFrame>
  );
}
