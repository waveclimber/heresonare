"use client";

import About from "@/components/About";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import { useLanguage } from "@/context/LanguageContext";
import { siteContent } from "@/data/siteContent";

export default function HomeContent() {
  const { language } = useLanguage();

  return (
    <main className="min-h-screen bg-black text-white">
      <Hero content={siteContent} language={language} />

      <Products content={siteContent} language={language} />

      <About content={siteContent} language={language} />

      <Contact content={siteContent} language={language} />
    </main>
  );
}
