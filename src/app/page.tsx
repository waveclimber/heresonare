"use client";

import Hero from "@/components/Hero";
import Products from "@/components/Products";
import About from "@/components/About";
import Contact from "@/components/Contact";

import { siteContent } from "@/data/siteContent";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
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
