import Image from "next/image";
import Link from "next/link";
import type { PageContentItem, PageLink } from "@/data/pageContent";
import type { interfaceContent } from "@/data/interfaceContent";
import { getLocalizedHref, type Locale } from "@/i18n/config";

type ContentCardProps = {
  item: PageContentItem;
  labels: (typeof interfaceContent)[keyof typeof interfaceContent]["staticPage"];
  locale: Locale;
};

const auditedLocalMedia = new Set([
  "/apple-icon.png",
  "/icon.png",
  "/images/logo/bg1.png",
  "/images/logo/bg1.svg",
  "/images/logo/bg2.png",
  "/images/logo/bg2.svg",
  "/images/logo/bg3.png",
  "/images/logo/bg3.svg",
  "/images/logo/logo-black.png",
  "/images/logo/logo-black.svg",
  "/images/logo/logo-color.png",
  "/images/logo/logo-color.svg",
  "/images/logo/logo-color0.png",
  "/images/logo/logo-color0.svg",
  "/images/logo/logo-icon.png",
  "/images/logo/logo-icon.svg",
  "/images/logo/logo-long.png",
  "/images/logo/logo-long.svg",
  "/images/logo/logo-white.png",
  "/images/logo/logo-white.svg",
]);

function uniqueValues(values: Array<string | undefined>) {
  const seen = new Set<string>();

  return values.filter((value): value is string => {
    if (!value) return false;
    const normalized = value.trim().toLocaleLowerCase();
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

function isRasterMedia(path: string | undefined): path is string {
  return Boolean(
    path &&
      auditedLocalMedia.has(path) &&
      /\.(?:avif|jpe?g|png|webp)$/iu.test(path)
  );
}

function isIconMedia(path: string | undefined): path is string {
  return Boolean(
    path &&
      auditedLocalMedia.has(path) &&
      /\.(?:svg|png|webp)$/iu.test(path)
  );
}

function getCardMedia(item: PageContentItem) {
  return [item.media?.card, item.image, item.media?.render].find(isRasterMedia);
}

function isInternalHref(href: string) {
  return href.startsWith("/") && !href.startsWith("//");
}

function normalizeHref(href: string, locale: Locale) {
  return isInternalHref(href) ? getLocalizedHref(href, locale) : href;
}

function getCardLinks(item: PageContentItem, locale: Locale, viewLabel: string) {
  const links: PageLink[] = [...(item.links ?? [])];

  if (item.href && !links.some((link) => link.href === item.href)) {
    links.push({ label: viewLabel, href: item.href });
  }

  const seen = new Set<string>();
  return links.filter((link) => {
    const href = normalizeHref(link.href, locale);
    if (seen.has(href)) return false;
    seen.add(href);
    return true;
  });
}

function CardLink({ link, locale }: { link: PageLink; locale: Locale }) {
  const href = normalizeHref(link.href, locale);
  const internal = isInternalHref(link.href);
  const opensNewTab = Boolean(link.external && !href.startsWith("mailto:"));
  const className =
    "inline-flex min-h-11 items-center rounded-full border border-[var(--brand-blue)]/60 px-5 py-2 text-sm font-medium text-[var(--brand-blue)] transition-colors hover:border-[var(--brand-blue)] hover:bg-[var(--brand-blue)] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-yellow)]";

  return internal && !link.external ? (
    <Link href={href} className={className}>
      {link.label}
    </Link>
  ) : (
    <a
      href={href}
      className={className}
      target={opensNewTab ? "_blank" : undefined}
      rel={opensNewTab ? "noopener noreferrer" : undefined}
    >
      {link.label}
    </a>
  );
}

export default function ContentCard({
  item,
  labels,
  locale,
}: ContentCardProps) {
  const primaryLabels = uniqueValues([
    item.subtitle,
    item.role,
    item.type,
    item.category,
  ]);
  const excludedMetadata = new Set(
    uniqueValues([...primaryLabels, item.status]).map((value) =>
      value.toLocaleLowerCase()
    )
  );
  const metadata = uniqueValues([
    item.meta,
    item.year,
    item.date,
    item.location,
  ]).filter((value) => !excludedMetadata.has(value.toLocaleLowerCase()));
  const visibleSpecs = item.specs?.filter(
    (spec, index, specs) =>
      specs.findIndex(
        (candidate) =>
          candidate.label.trim().toLocaleLowerCase() ===
            spec.label.trim().toLocaleLowerCase() &&
          candidate.value.trim().toLocaleLowerCase() ===
            spec.value.trim().toLocaleLowerCase()
      ) === index
  );
  const cardMedia = getCardMedia(item);
  const icon = isIconMedia(item.media?.icon) ? item.media.icon : undefined;
  const links = getCardLinks(item, locale, labels.view);

  return (
    <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-[var(--brand-blue)]/60 hover:bg-white/[0.07] hover:shadow-[0_0_45px_rgba(14,108,178,0.14)]">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_25%_20%,rgba(76,186,175,0.24),transparent_34%),radial-gradient(circle_at_80%_75%,rgba(14,108,178,0.34),transparent_38%),#111]">
        {cardMedia ? (
          <Image
            src={cardMedia}
            alt={item.title}
            fill
            sizes="(max-width: 767px) calc(100vw - 3rem), (max-width: 1279px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center p-10"
            aria-hidden="true"
          >
            <Image
              src="/images/logo/logo-white.svg"
              alt=""
              width={360}
              height={90}
              loading="eager"
              className="h-auto w-full max-w-56 opacity-70"
            />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            {primaryLabels.length > 0 && (
              <ul
                className="flex flex-wrap gap-x-3 gap-y-2"
                aria-label={primaryLabels.join(", ")}
              >
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
            <h3 className="mt-4 break-words text-2xl font-semibold text-white">
              {item.title}
            </h3>
          </div>

          {icon && (
            <Image
              src={icon}
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 object-contain"
              aria-hidden="true"
            />
          )}
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

        {item.features && item.features.length > 0 && (
          <section className="mt-8" aria-labelledby={`${item.id}-features`}>
            <h4
              id={`${item.id}-features`}
              className="text-sm font-semibold text-white"
            >
              {labels.features}
            </h4>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-gray-400 marker:text-[var(--brand-blue)]">
              {item.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </section>
        )}

        {item.useCases && item.useCases.length > 0 && (
          <section className="mt-8" aria-labelledby={`${item.id}-use-cases`}>
            <h4
              id={`${item.id}-use-cases`}
              className="text-sm font-semibold text-white"
            >
              {labels.useCases}
            </h4>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-gray-400 marker:text-[var(--brand-teal)]">
              {item.useCases.map((useCase) => (
                <li key={useCase}>{useCase}</li>
              ))}
            </ul>
          </section>
        )}

        {visibleSpecs && visibleSpecs.length > 0 && (
          <section className="mt-8" aria-labelledby={`${item.id}-specs`}>
            <h4
              id={`${item.id}-specs`}
              className="text-sm font-semibold text-white"
            >
              {labels.specifications}
            </h4>
            <dl className="mt-3 divide-y divide-white/10 text-sm">
              {visibleSpecs.map((spec) => (
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

        {links.length > 0 && (
          <nav
            className="mt-auto pt-8"
            aria-label={`${labels.links}: ${item.title}`}
          >
            <h4 className="sr-only">{labels.links}</h4>
            <ul className="flex flex-wrap gap-3">
              {links.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <CardLink link={link} locale={locale} />
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </article>
  );
}
