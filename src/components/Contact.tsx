import type { HomePageContent } from "@/content/contracts";
import {
  Reveal,
  StaggerGroup,
  StaggerItem,
} from "@/components/motion/MotionPrimitives";
import {
  ContactConvergePath,
  ConvergeTarget,
} from "@/components/motion/ConvergePaths";
import { ResonanceLink } from "@/components/motion/ResonanceLink";
import { ResonanceSurface } from "@/components/motion/ResonanceSurface";
import { interfaceContent } from "@/data/interfaceContent";
import { officialSocialLinks } from "@/data/socialLinks";
import type { ContentLanguage } from "@/i18n/config";

type ContentProps = {
  content: HomePageContent;
  language: ContentLanguage;
};

export default function Contact({ content, language }: ContentProps) {
  const contactItems = [
    {
      number: "01",
      title: content.contactArtistsTitle,
      text: content.contactArtistsText,
      color: "bg-[var(--brand-blue)]",
      border: "hover:border-[var(--brand-blue)]/50",
      glow: "blue" as const,
    },
    {
      number: "02",
      title: content.contactPartnersTitle,
      text: content.contactPartnersText,
      color: "bg-[var(--brand-pink)]",
      border: "hover:border-[var(--brand-pink)]/50",
      glow: "pink" as const,
    },
    {
      number: "03",
      title: content.contactVenuesTitle,
      text: content.contactVenuesText,
      color: "bg-[var(--brand-teal)]",
      border: "hover:border-[var(--brand-teal)]/50",
      glow: "teal" as const,
    },
  ];
  const opensInNewTab = interfaceContent[language].staticPage.opensInNewTab;
  const socialLinks = [
    {
      key: "instagram",
      href: officialSocialLinks.instagram,
      label: content.instagramLabel,
      glow: "blue" as const,
      hover:
        "hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]",
    },
    {
      key: "xiaohongshu",
      href: officialSocialLinks.xiaohongshu,
      label: content.xiaohongshuLabel,
      glow: "pink" as const,
      hover:
        "hover:border-[var(--brand-pink)] hover:text-[var(--brand-pink)]",
    },
    {
      key: "douyin",
      href: officialSocialLinks.douyin,
      label: content.douyinLabel,
      glow: "teal" as const,
      hover:
        "hover:border-[var(--brand-teal)] hover:text-[var(--brand-teal)]",
    },
  ];

  return (
    <section id="contact" className="relative overflow-hidden px-6 py-32">
      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--brand-blue)] opacity-10 blur-3xl" />
      <div className="absolute left-[-160px] bottom-0 h-[420px] w-[420px] rounded-full bg-[var(--brand-pink)] opacity-10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <ContactConvergePath className="pointer-events-none absolute inset-0 z-0 hidden lg:block" />
        <div className="relative z-10 grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Reveal distance="subtle">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--brand-blue)]">
              {content.contactTag}
            </p>

            <h2 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              {content.contactTitle}
            </h2>

            <div className="mt-8 h-px w-32 bg-white/10" />

            <p className="mt-8 max-w-xl text-lg leading-8 text-gray-400">
              {content.contactText}
            </p>

            <ConvergeTarget className="mt-10">
              <ResonanceLink
                href="mailto:contact@heresonare.com"
                className="inline-flex rounded-full bg-[var(--brand-blue)] px-8 py-3 text-white shadow-[0_0_25px_rgba(14,108,178,0.35)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_0_34px_rgba(14,108,178,0.62)]"
              >
                {content.contactEmailLabel}
              </ResonanceLink>
            </ConvergeTarget>
          </Reveal>

          <StaggerGroup className="grid gap-6">
            {contactItems.map((item) => (
              <StaggerItem key={item.number} className="relative h-full">
                <span
                  aria-hidden="true"
                  className={`absolute -left-1 top-1/2 z-20 hidden h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_16px_currentColor] lg:block ${item.color}`}
                />
                <ResonanceSurface
                  className={`h-full rounded-[36px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md transition-[border-color,background-color,box-shadow] duration-500 hover:bg-white/[0.07] hover:shadow-[0_0_45px_rgba(14,108,178,0.12)] ${item.border}`}
                  glow={item.glow}
                >
                  <div className="absolute right-8 top-8 text-6xl font-bold text-white/5 transition-all duration-500 group-hover:text-white/10">
                    {item.number}
                  </div>

                  <div className={`mb-8 h-1 w-16 rounded-full ${item.color}`} />

                  <p className="text-xs tracking-[0.3em] text-gray-500">
                    {content.contactCardLabel}
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

            <StaggerItem className="pt-3" distance="subtle">
              <nav aria-label={content.socialChannelsLabel}>
                <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gray-500">
                  {content.socialChannelsLabel}
                </p>
                <ul className="flex flex-wrap gap-3">
                  {socialLinks.map((socialLink) => (
                    <li key={socialLink.key}>
                      <ResonanceLink
                        href={socialLink.href}
                        external
                        glow={socialLink.glow}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex min-h-11 items-center rounded-full border border-white/10 px-5 py-2 text-sm text-gray-300 transition-all duration-300 hover:-translate-y-0.5 ${socialLink.hover}`}
                      >
                        <span aria-hidden="true">
                          {socialLink.label} ↗
                        </span>
                        <span className="sr-only">
                          {socialLink.label}, {opensInNewTab}
                        </span>
                      </ResonanceLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </StaggerItem>
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
