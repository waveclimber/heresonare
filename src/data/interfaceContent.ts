import type { ContentLanguage } from "@/i18n/config";

type InterfaceContent = {
  language: string;
  languageSelector: string;
  openNavigationMenu: string;
  closeNavigationMenu: string;
  languageNames: Record<ContentLanguage, string>;
  staticPage: {
    features: string;
    useCases: string;
    specifications: string;
    links: string;
    status: string;
    view: string;
  };
  productionDetail: {
    backToProductions: string;
    notFoundTitle: string;
    notFoundDescription: string;
  };
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
    staticPage: {
      features: "Features",
      useCases: "Use Cases",
      specifications: "Specifications",
      links: "Links",
      status: "Status",
      view: "View",
    },
    productionDetail: {
      backToProductions: "Back to Productions",
      notFoundTitle: "Production not found",
      notFoundDescription: "The requested production is not available.",
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
    staticPage: {
      features: "特徴",
      useCases: "活用例",
      specifications: "仕様",
      links: "リンク",
      status: "ステータス",
      view: "詳細を見る",
    },
    productionDetail: {
      backToProductions: "プロダクション一覧に戻る",
      notFoundTitle: "プロダクションが見つかりません",
      notFoundDescription: "お探しのプロダクションはご利用いただけません。",
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
    staticPage: {
      features: "特点",
      useCases: "应用场景",
      specifications: "规格",
      links: "链接",
      status: "状态",
      view: "查看详情",
    },
    productionDetail: {
      backToProductions: "返回制作列表",
      notFoundTitle: "未找到制作项目",
      notFoundDescription: "您请求的制作项目当前不可用。",
    },
  },
} as const satisfies Record<ContentLanguage, InterfaceContent>;
