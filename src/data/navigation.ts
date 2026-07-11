import type { ContentLanguage, Locale } from "@/i18n/config";
import { getLocalizedPath } from "@/i18n/config";

export const navigationRoutes = [
  { key: "tour", path: "/tour" },
  { key: "artists", path: "/artists" },
  { key: "productions", path: "/productions" },
  { key: "music", path: "/music" },
  { key: "video", path: "/video" },
  { key: "venues", path: "/venues" },
  { key: "store", path: "/store" },
  { key: "about", path: "/about" },
  { key: "contact", path: "/contact" },
] as const;

export type NavigationKey = (typeof navigationRoutes)[number]["key"];

const navigationLabels = {
  EN: {
    tour: "TOUR",
    artists: "ARTISTS",
    productions: "PRODUCTIONS",
    music: "MUSIC",
    video: "VIDEO",
    venues: "VENUES",
    store: "STORE",
    about: "ABOUT",
    contact: "CONTACT",
  },
  JP: {
    tour: "ツアー",
    artists: "アーティスト",
    productions: "プロダクション",
    music: "音楽",
    video: "ビデオ",
    venues: "会場",
    store: "ストア",
    about: "会社概要",
    contact: "お問い合わせ",
  },
  CN: {
    tour: "巡演",
    artists: "艺人",
    productions: "制作",
    music: "音乐",
    video: "视频",
    venues: "场地",
    store: "商店",
    about: "关于我们",
    contact: "联系我们",
  },
} as const satisfies Record<
  ContentLanguage,
  Record<NavigationKey, string>
>;

export function isNavigationKey(value: string): value is NavigationKey {
  return navigationRoutes.some(({ key }) => key === value);
}

export function getNavigationItems(
  language: ContentLanguage,
  locale: Locale
) {
  return navigationRoutes.map(({ key, path }) => ({
    key,
    path,
    href: getLocalizedPath(path, locale),
    label: navigationLabels[language][key],
  }));
}
