"use client";

import ComingSoonBlock from "@/components/ComingSoonBlock";
import ContentCard from "@/components/ContentCard";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import { useLanguage } from "@/context/LanguageContext";
import {
  pageContent,
  type PageKey,
  type StaticPageContent,
} from "@/data/pageContent";

type StaticPageProps = {
  pageKey: PageKey;
};

export default function StaticPage({ pageKey }: StaticPageProps) {
  const { language } = useLanguage();
  const page: StaticPageContent = pageContent[language][pageKey];

  return (
    <main className="min-h-screen bg-black text-white">
      <PageHero
        tag={page.hero.tag}
        title={page.hero.title}
        description={page.hero.description}
      />

      <div className="mx-auto max-w-7xl px-6 pb-32">
        <div className="grid gap-24">
          {page.sections.map((section) => (
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
                      title={item.title}
                      description={item.description}
                      subtitle={
                        item.subtitle ??
                        item.role ??
                        item.type ??
                        item.category
                      }
                      status={item.status}
                      meta={
                        item.meta ??
                        item.year ??
                        item.date ??
                        item.location
                      }
                      href={item.href}
                    />
                  ))}
                </div>
              )}

              {section.comingSoon && (
                <div className={section.items?.length ? "mt-10" : ""}>
                  <ComingSoonBlock
                    title={section.comingSoon.title}
                    description={section.comingSoon.description}
                    cta={section.comingSoon.cta}
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
