"use client";

import About from "@/components/About";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import { ResonanceTicker } from "@/components/motion/ResonanceTicker";
import { useLanguage } from "@/context/LanguageContext";
import { siteContent } from "@/data/siteContent";

export default function HomeContent() {
  const { language, locale } = useLanguage();
  const localizedContent = siteContent[language];

  return (
    <main className="min-h-screen bg-black text-white">
      <Hero content={siteContent} language={language} />

      <ResonanceTicker
        primary={localizedContent.heroEyebrow}
        secondary={localizedContent.heroBusinessAreas}
      />

      <Products content={siteContent} language={language} locale={locale} />

      <About content={siteContent} language={language} />

      <Contact content={siteContent} language={language} />
    </main>
  );
}
