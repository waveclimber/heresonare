import { useId } from "react";
import ContentCardDetails from "@/components/content-card/ContentCardDetails";
import ContentCardLinks from "@/components/content-card/ContentCardLinks";
import ContentCardMedia, {
  getApprovedContentIcon,
} from "@/components/content-card/ContentCardMedia";
import {
  createContentCardHeadingId,
  normalizeSpecs,
  normalizeTextList,
  type ContentCardLabels,
} from "@/components/content-card/contentCardUtils";
import type { PageContentItem } from "@/data/pageContent";
import type { Locale } from "@/i18n/config";

type ContentCardProps = {
  item: PageContentItem;
  labels: ContentCardLabels;
  locale: Locale;
};

export default function ContentCard({
  item,
  labels,
  locale,
}: ContentCardProps) {
  const instanceId = useId();
  const headingId = createContentCardHeadingId(item.id, instanceId);
  const primaryLabels = normalizeTextList([
    item.subtitle,
    item.role,
    item.type,
    item.category,
  ]);
  const excludedMetadata = new Set(
    normalizeTextList([...primaryLabels, item.status]).map((value) =>
      value.toLowerCase()
    )
  );
  const metadata = normalizeTextList([
    item.meta,
    item.year,
    item.date,
    item.location,
  ]).filter((value) => !excludedMetadata.has(value.toLowerCase()));
  const features = normalizeTextList(item.features);
  const useCases = normalizeTextList(item.useCases);
  const specs = normalizeSpecs(item.specs);
  const icon = getApprovedContentIcon(item.media?.icon);

  return (
    <article
      aria-labelledby={headingId}
      className="group relative flex min-w-0 flex-col overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-[var(--brand-blue)]/60 hover:bg-white/[0.07] hover:shadow-[0_0_45px_rgba(14,108,178,0.14)]"
    >
      <ContentCardMedia item={item} />

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <ContentCardDetails
          item={item}
          labels={labels}
          headingId={headingId}
          primaryLabels={primaryLabels}
          metadata={metadata}
          features={features}
          useCases={useCases}
          specs={specs}
          icon={icon}
        />
        <ContentCardLinks item={item} labels={labels} locale={locale} />
      </div>
    </article>
  );
}
