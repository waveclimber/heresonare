"use client";

import { useLanguage } from "@/context/LanguageContext";
import { siteContent } from "@/data/siteContent";

export default function TourPage() {
  const { language } = useLanguage();
  const content = siteContent[language];

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-7xl px-6 py-32">
        <p className="mb-4 text-sm uppercase tracking-[0.35em] text-cyan-400">
          {content.pages.tour.tag}
        </p>

        <h1 className="mb-6 text-5xl font-bold md:text-7xl">
          {content.pages.tour.title}
        </h1>

        <p className="mb-20 max-w-2xl text-lg text-white/70">
          {content.pages.tour.description}
        </p>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-12">
          <h2 className="mb-4 text-2xl font-semibold">
            Upcoming Events
          </h2>

          <p className="text-white/65">
            Future tours, live events, showcases, and special performances.
          </p>
        </div>
      </section>
    </main>
  );
}