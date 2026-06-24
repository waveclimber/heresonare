"use client";

import { useLanguage } from "@/context/LanguageContext";
import { siteContent } from "@/data/siteContent";

export default function StorePage() {
  const { language } = useLanguage();
  const content = siteContent[language];

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-7xl px-6 py-32">
        <p className="mb-4 text-sm uppercase tracking-[0.35em] text-cyan-400">
          {content.pages.store.tag}
        </p>

        <h1 className="mb-6 text-5xl font-bold md:text-7xl">
          {content.pages.store.title}
        </h1>

        <p className="mb-20 max-w-2xl text-lg text-white/70">
          {content.pages.store.description}
        </p>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-12">
          <h2 className="mb-4 text-2xl font-semibold">
            Coming Soon
          </h2>

          <p className="text-white/65">
            Official merchandise, music releases, collectibles,
            and exclusive products from héReSonare will be
            available here in the future.
          </p>
        </div>
      </section>
    </main>
  );
}