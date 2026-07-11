import { ContentCardIcon } from "@/components/content-card/ContentCardMedia";
import type {
  ContentCardLabels,
  NormalizedSpec,
} from "@/components/content-card/contentCardUtils";
import type { PageContentItem } from "@/data/pageContent";

type ContentCardDetailsProps = {
  item: PageContentItem;
  labels: ContentCardLabels;
  headingId: string;
  primaryLabels: string[];
  metadata: string[];
  features: string[];
  useCases: string[];
  specs: NormalizedSpec[];
  icon?: string;
};

type DetailListProps = {
  headingId: string;
  label: string;
  values: string[];
  markerClassName: string;
};

function DetailList({
  headingId,
  label,
  values,
  markerClassName,
}: DetailListProps) {
  if (values.length === 0) return null;

  return (
    <section className="mt-8" aria-labelledby={headingId}>
      <h4 id={headingId} className="text-sm font-semibold text-white">
        {label}
      </h4>
      <ul
        className={`mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-gray-400 ${markerClassName}`}
      >
        {values.map((value) => (
          <li key={value}>{value}</li>
        ))}
      </ul>
    </section>
  );
}

export default function ContentCardDetails({
  item,
  labels,
  headingId,
  primaryLabels,
  metadata,
  features,
  useCases,
  specs,
  icon,
}: ContentCardDetailsProps) {
  return (
    <>
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          {primaryLabels.length > 0 && (
            <ul className="flex flex-wrap gap-x-3 gap-y-2">
              {primaryLabels.map((label, index) => (
                <li
                  key={label}
                  className={
                    index === 0
                      ? "text-xs uppercase tracking-[0.24em] text-[var(--brand-blue)]"
                      : "text-xs text-gray-500"
                  }
                >
                  {label}
                </li>
              ))}
            </ul>
          )}
          <h3
            id={headingId}
            className="mt-4 break-words text-2xl font-semibold text-white"
          >
            {item.title}
          </h3>
        </div>

        {icon && <ContentCardIcon path={icon} />}
      </div>

      {item.status && (
        <p className="mt-5 w-fit rounded-full border border-[var(--brand-teal)]/40 bg-[var(--brand-teal)]/10 px-3 py-1.5 text-xs text-gray-200">
          <span className="font-semibold text-[var(--brand-teal)]">
            {labels.status}:
          </span>{" "}
          {item.status}
        </p>
      )}

      <p className="mt-5 break-words leading-8 text-gray-400">
        {item.description}
      </p>

      {metadata.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2">
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

      <DetailList
        headingId={`${headingId}-features`}
        label={labels.features}
        values={features}
        markerClassName="marker:text-[var(--brand-blue)]"
      />
      <DetailList
        headingId={`${headingId}-use-cases`}
        label={labels.useCases}
        values={useCases}
        markerClassName="marker:text-[var(--brand-teal)]"
      />

      {specs.length > 0 && (
        <section className="mt-8" aria-labelledby={`${headingId}-specs`}>
          <h4
            id={`${headingId}-specs`}
            className="text-sm font-semibold text-white"
          >
            {labels.specifications}
          </h4>
          <dl className="mt-3 divide-y divide-white/10 text-sm">
            {specs.map((spec) => (
              <div
                key={`${spec.label}-${spec.value}`}
                className="grid gap-1 py-3 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:gap-4"
              >
                <dt className="text-gray-500">{spec.label}</dt>
                <dd className="break-words text-gray-300 sm:text-right">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </>
  );
}
