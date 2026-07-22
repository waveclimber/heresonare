"use client";

import type { ReactNode } from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MotionProvider } from "@/components/motion/MotionProvider";
import type { SiteShellContent } from "@/content/contracts";
import { useLanguage } from "@/context/LanguageContext";
import { interfaceContent } from "@/data/interfaceContent";

export default function SiteShell({
  children,
  content,
}: {
  children: ReactNode;
  content: SiteShellContent;
}) {
  const { language, locale } = useLanguage();
  const labels = interfaceContent[language];

  return (
    <MotionProvider>
      <div className="min-h-screen bg-black text-white">
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-[var(--brand-yellow)] px-5 py-3 font-semibold text-black shadow-lg transition-transform focus:translate-y-0"
        >
          {labels.skipToContent}
        </a>
        <Navbar
          language={language}
          locale={locale}
        />

        {children}

        <Footer content={content} language={language} locale={locale} />
      </div>
    </MotionProvider>
  );
}
