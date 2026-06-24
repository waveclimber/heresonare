"use client";

import { useLanguage } from "@/context/LanguageContext";
import { siteContent } from "@/data/siteContent";

export default function ProductionsPage() {
  const { language } = useLanguage();
  const content = siteContent[language];

  const services = [
    {
      title: "Music Production",
      description:
        "From concept to final sound, we support artists with production, arrangement, and direction.",
    },
    {
      title: "Visual Direction",
      description:
        "We create visual systems for artists, releases, performances, and digital campaigns.",
    },
    {
      title: "Live Experience",
      description:
        "We design stage, event, and performance concepts that connect music with audience emotion.",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-7xl px-6 py-32">
        <p className="mb-4 text-sm uppercase tracking-[0.35em] text-cyan-400">
          {content.pages.productions.tag}
        </p>

        <h1 className="mb-6 text-5xl font-bold md:text-7xl">
          {content.pages.productions.title}
        </h1>

        <p className="mb-20 max-w-2xl text-lg text-white/70">
          {content.pages.productions.description}
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(34,211,238,0.25)]"
            >
              <h2 className="mb-4 text-2xl font-semibold">
                {service.title}
              </h2>

              <p className="text-white/65">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}