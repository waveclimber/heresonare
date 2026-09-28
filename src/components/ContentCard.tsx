import { useId } from "react";
import ContentCardDetails from "@/components/content-card/ContentCardDetails";
import ContentCardLinks from "@/components/content-card/ContentCardLinks";
import ContentCardMedia from "@/components/content-card/ContentCardMedia";
import { ResonanceSurface } from "@/components/motion/ResonanceSurface";
import {
  createContentCardHeadingId,
  normalizeSpecs,
  normalizeTextList,
  type ContentCardLabels,
} from "@/components/content-card/contentCardUtils";
import type { PageContentItem } from "@/data/pageContent";
import { isApprovedIconContentMedia } from "@/data/contentMedia";
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
  const icon = isApprovedIconContentMedia(item.media?.icon)
    ? item.media.icon
    : undefined;

  return (
    <ResonanceSurface
      as="article"
      ariaLabelledby={headingId}
      className="content-card"
      interactive={Boolean(item.href || item.links?.length)}
    >
      <div className="flex h-full flex-col">
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
      </div>
    </ResonanceSurface>
  );
}
