import Link from "next/link";
import {
  Reveal,
  StaggerGroup,
  StaggerItem,
} from "@/components/motion/MotionPrimitives";
import { ResonanceSurface } from "@/components/motion/ResonanceSurface";
import type { Language, SiteContent } from "@/data/siteContent";
import { getLocalizedPath, type Locale } from "@/i18n/config";

type ContentProps = {
  content: SiteContent;
  language: Language;
  locale: Locale;
};

export default function Products({ content, language, locale }: ContentProps) {
  const localizedContent = content[language];
  const featuredItems = [
    {
      title: localizedContent.featuredArtistsTitle,
      text: localizedContent.featuredArtistsText,
      href: getLocalizedPath("/artists", locale),
      number: "01",
      glow: "pink" as const,
    },
    {
      title: localizedContent.featuredMusicTitle,
      text: localizedContent.featuredMusicText,
      href: getLocalizedPath("/music", locale),
      number: "02",
      glow: "blue" as const,
    },
    {
      title: localizedContent.featuredProductionsTitle,
      text: localizedContent.featuredProductionsText,
      href: getLocalizedPath("/productions", locale),
      number: "03",
      glow: "teal" as const,
    },
  ];

  return (
    <section
      id="featured"
      className="relative mx-auto max-w-7xl px-6 py-32"
    >
      <Reveal className="mb-16" distance="subtle">
        <p className="text-xs tracking-[0.35em] text-[var(--brand-blue)]">
          {localizedContent.featuredLabel}
        </p>

        <h2 className="mt-5 text-5xl font-bold">
          {localizedContent.featuredTitle}
        </h2>

        <div className="mt-6 h-px w-32 bg-white/10" />
      </Reveal>

      <StaggerGroup className="grid gap-8 lg:grid-cols-3">
        {featuredItems.map((item) => (
          <StaggerItem key={item.title} className="h-full">
            <ResonanceSurface
              className="h-full rounded-[36px] border border-white/10 bg-white/[0.03] backdrop-blur-md transition-[border-color,background-color,box-shadow] duration-500 hover:border-[var(--brand-blue)] hover:bg-white/[0.055] hover:shadow-[0_0_50px_rgba(14,108,178,0.18)]"
              glow={item.glow}
              interactive
            >
              <Link
                href={item.href}
                className="relative block h-full rounded-[36px] p-10 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[var(--brand-yellow)]"
              >
                <div className="absolute right-8 top-8 text-6xl font-bold text-white/5 transition-all duration-500 group-hover:-translate-y-1 group-hover:text-white/12">
                  {item.number}
                </div>

                <p className="text-xs tracking-[0.35em] text-gray-500">
                  {localizedContent.featuredCategoryLabel}
                </p>

                <h3 className="mt-8 text-3xl font-bold">
                  {item.title}
                </h3>

                <p className="mt-6 leading-8 text-gray-400">
                  {item.text}
                </p>

                <div className="mt-12 flex items-center gap-3 text-sm tracking-[0.25em] text-[var(--brand-blue)]">
                  {localizedContent.featuredDiscoverLabel}
                  <span className="transition-all duration-500 group-hover:translate-x-2">
                    →
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 h-1 w-0 bg-[var(--brand-blue)] transition-all duration-500 group-hover:w-full" />
              </Link>
            </ResonanceSurface>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
