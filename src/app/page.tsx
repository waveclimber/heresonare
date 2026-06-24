"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

import { siteContent } from "@/data/siteContent";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { language, setLanguage } = useLanguage();

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar
        content={siteContent}
        language={language}
        setLanguage={setLanguage}
      />

      <Hero content={siteContent} language={language} />

      <Products content={siteContent} language={language} />

      <About content={siteContent} language={language} />

      <Contact content={siteContent} language={language} />

      <Footer content={siteContent} language={language} />
    </main>
  );
}