"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SiteSearch from "@/components/SiteSearch";
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
  const pathname = usePathname();

  return (
    <Navigation
      key={pathname}
      language={language}
      locale={locale}
      pathname={pathname}
    />
  );
}

function Navigation({
  language,
  locale,
  pathname,
}: NavbarProps & { pathname: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const router = useRouter();
  const navigationRef = useRef<HTMLElement>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const languageButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  const languageOptions: ContentLanguage[] = ["EN", "JP", "CN"];
  const languageMenuId = "navbar-language-menu";
  const mobileMenuId = "navbar-mobile-menu";
  const labels = interfaceContent[language];
  const navigationItems = getNavigationItems(language, locale);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 80rem)");
    const closeOnBreakpointChange = () => {
      const focusedElement = document.activeElement;
      const focusWasInNavigation = navigationRef.current?.contains(focusedElement);
      setIsMenuOpen(false);
      setIsLanguageOpen(false);
      if (focusWasInNavigation) {
        (desktop.matches ? languageButtonRef : mobileMenuButtonRef).current?.focus();
      }
    };

    desktop.addEventListener("change", closeOnBreakpointChange);
    return () => desktop.removeEventListener("change", closeOnBreakpointChange);
  }, []);

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

    const closeOutside = (event: Event) => {
      const boundary = isLanguageOpen
        ? languageMenuRef.current
        : navigationRef.current;
      if (event.target instanceof Node && !boundary?.contains(event.target)) {
        setIsMenuOpen(false);
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("focusin", closeOutside);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("focusin", closeOutside);
    };
  }, [isLanguageOpen, isMenuOpen]);

  const selectLanguage = (newLanguage: ContentLanguage) => {
    const newLocale = localeByContentLanguage[newLanguage];

    setIsLanguageOpen(false);
    setIsMenuOpen(false);
    if (newLanguage === language) {
      const trigger = window.matchMedia("(min-width: 80rem)").matches
        ? languageButtonRef
        : mobileMenuButtonRef;
      trigger.current?.focus();
    } else {
      router.push(
        `${getLocalizedPath(pathname, newLocale)}${window.location.search}${window.location.hash}`,
      );
    }

    void fetch("/api/locale", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ locale: newLocale }),
    }).catch(() => undefined);
  };

  const isActiveRoute = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav
      ref={navigationRef}
      aria-label={labels.primaryNavigation}
      className="navbar-header"
    >
      <div className="navbar-frame">
        <Link
          href={`/${locale}`}
          className="resonance-logo navbar-brand group"
        >
          <Image
            src="/images/logo/logo-color.svg"
            alt=""
            width={48}
            height={48}
            className="relative z-10 h-10 w-auto transition-transform duration-500 group-hover:scale-105 sm:h-12"
          />

          <span className="navbar-wordmark">
            héReSonare
          </span>
        </Link>

        <div className="navbar-links">
          {navigationItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`resonance-link ${isActiveRoute(item.href) ? "text-[var(--brand-teal)]" : "text-gray-300"}`}
              aria-current={isActiveRoute(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}

          <div ref={languageMenuRef} className="relative">
            <button
              ref={languageButtonRef}
              type="button"
              className="resonance-control site-search-trigger gap-2 px-4"
              onClick={() => {
                setIsLanguageOpen(!isLanguageOpen);
                setIsMenuOpen(false);
              }}
              aria-expanded={isLanguageOpen}
              aria-controls={languageMenuId}
              aria-label={labels.languageSelector}
            >
              <span>{language}</span>
              <span
                aria-hidden="true"
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
                role="group"
                aria-label={labels.languageSelector}
                className="absolute right-0 mt-2 w-36 rounded-xl border border-white/10 bg-black/90 p-2 backdrop-blur-md animate-[dropdownFade_0.25s_ease-out]"
              >
                {languageOptions.map((lang) => (
                  <button
                    type="button"
                    key={lang}
                    onClick={() => selectLanguage(lang)}
                    aria-pressed={lang === language}
                    className="resonance-menu-item block min-h-11 w-full rounded-lg px-3 py-2 text-left hover:bg-white/10 aria-pressed:bg-white/10 aria-pressed:text-[var(--brand-teal)]"
                  >
                    {labels.languageNames[lang]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <SiteSearch language={language} locale={locale} onOpen={() => {
            setIsMenuOpen(false);
            setIsLanguageOpen(false);
          }} />
          <button
            ref={mobileMenuButtonRef}
            type="button"
            className="resonance-control site-search-trigger text-2xl xl:hidden"
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
            <span aria-hidden="true">{isMenuOpen ? "✕" : "☰"}</span>
          </button>
        </div>

        {isMenuOpen && (
          <div
            id={mobileMenuId}
            className="absolute left-0 top-20 max-h-[calc(100dvh-5rem)] w-full overflow-y-auto overscroll-contain border-b border-white/10 bg-black/95 shadow-2xl backdrop-blur-md xl:hidden animate-[mobileMenuFade_0.25s_ease-out]"
          >
            <div className="grid grid-cols-2 gap-2 px-4 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`flex min-h-12 items-center rounded-xl border px-4 py-3 text-base transition-colors ${isActiveRoute(item.href) ? "border-[var(--brand-teal)]/50 bg-[var(--brand-teal)]/10 text-[var(--brand-teal)]" : "border-white/10 bg-white/[0.03] text-gray-200 hover:bg-white/10"}`}
                  aria-current={isActiveRoute(item.href) ? "page" : undefined}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <div className="col-span-2 mt-4 border-t border-white/10 pt-4">
                <div className="mb-3 text-sm text-gray-400">
                  {labels.language}
                </div>

                <div role="group" aria-label={labels.languageSelector} className="flex flex-wrap gap-2">
                  {languageOptions.map((lang) => (
                    <button
                      type="button"
                      key={lang}
                      aria-pressed={lang === language}
                      className="resonance-control min-h-11 flex-1 rounded-xl border border-white/15 px-3 py-2 text-sm hover:bg-white/10 aria-pressed:border-[var(--brand-teal)]/50 aria-pressed:bg-[var(--brand-teal)]/10 aria-pressed:text-[var(--brand-teal)]"
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
