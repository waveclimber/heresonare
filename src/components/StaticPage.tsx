"use client";

import ComingSoonBlock from "@/components/ComingSoonBlock";
import ContentCard from "@/components/ContentCard";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import { useLanguage } from "@/context/LanguageContext";
import type { StaticPageContent } from "@/data/pageContent";
import { interfaceContent } from "@/data/interfaceContent";
import { getLocalizedHref } from "@/i18n/config";

type StaticPageProps = {
  content: StaticPageContent;
};

export default function StaticPage({ content }: StaticPageProps) {
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
        <div className="grid gap-24">
          {content.sections.map((section) => (
            <section key={section.id}>
              <SectionHeader
                label={section.label}
                title={section.title}
                description={section.description}
              />

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

              {section.comingSoon && (
                <div className={section.items?.length ? "mt-10" : ""}>
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
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
