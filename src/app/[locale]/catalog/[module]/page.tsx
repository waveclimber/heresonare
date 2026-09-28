import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PlatformFrame from "@/components/platform/PlatformFrame";
import { platformContent } from "@/data/platformContent";
import { getNavigationItems, isNavigationKey } from "@/data/navigation";
import { contentLanguageByLocale, isLocale } from "@/i18n/config";
import { getPublishedEntries, requestTime } from "@/platform/server";
import { money, recordPath } from "@/platform/domain";
import { getAbsoluteSiteUrl } from "@/lib/siteUrl";
export const dynamic = "force-dynamic";
type Params = Promise<{ locale: string; module: string }>;
async function context(params: Params) {
  const { locale, module } = await params;
  if (!isLocale(locale) || !isNavigationKey(module)) notFound();
  return {
    locale,
    module,
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
  const { locale, module, label, c } = await context(params);
  return {
    title: `${label} · ${c.latest}`,
    alternates: {
      canonical: getAbsoluteSiteUrl(`/${locale}/catalog/${module}`),
    },
  };
}
export default async function CataloguePage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale, module, c, label } = await context(params);
  const query = await searchParams;
  const q = typeof query.q === "string" ? query.q.slice(0, 120) : "";
  const category = typeof query.category === "string" ? query.category : "";
  const timing = typeof query.timing === "string" ? query.timing : "";
  const entries = (await getPublishedEntries()).filter(
    (entry) => entry.module === module,
  );
  const now = requestTime();
  const matches = entries.filter(
    (entry) =>
      `${entry.translations[locale].title} ${entry.translations[locale].summary} ${entry.location}`
        .toLowerCase()
        .includes(q.toLowerCase()) &&
      (!category || entry.category === category) &&
      (module !== "tour" ||
        !timing ||
        (timing === "past"
          ? Date.parse(entry.endsAt) < now
          : Date.parse(entry.endsAt) >= now)),
  );
  if (module === "tour")
    matches.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  return (
    <PlatformFrame title={label} kicker={c.latest}>
      <div className="p-row">
        <a className="p-button" href={`/${locale}/${module}`}>
          {c.home}
        </a>
        {module === "store" && (
          <a className="p-button" href={`/${locale}/bag`}>
            {c.bag}
          </a>
        )}
        <a className="p-button" href={`/${locale}/connect`}>
          {c.connect}
        </a>
      </div>
      <form className="p-filters" method="get">
        <label className="p-field">
          {c.search}
          <input type="search" name="q" defaultValue={q} maxLength={120} />
        </label>
        <label className="p-field">
          {c.category}
          <select name="category" defaultValue={category}>
            <option value="">{c.all}</option>
            {[
              ...new Set(
                entries.map((entry) => entry.category).filter(Boolean),
              ),
            ].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        {module === "tour" && (
          <label className="p-field">
            {c.timing}
            <select name="timing" defaultValue={timing}>
              <option value="">{c.all}</option>
              <option value="upcoming">{c.upcoming}</option>
              <option value="past">{c.past}</option>
            </select>
          </label>
        )}
        <button className="p-button p-primary">{c.filter}</button>
        <a className="p-button" href={`/${locale}/catalog/${module}`}>
          {c.clear}
        </a>
      </form>
      <p className="p-muted">
        {c.results}: {matches.length}
      </p>
      {!matches.length && (
        <p className="p-notice">{entries.length ? c.noMatches : c.empty}</p>
      )}
      <div className="p-grid">
        {matches.map((entry) => (
          <article className="p-card" key={entry.id}>
            <p className="p-kicker">{entry.category || label}</p>
            <h2>
              <a href={recordPath(entry, locale)}>
                {entry.translations[locale].title}
              </a>
            </h2>
            <p>{entry.translations[locale].summary}</p>
            {entry.startsAt && (
              <p>
                <time dateTime={entry.startsAt}>
                  {new Intl.DateTimeFormat(locale, {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "UTC",
                  }).format(new Date(entry.startsAt))}{" "}
                  UTC
                </time>{" "}
                · {entry.location}
              </p>
            )}
            {entry.module === "store" && (
              <p>
                {entry.price > 0
                  ? money(entry.price, entry.currency, locale)
                  : c.unavailable}
              </p>
            )}
            <a className="p-button" href={recordPath(entry, locale)}>
              {c.details}
            </a>
          </article>
        ))}
      </div>
    </PlatformFrame>
  );
}
