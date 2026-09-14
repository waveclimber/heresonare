import Image from "next/image";
import CopyEmailButton from "@/components/CopyEmailButton";
import { MediaSignalFrame } from "@/components/motion/MediaSignalFrame";
import { ResonanceLink } from "@/components/motion/ResonanceLink";
import { ResonanceSurface } from "@/components/motion/ResonanceSurface";

import {
  normalizeSpecs,
  normalizeTextList,
  type ContentCardLabels,
} from "@/components/content-card/contentCardUtils";
import {
  isApprovedIconContentMedia,
  isApprovedRasterContentMedia,
} from "@/data/contentMedia";
import type { ProductionDetailLabels } from "@/data/interfaceContent";
import type { PageContentItem } from "@/data/pageContent";
import {
  contentLanguageByLocale,
  getLocalizedPath,
  type Locale,
} from "@/i18n/config";
import { getMediaSignalVariant } from "@/lib/mediaSignal";

type ProductionDetailProps = {
  production: PageContentItem;
  locale: Locale;
  labels: ContentCardLabels;
  detailLabels: ProductionDetailLabels;
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
      <h2
        id={id}
        tabIndex={-1}
        className="text-xl font-semibold text-white focus:outline-none"
      >
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

function ProductionHeroMedia({
  production,
  heroMedia,
}: {
  production: PageContentItem;
  heroMedia?: string;
}) {
  return (
    <div className="group relative aspect-[16/11] min-w-0 overflow-hidden rounded-[32px] border border-white/10">
      <MediaSignalFrame
        src={heroMedia}
        alt={production.title}
        priority
        sizes="(max-width: 1023px) calc(100vw - 3rem), 50vw"
        variant={getMediaSignalVariant(production.slug)}
      />
    </div>
  );
}

export default function ProductionDetail({
  production,
  locale,
  labels,
  detailLabels,
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
  const detailSections = [
    { id: "production-features", label: labels.features, available: features.length > 0 },
    { id: "production-use-cases", label: labels.useCases, available: useCases.length > 0 },
    { id: "production-specifications", label: labels.specifications, available: specs.length > 0 },
  ].filter((section) => section.available);
  const inquirySubject = `${detailLabels.inquirySubject}: ${production.title}`;
  const inquiryHref = `mailto:contact@heresonare.com?subject=${encodeURIComponent(inquirySubject)}`;
  const icon = isApprovedIconContentMedia(production.media?.icon)
    ? production.media.icon
    : undefined;
  const heroMedia = [
    production.media?.hero,
    production.media?.render,
    production.media?.card,
    production.image,
  ].find(isApprovedRasterContentMedia);
  const renderMedia =
    isApprovedRasterContentMedia(production.media?.render) &&
    production.media.render !== heroMedia
      ? production.media.render
    : undefined;

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen overflow-hidden bg-black px-6 pb-32 pt-28 text-white focus:outline-none"
    >
      <article className="mx-auto max-w-7xl">
        <nav aria-label={detailLabels.backToList}>
          <ResonanceLink
            href={getLocalizedPath("/productions", locale)}
            glow="teal"
            className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-5 py-2 text-sm text-gray-300 transition-[transform,border-color,color,box-shadow] hover:-translate-y-1 hover:border-[var(--brand-teal)] hover:text-white hover:shadow-[0_0_26px_rgba(76,186,175,0.18)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-yellow)]"
          >
            <span aria-hidden="true">←</span>
            <span className="ml-2">{detailLabels.backToList}</span>
          </ResonanceLink>
        </nav>

        <header className="relative mt-10 grid min-w-0 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          <div className="min-w-0">
            <p className="mb-5 text-xs uppercase tracking-[0.3em] text-[var(--brand-teal)]">
              {detailLabels.detailLabel}
            </p>
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
            {detailSections.length > 0 && (
              <nav aria-label={detailLabels.onThisPage} className="mt-8 border-t border-white/10 pt-5">
                <p className="mb-3 text-sm text-gray-400">{detailLabels.onThisPage}</p>
                <ul className="flex flex-wrap gap-2">
                  {detailSections.map((section) => (
                    <li key={section.id}>
                      <a href={`#${section.id}`} className="inline-flex min-h-11 items-center rounded-full border border-white/15 px-4 py-2 text-sm text-gray-200 transition-colors hover:border-[var(--brand-teal)] hover:text-[var(--brand-teal)]">
                        {section.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>

          <ProductionHeroMedia
            production={production}
            heroMedia={heroMedia}
          />
        </header>

        {(features.length > 0 || useCases.length > 0) && (
          <div className={`mt-20 grid min-w-0 gap-8 ${features.length > 0 && useCases.length > 0 ? "md:grid-cols-2" : ""}`}>
            {features.length > 0 && (
              <ResonanceSurface
                className="min-w-0 rounded-[32px] border border-white/10 bg-white/[0.04] p-7 sm:p-9"
                glow="blue"
              >
                <DetailList
                  id="production-features"
                  label={labels.features}
                  values={features}
                  markerClassName="marker:text-[var(--brand-blue)]"
                />
              </ResonanceSurface>
            )}
            {useCases.length > 0 && (
              <ResonanceSurface
                className="min-w-0 rounded-[32px] border border-white/10 bg-white/[0.04] p-7 sm:p-9"
                glow="teal"
              >
                <DetailList
                  id="production-use-cases"
                  label={labels.useCases}
                  values={useCases}
                  markerClassName="marker:text-[var(--brand-teal)]"
                />
              </ResonanceSurface>
            )}
          </div>
        )}

        {specs.length > 0 && (
          <ResonanceSurface
            as="article"
            className="mt-8 min-w-0 rounded-[32px] border border-white/10 bg-white/[0.04] p-7 sm:p-9"
            ariaLabelledby="production-specifications"
            glow="yellow"
          >
            <h2
              id="production-specifications"
              tabIndex={-1}
              className="text-xl font-semibold text-white focus:outline-none"
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
          </ResonanceSurface>
        )}

        {renderMedia && (
          <div className="group relative mt-8 aspect-[16/9] overflow-hidden rounded-[32px] border border-white/10">
            <MediaSignalFrame
              src={renderMedia}
              alt={production.title}
              sizes="(max-width: 1279px) calc(100vw - 3rem), 1280px"
              variant={getMediaSignalVariant(production.slug)}
            />
          </div>
        )}
        <section
          aria-labelledby="production-inquiry-title"
          className="mt-12 grid min-w-0 gap-8 rounded-[32px] border border-[var(--brand-teal)]/25 bg-[var(--brand-teal)]/[0.06] p-7 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center"
        >
          <div className="min-w-0">
            <h2 id="production-inquiry-title" className="text-2xl font-semibold text-white">
              {detailLabels.inquiryTitle}
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-gray-300">
              {detailLabels.inquiryDescription}
            </p>
          </div>
          <div className="flex min-w-0 flex-wrap items-start gap-3 lg:max-w-sm">
            <ResonanceLink
              href={inquiryHref}
              className="inline-flex min-h-11 items-center rounded-full bg-[var(--brand-blue)] px-6 py-3 text-sm font-medium text-white"
            >
              {detailLabels.inquiryAction}
            </ResonanceLink>
            <CopyEmailButton
              email="contact@heresonare.com"
              language={contentLanguageByLocale[locale]}
            />
          </div>
        </section>
      </article>
    </main>
  );
}
