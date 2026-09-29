import type { Metadata } from "next";
import { notFound } from "next/navigation";

import StaticPage from "@/components/StaticPage";
import PublishedHighlights from "@/components/platform/PublishedHighlights";
import { platformContent } from "@/data/platformContent";
import ContactInquiry from "@/components/ContactInquiry";
import VisitorQuestions from "@/components/VisitorQuestions";
import { pageInquiryTopics, visitorContent } from "@/data/visitorContent";
import { isApprovedContentMediaPath } from "@/data/contentMedia";
import StructuredData from "@/components/StructuredData";
import { getPageContent, getSiteContent } from "@/content/repository";
import { isNavigationKey, navigationRoutes } from "@/data/navigation";
import { contentLanguageByLocale, isLocale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/pageMetadata";
import { createPageStructuredData } from "@/lib/structuredData";

export const dynamicParams = true;
export const revalidate = 60;

export function generateStaticParams() {
  return navigationRoutes.map(({ key }) => ({ page: key }));
}

async function getPage(localeValue: string, pageValue: string) {
  if (!isLocale(localeValue) || !isNavigationKey(pageValue)) {
    notFound();
  }

  const language = contentLanguageByLocale[localeValue];
  const content = await getPageContent(language, pageValue);

  if (!content) {
    notFound();
  }

  // Keep the fallback signal while omitting unpublished media paths from client props.
  const displayContent = {
    ...content,
    sections: content.sections.map((section) => ({
      ...section,
      items: section.items?.map(({ image, media, category, ...item }) => ({
        ...item,
        ...(category &&
        ![item.subtitle, item.role, item.type].includes(category)
          ? { category }
          : {}),
        ...(isApprovedContentMediaPath(image) ? { image } : {}),
        ...(media
          ? {
              media: Object.fromEntries(
                Object.entries(media).filter(([, path]) =>
                  isApprovedContentMediaPath(path),
                ),
              ),
            }
          : {}),
      })),
    })),
  };
  return { content: displayContent, language, locale: localeValue };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; page: string }>;
}): Promise<Metadata> {
  const { locale, page } = await params;

  const result = await getPage(locale, page);
  const siteContent = await getSiteContent(result.language);

  return createPageMetadata(result.content, result.locale, siteContent);
}

export default async function PublicPage({
  params,
}: {
  params: Promise<{ locale: string; page: string }>;
}) {
  const { locale, page } = await params;

  const result = await getPage(locale, page);

  return (
    <>
      <StructuredData
        data={createPageStructuredData(result.content, result.locale)}
      />
      <StaticPage
        content={result.content}
        journey={{
          catalog: platformContent[result.locale].latest,
          ...(page === "contact"
            ? { connect: platformContent[result.locale].connect }
            : {}),
          ...(page === "store"
            ? { bag: platformContent[result.locale].bag }
            : {}),
          onThisPage: visitorContent[result.language].onThisPage,
          inquiry: visitorContent[result.language].inquiry,
          help: visitorContent[result.language].help,
          nextStep: visitorContent[result.language].nextStep,
          contactAction: visitorContent[result.language].contactAction,
          description:
            result.content.slug === "contact"
              ? ""
              : visitorContent[result.language].nextSteps[result.content.slug],
          topic:
            result.content.slug === "contact"
              ? "general"
              : pageInquiryTopics[result.content.slug],
        }}
        afterContent={
          result.content.slug === "contact" && (
            <VisitorQuestions language={result.language} />
          )
        }
      >
        <PublishedHighlights
          locale={result.locale}
          module={result.content.slug}
        />
        {page === "contact" && <ContactInquiry language={result.language} />}
      </StaticPage>
    </>
  );
}
