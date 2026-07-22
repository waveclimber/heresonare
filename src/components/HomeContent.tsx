"use client";

import About from "@/components/About";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import { ResonanceTicker } from "@/components/motion/ResonanceTicker";
import type { HomePageContent } from "@/content/contracts";
import { useLanguage } from "@/context/LanguageContext";

export default function HomeContent({
  content,
}: {
  content: HomePageContent;
}) {
  const { language, locale } = useLanguage();

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen bg-black text-white focus:outline-none"
    >
      <Hero content={content} />

      <ResonanceTicker
        primary={content.heroEyebrow}
        secondary={content.heroBusinessAreas}
      />

      <Products content={content} locale={locale} />

      <About content={content} />

      <Contact content={content} language={language} />
    </main>
  );
}
