"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Language, SiteContent } from "@/data/siteContent";

type NavbarProps = {
  content: SiteContent;
  language: Language;
  setLanguage: (language: Language) => void;
};

export default function Navbar({ language, setLanguage }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const navItems = [
    { label: "TOUR", href: "/tour" },
    { label: "ARTISTS", href: "/artists" },
    { label: "PRODUCTIONS", href: "/productions" },
    { label: "MUSIC", href: "/music" },
    { label: "VIDEO", href: "/video" },
    { label: "VENUES", href: "/venues" },
    { label: "STORE", href: "/store" },
    { label: "ABOUT", href: "/about" },
    { label: "CONTACT", href: "/contact" },
  ];

  const navLinkClassName =
    "text-gray-300 transition-all duration-300 hover:text-[var(--brand-blue)]";
  const languageOptions: Language[] = ["EN", "JP", "CN"];

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-6 lg:px-12">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo/logo-color.svg"
            alt="héReSonare"
            width={48}
            height={48}
            className="h-12 w-auto"
          />

          <span className="bg-gradient-to-r from-[var(--brand-pink)] via-white to-[var(--brand-blue)] bg-clip-text text-2xl font-semibold tracking-[0.05em] text-transparent">
            héReSonare
          </span>
        </Link>

        <div className="hidden items-center gap-6 text-sm text-gray-300 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={navLinkClassName}>
              {item.label}
            </Link>
          ))}

          <div className="relative">
            <button
              className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 transition-all duration-300 hover:border-[var(--brand-blue)] hover:text-white"
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
            >
              <span>{language}</span>
              <span
                className={`transition-transform duration-300 ${
                  isLanguageOpen ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {isLanguageOpen && (
              <div className="absolute right-0 mt-2 w-36 rounded-xl border border-white/10 bg-black/90 p-2 backdrop-blur-md animate-[dropdownFade_0.25s_ease-out]">
                {languageOptions.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setIsLanguageOpen(false);
                    }}
                    className="block w-full rounded-lg px-3 py-2 text-left hover:bg-white/10"
                  >
                    {lang === "EN" ? "English" : lang === "JP" ? "日本語" : "中文"}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          className="text-2xl lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>

        {isMenuOpen && (
          <div className="absolute left-0 top-20 w-full border-b border-white/10 bg-black/95 backdrop-blur-md lg:hidden animate-[mobileMenuFade_0.25s_ease-out]">
            <div className="flex flex-col gap-4 p-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <div className="border-t border-white/10 pt-4">
                <div className="mb-3 text-sm text-gray-500">Language</div>

                <div className="flex flex-col gap-3">
                  {languageOptions.map((lang) => (
                    <button
                      key={lang}
                      className="text-left"
                      onClick={() => {
                        setLanguage(lang);
                        setIsMenuOpen(false);
                      }}
                    >
                      {lang === "EN" ? "English" : lang === "JP" ? "日本語" : "中文"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
