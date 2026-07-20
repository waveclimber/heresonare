import type { Language, SiteContent } from "@/data/siteContent";
import {
  Reveal,
  StaggerGroup,
  StaggerItem,
} from "@/components/motion/MotionPrimitives";
import { ResonanceLink } from "@/components/motion/ResonanceLink";
import { ResonanceSurface } from "@/components/motion/ResonanceSurface";

type ContentProps = {
  content: SiteContent;
  language: Language;
};

export default function Contact({ content, language }: ContentProps) {
  const localizedContent = content[language];
  const contactItems = [
    {
      number: "01",
      title: localizedContent.contactArtistsTitle,
      text: localizedContent.contactArtistsText,
      color: "bg-[var(--brand-blue)]",
      border: "hover:border-[var(--brand-blue)]/50",
      glow: "blue" as const,
    },
    {
      number: "02",
      title: localizedContent.contactPartnersTitle,
      text: localizedContent.contactPartnersText,
      color: "bg-[var(--brand-pink)]",
      border: "hover:border-[var(--brand-pink)]/50",
      glow: "pink" as const,
    },
    {
      number: "03",
      title: localizedContent.contactVenuesTitle,
      text: localizedContent.contactVenuesText,
      color: "bg-[var(--brand-teal)]",
      border: "hover:border-[var(--brand-teal)]/50",
      glow: "teal" as const,
    },
  ];

  return (
    <section id="contact" className="relative overflow-hidden px-6 py-32">
      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--brand-blue)] opacity-10 blur-3xl" />
      <div className="absolute left-[-160px] bottom-0 h-[420px] w-[420px] rounded-full bg-[var(--brand-pink)] opacity-10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Reveal distance="subtle">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--brand-blue)]">
              {localizedContent.contactTag}
            </p>

            <h2 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              {localizedContent.contactTitle}
            </h2>

            <div className="mt-8 h-px w-32 bg-white/10" />

            <p className="mt-8 max-w-xl text-lg leading-8 text-gray-400">
              {localizedContent.contactText}
            </p>

            <div className="mt-10">
              <ResonanceLink
                href="mailto:contact@heresonare.com"
                className="inline-flex rounded-full bg-[var(--brand-blue)] px-8 py-3 text-white shadow-[0_0_25px_rgba(14,108,178,0.35)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_0_34px_rgba(14,108,178,0.62)]"
              >
                {localizedContent.contactEmailLabel}
              </ResonanceLink>
            </div>
          </Reveal>

          <StaggerGroup className="grid gap-6">
            {contactItems.map((item) => (
              <StaggerItem key={item.number} className="h-full">
                <ResonanceSurface
                  className={`h-full rounded-[36px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md transition-[border-color,background-color,box-shadow] duration-500 hover:bg-white/[0.07] hover:shadow-[0_0_45px_rgba(14,108,178,0.12)] ${item.border}`}
                  glow={item.glow}
                >
                  <div className="absolute right-8 top-8 text-6xl font-bold text-white/5 transition-all duration-500 group-hover:text-white/10">
                    {item.number}
                  </div>

                  <div className={`mb-8 h-1 w-16 rounded-full ${item.color}`} />

                  <p className="text-xs tracking-[0.3em] text-gray-500">
                    {localizedContent.contactCardLabel}
                  </p>

                  <h3 className="mt-5 text-2xl font-semibold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-5 max-w-2xl leading-8 text-gray-400">
                    {item.text}
                  </p>
                </ResonanceSurface>
              </StaggerItem>
            ))}

            <StaggerItem className="flex flex-wrap gap-3 pt-2" distance="subtle">
              <ResonanceLink
                href="https://xhslink.com/m/2DWzE9YLlI2"
                external
                glow="pink"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/10 px-5 py-2 text-sm text-gray-300 transition-all duration-300 hover:border-[var(--brand-pink)] hover:text-[var(--brand-pink)]"
              >
                {localizedContent.xiaohongshuLabel}
              </ResonanceLink>

              <span className="rounded-full border border-white/10 px-5 py-2 text-sm text-gray-500">
                {localizedContent.instagramStatus}
              </span>

              <span className="rounded-full border border-white/10 px-5 py-2 text-sm text-gray-500">
                {localizedContent.xStatus}
              </span>
            </StaggerItem>
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
