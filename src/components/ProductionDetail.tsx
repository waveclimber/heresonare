import Image from "next/image";
import Link from "next/link";

import {
  getApprovedContentIcon,
  isApprovedRasterMedia,
} from "@/components/content-card/ContentCardMedia";
import {
  normalizeSpecs,
  normalizeTextList,
  type ContentCardLabels,
} from "@/components/content-card/contentCardUtils";
import { contentCardFallbackMedia } from "@/data/contentMedia";
import type { PageContentItem } from "@/data/pageContent";
import { getLocalizedPath, type Locale } from "@/i18n/config";

type ProductionDetailProps = {
  production: PageContentItem;
  locale: Locale;
  labels: ContentCardLabels;
  backLabel: string;
};

type DetailListProps = {
  id: string;
  label: string;
  values: string[];
  markerClassName: string;
};

function DetailList({
  id,
  label,
  values,
  markerClassName,
}: DetailListProps) {
  if (values.length === 0) return null;

  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="text-xl font-semibold text-white">
        {label}
      </h2>
      <ul
        className={`mt-5 list-disc space-y-3 pl-5 leading-7 text-gray-300 ${markerClassName}`}
      >
        {values.map((value) => (
          <li key={value}>{value}</li>
        ))}
      </ul>
    </section>
  );
}

function ProductionHeroMedia({ production }: { production: PageContentItem }) {
  const heroMedia = [
    production.media?.hero,
    production.media?.card,
    production.image,
    production.media?.render,
  ].find(isApprovedRasterMedia);

  return (
    <div className="relative aspect-[16/11] min-w-0 overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(76,186,175,0.24),transparent_34%),radial-gradient(circle_at_80%_75%,rgba(14,108,178,0.38),transparent_40%),#111]">
      {heroMedia ? (
        <Image
          src={heroMedia}
          alt={production.title}
          fill
          priority
          sizes="(max-width: 1023px) calc(100vw - 3rem), 50vw"
          className="object-cover"
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center p-10"
          aria-hidden="true"
        >
          <Image
            src={contentCardFallbackMedia}
            alt=""
            width={360}
            height={90}
            priority
            className="h-auto w-full max-w-64 opacity-70"
          />
        </div>
      )}
    </div>
  );
}

export default function ProductionDetail({
  production,
  locale,
  labels,
  backLabel,
}: ProductionDetailProps) {
  const primaryLabels = normalizeTextList([
    production.subtitle,
    production.type,
    production.category,
  ]);
  const metadata = normalizeTextList([
    production.meta,
    production.year,
    production.date,
    production.location,
  ]);
  const features = normalizeTextList(production.features);
  const useCases = normalizeTextList(production.useCases);
  const specs = normalizeSpecs(production.specs);
  const icon = getApprovedContentIcon(production.media?.icon);
  const renderMedia = isApprovedRasterMedia(production.media?.render)
    ? production.media.render
    : undefined;

  return (
    <main className="min-h-screen overflow-hidden bg-black px-6 pb-32 pt-28 text-white">
      <article className="mx-auto max-w-7xl">
        <Link
          href={getLocalizedPath("/productions", locale)}
          className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-5 py-2 text-sm text-gray-300 transition-colors hover:border-[var(--brand-blue)] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-yellow)]"
        >
          <span aria-hidden="true">←</span>
          <span className="ml-2">{backLabel}</span>
        </Link>

        <header className="relative mt-10 grid min-w-0 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          <div className="min-w-0">
            {primaryLabels.length > 0 && (
              <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs tracking-[0.2em] text-[var(--brand-blue)] uppercase">
                {primaryLabels.map((label) => (
                  <li key={label}>{label}</li>
                ))}
              </ul>
            )}

            <div className="mt-6 flex min-w-0 items-start gap-5">
              <h1 className="min-w-0 break-words text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
                {production.title}
              </h1>
              {icon && (
                <Image
                  src={icon}
                  alt=""
                  width={48}
                  height={48}
                  aria-hidden="true"
                  className="mt-2 h-12 w-12 shrink-0 object-contain"
                />
              )}
            </div>

            {production.status && (
              <p className="mt-7 w-fit rounded-full border border-[var(--brand-teal)]/40 bg-[var(--brand-teal)]/10 px-4 py-2 text-sm text-gray-200">
                <span className="font-semibold text-[var(--brand-teal)]">
                  {labels.status}:
                </span>{" "}
                {production.status}
              </p>
            )}

            <p className="mt-8 max-w-2xl break-words text-lg leading-8 text-gray-300">
              {production.description}
            </p>

            {metadata.length > 0 && (
              <ul className="mt-7 flex flex-wrap gap-2">
                {metadata.map((value) => (
                  <li
                    key={value}
                    className="rounded-full bg-white/[0.06] px-3 py-1.5 text-sm text-gray-300"
                  >
                    {value}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <ProductionHeroMedia production={production} />
        </header>

        <div className="mt-20 grid min-w-0 gap-8 md:grid-cols-2">
          <div className="min-w-0 rounded-[32px] border border-white/10 bg-white/[0.04] p-7 sm:p-9">
            <DetailList
              id="production-features"
              label={labels.features}
              values={features}
              markerClassName="marker:text-[var(--brand-blue)]"
            />
          </div>
          <div className="min-w-0 rounded-[32px] border border-white/10 bg-white/[0.04] p-7 sm:p-9">
            <DetailList
              id="production-use-cases"
              label={labels.useCases}
              values={useCases}
              markerClassName="marker:text-[var(--brand-teal)]"
            />
          </div>
        </div>

        {specs.length > 0 && (
          <section
            className="mt-8 min-w-0 rounded-[32px] border border-white/10 bg-white/[0.04] p-7 sm:p-9"
            aria-labelledby="production-specifications"
          >
            <h2
              id="production-specifications"
              className="text-xl font-semibold text-white"
            >
              {labels.specifications}
            </h2>
            <dl className="mt-5 divide-y divide-white/10">
              {specs.map((spec) => (
                <div
                  key={`${spec.label}-${spec.value}`}
                  className="grid min-w-0 gap-2 py-4 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:gap-6"
                >
                  <dt className="text-gray-500">{spec.label}</dt>
                  <dd className="min-w-0 break-words text-gray-300 sm:text-right">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {renderMedia && (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[32px] border border-white/10">
            <Image
              src={renderMedia}
              alt={production.title}
              fill
              sizes="(max-width: 1279px) calc(100vw - 3rem), 1280px"
              className="object-cover"
            />
          </div>
        )}
      </article>
    </main>
  );
}
