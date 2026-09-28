import "server-only";
import { getPublishedEntries } from "@/platform/server";
import { recordPath } from "@/platform/domain";

import { getPageContent, getProductionContent, getSiteContent } from "@/content/repository";
import { getNavigationItems } from "@/data/navigation";
import type { PageContentItem } from "@/data/pageContent";
import { getProductionDetailPath, productionSlugs } from "@/data/productionRoutes";
import { searchContent } from "@/data/searchContent";
import { visitorContent } from "@/data/visitorContent";
import { contentLanguageByLocale, getLocalizedPath, type Locale } from "@/i18n/config";
import type { SearchEntry } from "@/lib/siteSearch.mjs";

function itemKeywords(item: PageContentItem) {
  return [item.title, item.description, item.subtitle, item.role, item.type, item.category, item.status, item.location, item.date, item.year, ...(item.features ?? []), ...(item.useCases ?? []), ...(item.specs ?? []).flatMap(({ label, value }) => [label, value])].filter(Boolean).join(" ");
}

export async function getSearchIndex(locale: Locale): Promise<SearchEntry[]> {
  const language = contentLanguageByLocale[locale];
  const navigation = getNavigationItems(language, locale);
  const [site, pages, productions] = await Promise.all([
    getSiteContent(language),
    Promise.all(navigation.map(({ key }) => getPageContent(language, key))),
    Promise.all(productionSlugs.map((slug) => getProductionContent(language, slug))),
  ]);
  const entries: SearchEntry[] = [{
    href: getLocalizedPath("/", locale),
    label: searchContent[language].home,
    title: site.heroTitle,
    description: site.heroDescription,
    keywords: `${site.heroSubtitle} ${site.heroBusinessAreas}`,
    kind: "page",
    status: "",
  }];

  pages.forEach((page, index) => {
    if (!page) return;
    const item = navigation[index];
    entries.push({
      href: item.href,
      label: item.label,
      title: page.hero.title,
      description: page.hero.description,
      keywords: [page.hero.tag, ...(item.key === "contact" ? [visitorContent[language].help, ...visitorContent[language].questions.flatMap(({ question, answer }) => [question, answer])] : []), ...page.sections.flatMap((section) => [section.title, section.label, section.description, section.comingSoon?.title, section.comingSoon?.description, ...(section.items ?? []).map(itemKeywords)])].filter(Boolean).join(" "),
      kind: "page",
      status: "",
    });
  });
  productions.forEach((production, index) => {
    if (!production) return;
    entries.push({
      href: getLocalizedPath(getProductionDetailPath(productionSlugs[index]), locale),
      label: navigation.find(({ key }) => key === "productions")!.label,
      title: production.title,
      description: production.description,
      keywords: itemKeywords(production),
      kind: "production",
      status: production.status ?? "",
    });
  });
  for (const entry of await getPublishedEntries()) {
    const content = entry.translations[locale];
    entries.push({ href: recordPath(entry, locale), label: navigation.find((item) => item.key === entry.module)!.label, title: content.title, description: content.summary, keywords: `${content.body} ${entry.category} ${entry.location}`, kind: "page", status: "" });
  }
  return entries;
}
