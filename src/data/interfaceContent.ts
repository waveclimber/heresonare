import type { ContentLanguage } from "@/i18n/config";

type InterfaceContent = {
  language: string;
  languageSelector: string;
  openNavigationMenu: string;
  closeNavigationMenu: string;
  languageNames: Record<ContentLanguage, string>;
};

export const interfaceContent = {
  EN: {
    language: "Language",
    languageSelector: "Choose language",
    openNavigationMenu: "Open navigation menu",
    closeNavigationMenu: "Close navigation menu",
    languageNames: {
      EN: "English",
      JP: "日本語",
      CN: "中文",
    },
  },
  JP: {
    language: "言語",
    languageSelector: "言語を選択",
    openNavigationMenu: "ナビゲーションメニューを開く",
    closeNavigationMenu: "ナビゲーションメニューを閉じる",
    languageNames: {
      EN: "英語",
      JP: "日本語",
      CN: "中国語",
    },
  },
  CN: {
    language: "语言",
    languageSelector: "选择语言",
    openNavigationMenu: "打开导航菜单",
    closeNavigationMenu: "关闭导航菜单",
    languageNames: {
      EN: "英语",
      JP: "日语",
      CN: "中文",
    },
  },
} as const satisfies Record<ContentLanguage, InterfaceContent>;
