"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { interfaceContent } from "@/data/interfaceContent";
import { getNavigationItems } from "@/data/navigation";
import {
  getLocalizedPath,
  localeByContentLanguage,
  type ContentLanguage,
  type Locale,
} from "@/i18n/config";

type NavbarProps = {
  language: ContentLanguage;
  locale: Locale;
};

export default function Navbar({ language, locale }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const languageButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  const navLinkBaseClassName =
    "transition-all duration-300 hover:text-[var(--brand-blue)]";
  const languageOptions: ContentLanguage[] = ["EN", "JP", "CN"];
  const languageMenuId = "navbar-language-menu";
  const mobileMenuId = "navbar-mobile-menu";
  const labels = interfaceContent[language];
  const navigationItems = getNavigationItems(language, locale);

  useEffect(() => {
    if (!isMenuOpen && !isLanguageOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        const trigger = isLanguageOpen
          ? languageButtonRef.current
          : mobileMenuButtonRef.current;

        setIsMenuOpen(false);
        setIsLanguageOpen(false);
        trigger?.focus();
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isLanguageOpen, isMenuOpen]);

  const selectLanguage = (newLanguage: ContentLanguage) => {
    const newLocale = localeByContentLanguage[newLanguage];

    setIsLanguageOpen(false);
    setIsMenuOpen(false);
    router.push(getLocalizedPath(pathname, newLocale));

    void fetch("/api/locale", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ locale: newLocale }),
    }).catch(() => undefined);
  };

  const isActiveRoute = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const getNavLinkClassName = (href: string) =>
    `resonance-link ${navLinkBaseClassName} ${
      isActiveRoute(href)
        ? "text-[var(--brand-blue)]"
        : "text-gray-300"
    }`;

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-6 lg:px-12">
        <Link
          href={`/${locale}`}
          className="resonance-logo group relative flex shrink-0 items-center gap-3 rounded-full"
        >
          <Image
            src="/images/logo/logo-color.svg"
            alt=""
            width={48}
            height={48}
            className="relative z-10 h-12 w-auto transition-transform duration-500 group-hover:scale-105"
          />

          <span className="relative z-10 bg-gradient-to-r from-[var(--brand-pink)] via-white to-[var(--brand-blue)] bg-clip-text text-2xl font-semibold tracking-[0.05em] text-transparent">
            héReSonare
          </span>
        </Link>

        <div className="hidden items-center gap-4 whitespace-nowrap text-xs text-gray-300 xl:flex 2xl:gap-6 2xl:text-sm">
          {navigationItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={getNavLinkClassName(item.href)}
              aria-current={isActiveRoute(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}

          <div className="relative">
            <button
              ref={languageButtonRef}
              type="button"
              className="resonance-control flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 transition-all duration-300 hover:border-[var(--brand-blue)] hover:text-white"
              onClick={() => {
                setIsLanguageOpen(!isLanguageOpen);
                setIsMenuOpen(false);
              }}
              aria-expanded={isLanguageOpen}
              aria-controls={languageMenuId}
              aria-haspopup="true"
              aria-label={labels.languageSelector}
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
              <div
                id={languageMenuId}
                className="absolute right-0 mt-2 w-36 rounded-xl border border-white/10 bg-black/90 p-2 backdrop-blur-md animate-[dropdownFade_0.25s_ease-out]"
              >
                {languageOptions.map((lang) => (
                  <button
                    type="button"
                    key={lang}
                    onClick={() => selectLanguage(lang)}
                    aria-pressed={lang === language}
                    className="resonance-menu-item block w-full rounded-lg px-3 py-2 text-left hover:bg-white/10"
                  >
                    {labels.languageNames[lang]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          ref={mobileMenuButtonRef}
          type="button"
          className="resonance-control rounded-full p-2 text-2xl xl:hidden"
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
            setIsLanguageOpen(false);
          }}
          aria-label={
            isMenuOpen
              ? labels.closeNavigationMenu
              : labels.openNavigationMenu
          }
          aria-expanded={isMenuOpen}
          aria-controls={mobileMenuId}
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>

        {isMenuOpen && (
          <div
            id={mobileMenuId}
            className="absolute left-0 top-20 w-full border-b border-white/10 bg-black/95 backdrop-blur-md xl:hidden animate-[mobileMenuFade_0.25s_ease-out]"
          >
            <div className="flex flex-col gap-4 p-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={getNavLinkClassName(item.href)}
                  aria-current={isActiveRoute(item.href) ? "page" : undefined}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <div className="border-t border-white/10 pt-4">
                <div className="mb-3 text-sm text-gray-500">
                  {labels.language}
                </div>

                <div className="flex flex-col gap-3">
                  {languageOptions.map((lang) => (
                    <button
                      type="button"
                      key={lang}
                      aria-pressed={lang === language}
                      className="resonance-link w-fit text-left"
                      onClick={() => selectLanguage(lang)}
                    >
                      {labels.languageNames[lang]}
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
