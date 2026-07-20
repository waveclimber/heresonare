import type { Language, SiteContent } from "@/data/siteContent";

type ContentProps = {
  content: SiteContent;
  language: Language;
};

export default function About({ content, language }: ContentProps) {
  const localizedContent = content[language];
  const aboutCards = [
    {
      number: "01",
      title: localizedContent.aboutStoryTitle,
      text: localizedContent.aboutStoryText,
      color: "bg-[var(--brand-blue)]",
    },
    {
      number: "02",
      title: localizedContent.aboutMissionTitle,
      text: localizedContent.aboutMissionText,
      color: "bg-[var(--brand-pink)]",
    },
    {
      number: "03",
      title: localizedContent.aboutVisionTitle,
      text: localizedContent.aboutVisionText,
      color: "bg-[var(--brand-teal)]",
    },
  ];

  return (
    <section id="about" className="relative overflow-hidden px-6 py-32">
      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--brand-pink)] opacity-10 blur-3xl" />
      <div className="absolute right-[-160px] top-20 h-[420px] w-[420px] rounded-full bg-[var(--brand-blue)] opacity-10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="sticky top-32">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--brand-blue)]">
              {localizedContent.aboutTag}
            </p>

            <h2 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              {localizedContent.aboutTitle}
            </h2>

            <div className="mt-8 h-px w-32 bg-white/10" />

            <p className="mt-8 max-w-xl text-lg leading-8 text-gray-400">
              {localizedContent.aboutText1}
            </p>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-400">
              {localizedContent.aboutText2}
            </p>
          </div>

          <div className="grid gap-6">
            {aboutCards.map((card) => (
              <div
                key={card.number}
                className="group relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-[var(--brand-blue)]/50 hover:bg-white/[0.07] hover:shadow-[0_0_45px_rgba(14,108,178,0.14)]"
              >
                <div className="absolute right-8 top-8 text-6xl font-bold text-white/5 transition-all duration-500 group-hover:text-white/10">
                  {card.number}
                </div>

                <div className={`mb-8 h-1 w-16 rounded-full ${card.color}`} />

                <p className="text-xs tracking-[0.3em] text-gray-500">
                  {localizedContent.aboutCardLabel}
                </p>

                <h3 className="mt-5 text-2xl font-semibold text-white">
                  {card.title}
                </h3>

                <p className="mt-5 max-w-2xl leading-8 text-gray-400">
                  {card.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
