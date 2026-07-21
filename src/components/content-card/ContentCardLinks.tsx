import type { ContentCardLabels } from "@/components/content-card/contentCardUtils";
import { ResonanceLink } from "@/components/motion/ResonanceLink";
import type { PageContentItem, PageLink } from "@/data/pageContent";
import { getLocalizedHref, type Locale } from "@/i18n/config";

type ContentCardLinksProps = {
  item: PageContentItem;
  labels: ContentCardLabels;
  locale: Locale;
};

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

function CardLink({
  link,
  locale,
  opensInNewTabLabel,
}: {
  link: PageLink;
  locale: Locale;
  opensInNewTabLabel: string;
}) {
  const href = normalizeHref(link.href, locale);
  const internal = isInternalHref(link.href);
  const opensNewTab = Boolean(link.external && !href.startsWith("mailto:"));
  const className =
    "inline-flex min-h-11 items-center rounded-full border border-[var(--brand-blue)]/60 px-5 py-2 text-sm font-medium text-[var(--brand-blue)] transition-colors hover:border-[var(--brand-blue)] hover:bg-[var(--brand-blue)] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-yellow)]";

  return (
    <ResonanceLink
      href={href}
      className={className}
      external={!internal || Boolean(link.external)}
      target={opensNewTab ? "_blank" : undefined}
      rel={opensNewTab ? "noopener noreferrer" : undefined}
    >
      {opensNewTab ? (
        <>
          <span aria-hidden="true">{link.label} ↗</span>
          <span className="sr-only">
            {link.label}, {opensInNewTabLabel}
          </span>
        </>
      ) : (
        link.label
      )}
    </ResonanceLink>
  );
}

export default function ContentCardLinks({
  item,
  labels,
  locale,
}: ContentCardLinksProps) {
  const links = getCardLinks(item, locale, labels.view);
  if (links.length === 0) return null;

  return (
    <nav
      className="mt-auto pt-8"
      aria-label={`${labels.links}: ${item.title}`}
    >
      <h4 className="sr-only">{labels.links}</h4>
      <ul className="flex flex-wrap gap-3">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <CardLink
              link={link}
              locale={locale}
              opensInNewTabLabel={labels.opensInNewTab}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
