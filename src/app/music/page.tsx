"use client";

import { useLanguage } from "@/context/LanguageContext";
import { siteContent } from "@/data/siteContent";

export default function MusicPage() {
  const { language } = useLanguage();
  const content = siteContent[language];

  const releases = [
    {
      title: "Resonance 01",
      type: "Single",
      description:
        "A futuristic soundscape built around emotion, clarity, and movement.",
    },
    {
      title: "Blue Signal",
      type: "EP",
      description:
        "Electronic textures and melodic storytelling shaped for a new era.",
    },
    {
      title: "Future Echoes",
      type: "Album Concept",
      description:
        "A long-form musical world exploring memory, identity, and resonance.",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-7xl px-6 py-32">
        <p className="mb-4 text-sm uppercase tracking-[0.35em] text-cyan-400">
          {content.pages.music.tag}
        </p>

        <h1 className="mb-6 text-5xl font-bold md:text-7xl">
          {content.pages.music.title}
        </h1>

        <p className="mb-20 max-w-2xl text-lg text-white/70">
          {content.pages.music.description}
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {releases.map((release) => (
            <div
              key={release.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(34,211,238,0.25)]"
            >
              <p className="mb-3 text-sm text-cyan-400">
                {release.type}
              </p>

              <h2 className="mb-4 text-2xl font-semibold">
                {release.title}
              </h2>

              <p className="text-white/65">
                {release.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}