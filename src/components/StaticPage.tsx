"use client";

import ComingSoonBlock from "@/components/ComingSoonBlock";
import ContentCard from "@/components/ContentCard";
import PageHero from "@/components/PageHero";
import { PageContents, PageNextStep } from "@/components/PageJourney";
import SectionHeader from "@/components/SectionHeader";
import { useLanguage } from "@/context/LanguageContext";
import type { StaticPageContent } from "@/data/pageContent";
import type { PageJourneyLabels } from "@/data/visitorContent";
import { interfaceContent } from "@/data/interfaceContent";
import { getLocalizedHref } from "@/i18n/config";

type StaticPageProps = {
  content: StaticPageContent;
  children?: React.ReactNode;
  journey: PageJourneyLabels;
  afterContent?: React.ReactNode;
};

export default function StaticPage({ content, children, journey, afterContent }: StaticPageProps) {
  const { language, locale } = useLanguage();
  const labels = interfaceContent[language].staticPage;

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen bg-black text-white focus:outline-none"
    >
      <PageHero
        tag={content.hero.tag}
        title={content.hero.title}
        description={content.hero.description}
      />

      <div className="mx-auto max-w-7xl px-6 pb-32">
        <PageContents content={content} labels={journey} />
        {children}
        <div className="grid gap-24">
          {content.sections.map((section) => (
            <section key={section.id} id={`section-${section.id}`} tabIndex={-1} aria-label={section.title} className="focus:outline-none">
              <SectionHeader
                label={section.label}
                title={section.title}
                description={section.description}
              />

              {section.comingSoon && (
                <div className={section.items?.length ? "mb-10" : ""}>
                  <ComingSoonBlock
                    label={section.comingSoon.label}
                    title={section.comingSoon.title}
                    description={section.comingSoon.description}
                    cta={
                      section.comingSoon.cta
                        ? {
                            ...section.comingSoon.cta,
                            href: getLocalizedHref(
                              section.comingSoon.cta.href,
                              locale
                            ),
                          }
                        : undefined
                    }
                  />
                </div>
              )}
              {section.items && section.items.length > 0 && (
                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {section.items.map((item) => (
                    <ContentCard
                      key={item.id}
                      item={item}
                      labels={labels}
                      locale={locale}
                    />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
        {afterContent}
        {content.slug !== "contact" && <PageNextStep labels={journey} locale={locale} />}
      </div>
    </main>
  );
}
