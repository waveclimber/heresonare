"use client";

import { useLanguage } from "@/context/LanguageContext";
import { siteContent } from "@/data/siteContent";

export default function ArtistsPage() {
  const { language } = useLanguage();
  const content = siteContent[language];

  const artists = [
    {
      name: "Artist 01",
      role: "Vocal Artist",
      description:
        "A voice that connects emotion, technology, and future-facing sound.",
    },
    {
      name: "Artist 02",
      role: "Producer / Composer",
      description:
        "Creating immersive music experiences across digital and live spaces.",
    },
    {
      name: "Artist 03",
      role: "Creative Performer",
      description:
        "Blending performance, storytelling, and visual identity into music.",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-7xl px-6 py-32">
        <p className="mb-4 text-sm uppercase tracking-[0.35em] text-cyan-400">
          {content.pages.artists.tag}
        </p>

        <h1 className="mb-6 text-5xl font-bold md:text-7xl">
          {content.pages.artists.title}
        </h1>

        <p className="mb-20 max-w-2xl text-lg text-white/70">
          {content.pages.artists.description}
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {artists.map((artist) => (
            <div
              key={artist.name}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(34,211,238,0.25)]"
            >
              <p className="mb-3 text-sm text-cyan-400">{artist.role}</p>
              <h2 className="mb-4 text-2xl font-semibold">{artist.name}</h2>
              <p className="text-white/65">{artist.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}