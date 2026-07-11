"use client";

import type { ReactNode } from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { siteContent } from "@/data/siteContent";

export default function SiteShell({
  children,
}: {
  children: ReactNode;
}) {
  const { language, locale } = useLanguage();

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar
        language={language}
        locale={locale}
      />

      {children}

      <Footer content={siteContent} language={language} locale={locale} />
    </div>
  );
}
