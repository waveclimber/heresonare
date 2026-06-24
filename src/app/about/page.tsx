"use client";

import { useLanguage } from "@/context/LanguageContext";
import { siteContent } from "@/data/siteContent";

export default function AboutPage() {
  const { language } = useLanguage();
  const content = siteContent[language];

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-7xl px-6 py-32">
        <p className="mb-4 text-sm uppercase tracking-[0.35em] text-cyan-400">
          {content.pages.about.tag}
        </p>

        <h1 className="mb-6 text-5xl font-bold md:text-7xl">
          {content.pages.about.title}
        </h1>

        <p className="max-w-2xl text-lg text-white/70">
          {content.pages.about.description}
        </p>
      </section>
    </main>
  );
}