import type {
  PageContentItem,
  StaticPageContent,
} from "@/data/pageContent";
import type { SiteMetadataContent } from "@/content/contracts";
import {
  getLocalizedPath,
  htmlLangByLocale,
  supportedLocales,
  type Locale,
} from "@/i18n/config";
import { brandName } from "@/lib/siteIdentity";
import { getAbsoluteSiteUrl } from "@/lib/siteUrl";

const rootUrl = getAbsoluteSiteUrl("/");
const organizationId = `${rootUrl}#organization`;
const websiteId = `${rootUrl}#website`;

type Breadcrumb = {
  name: string;
  pathname: string;
};

function createWebPage(
  title: string,
  description: string,
  locale: Locale,
  pathname: string,
) {
  const url = getAbsoluteSiteUrl(getLocalizedPath(pathname, locale));

  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: htmlLangByLocale[locale],
    isPartOf: { "@id": websiteId },
    about: { "@id": organizationId },
    ...(pathname === "/"
      ? {}
      : { breadcrumb: { "@id": `${url}#breadcrumb` } }),
  };
}

function createBreadcrumbList(locale: Locale, breadcrumbs: Breadcrumb[]) {
  const currentUrl = getAbsoluteSiteUrl(
    getLocalizedPath(breadcrumbs.at(-1)?.pathname ?? "/", locale),
  );

  return {
    "@type": "BreadcrumbList",
    "@id": `${currentUrl}#breadcrumb`,
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.name,
      item: getAbsoluteSiteUrl(
        getLocalizedPath(breadcrumb.pathname, locale),
      ),
    })),
  };
}

export function createHomeStructuredData(
  locale: Locale,
  content: SiteMetadataContent,
) {
  const title = `${brandName} | ${content.heroSubtitle}`;
  const description = content.heroDescription;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: brandName,
        url: rootUrl,
        logo: getAbsoluteSiteUrl("/icon.png"),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: rootUrl,
        name: brandName,
        inLanguage: supportedLocales.map(
          (supportedLocale) => htmlLangByLocale[supportedLocale],
        ),
        publisher: { "@id": organizationId },
      },
      createWebPage(title, description, locale, "/"),
    ],
  };
}

export function createPageStructuredData(
  page: StaticPageContent,
  locale: Locale,
) {
  const title = `${page.hero.title} | ${brandName}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      createWebPage(title, page.hero.description, locale, `/${page.slug}`),
      createBreadcrumbList(locale, [
        { name: brandName, pathname: "/" },
        { name: page.hero.title, pathname: `/${page.slug}` },
      ]),
    ],
  };
}

export function createProductionStructuredData(
  production: PageContentItem,
  locale: Locale,
  productionsPageTitle: string,
) {
  const pathname = `/productions/${production.slug}`;
  const title = `${production.title} | ${brandName}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      createWebPage(title, production.description, locale, pathname),
      createBreadcrumbList(locale, [
        { name: brandName, pathname: "/" },
        {
          name: productionsPageTitle,
          pathname: "/productions",
        },
        { name: production.title, pathname },
      ]),
    ],
  };
}
