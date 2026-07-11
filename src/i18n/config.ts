export const supportedLocales = ["en", "ja", "zh-cn"] as const;

export type Locale = (typeof supportedLocales)[number];
export type ContentLanguage = "EN" | "JP" | "CN";

export const defaultLocale: Locale = "en";
export const localeCookieName = "heresonare-locale";

export const htmlLangByLocale = {
  en: "en",
  ja: "ja",
  "zh-cn": "zh-CN",
} as const satisfies Record<Locale, string>;

export const contentLanguageByLocale = {
  en: "EN",
  ja: "JP",
  "zh-cn": "CN",
} as const satisfies Record<Locale, ContentLanguage>;

export const localeByContentLanguage = {
  EN: "en",
  JP: "ja",
  CN: "zh-cn",
} as const satisfies Record<ContentLanguage, Locale>;

export const openGraphLocaleByLocale = {
  en: "en_US",
  ja: "ja_JP",
  "zh-cn": "zh_CN",
} as const satisfies Record<Locale, string>;

export function isLocale(value: string): value is Locale {
  return supportedLocales.some((locale) => locale === value);
}

export function getLocaleFromAcceptLanguage(
  acceptLanguage: string | null
): Locale {
  if (!acceptLanguage) {
    return defaultLocale;
  }

  const preferredLanguage = acceptLanguage
    .split(",")
    .map((entry, index) => {
      const [language, ...parameters] = entry.trim().toLowerCase().split(";");
      const qualityParameter = parameters.find((parameter) =>
        parameter.trim().startsWith("q=")
      );
      const quality = qualityParameter
        ? Number.parseFloat(qualityParameter.trim().slice(2))
        : 1;

      return {
        language,
        quality: Number.isNaN(quality) ? 0 : quality,
        index,
      };
    })
    .filter(({ language, quality }) => language && quality > 0)
    .sort((a, b) => b.quality - a.quality || a.index - b.index)[0]?.language;

  if (preferredLanguage === "ja" || preferredLanguage?.startsWith("ja-")) {
    return "ja";
  }

  if (preferredLanguage === "zh" || preferredLanguage?.startsWith("zh-")) {
    return "zh-cn";
  }

  return defaultLocale;
}

export function getPathWithoutLocale(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] && isLocale(segments[0])) {
    segments.shift();
  }

  return segments.length === 0 ? "/" : `/${segments.join("/")}`;
}

export function getLocalizedPath(pathname: string, locale: Locale): string {
  const pathWithoutLocale = getPathWithoutLocale(pathname);
  return pathWithoutLocale === "/"
    ? `/${locale}`
    : `/${locale}${pathWithoutLocale}`;
}

export function getLocalizedHref(href: string, locale: Locale): string {
  if (
    !href.startsWith("/") ||
    href.startsWith("//") ||
    href.startsWith("/_next") ||
    href.startsWith("/api")
  ) {
    return href;
  }

  const suffixIndex = href.search(/[?#]/u);
  const pathname = suffixIndex === -1 ? href : href.slice(0, suffixIndex);
  const suffix = suffixIndex === -1 ? "" : href.slice(suffixIndex);
  return `${getLocalizedPath(pathname, locale)}${suffix}`;
}

export function getLanguageAlternates(pathname: string) {
  return Object.fromEntries(
    supportedLocales.map((locale) => [
      htmlLangByLocale[locale],
      getLocalizedPath(pathname, locale),
    ])
  );
}
