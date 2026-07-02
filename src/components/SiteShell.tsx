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
  const { language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar
        content={siteContent}
        language={language}
        setLanguage={setLanguage}
      />

      {children}

      <Footer content={siteContent} language={language} />
    </div>
  );
}
