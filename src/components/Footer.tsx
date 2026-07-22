import Link from "next/link";
import {
  ConvergeTarget,
  FooterConvergePath,
} from "@/components/motion/ConvergePaths";
import {
  StaggerGroup,
  StaggerItem,
} from "@/components/motion/MotionPrimitives";
import type { SiteShellContent } from "@/content/contracts";
import { getNavigationItems } from "@/data/navigation";
import type { ContentLanguage, Locale } from "@/i18n/config";

type ContentProps = {
  content: SiteShellContent;
  language: ContentLanguage;
  locale: Locale;
};

export default function Footer({ content, language, locale }: ContentProps) {
  const navigationItems = getNavigationItems(language, locale);

  return (
    <footer className="relative overflow-hidden border-t border-white/10 px-6 py-20">
      <div className="absolute left-1/2 top-0 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-[var(--brand-blue)] opacity-10 blur-3xl" />
      <FooterConvergePath className="pointer-events-none absolute inset-0 z-0" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <StaggerGroup
          className="flex flex-col items-center text-center"
          stagger="compact"
        >
          <StaggerItem className="flex flex-col items-center" distance="subtle">
            <ConvergeTarget color="mixed">
              <h2 className="bg-gradient-to-r from-[var(--brand-pink)] via-white to-[var(--brand-blue)] bg-clip-text text-4xl font-bold text-transparent">
                héReSonare
              </h2>
            </ConvergeTarget>

            <p className="mt-4 text-sm tracking-[0.3em] text-gray-500">
              {content.footerSlogan}
            </p>
          </StaggerItem>

          <StaggerItem distance="subtle" duration="fast">
            <div className="mt-12 h-px w-32 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </StaggerItem>

          <StaggerItem
            as="nav"
            className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-5"
            distance="subtle"
          >
            {navigationItems.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="resonance-link text-sm tracking-[0.15em] text-gray-400 transition-all duration-300 hover:text-[var(--brand-blue)]"
              >
                {link.label}
              </Link>
            ))}
          </StaggerItem>

          <StaggerItem distance="subtle">
            <a
              href="mailto:contact@heresonare.com"
              className="resonance-link mt-14 inline-block text-gray-400 transition-all duration-300 hover:text-[var(--brand-blue)]"
            >
              contact@heresonare.com
            </a>
          </StaggerItem>

          <StaggerItem distance="subtle" duration="fast">
            <p className="mt-10 text-sm text-gray-600">
              {content.footerCopyright}
            </p>
          </StaggerItem>
        </StaggerGroup>
      </div>
    </footer>
  );
}
