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
    detailLabel: string;
    backToList: string;
  };
};

export type ProductionDetailLabels = InterfaceContent["productionDetail"];

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
      detailLabel: "Product Details",
      backToList: "Back to list",
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
      detailLabel: "プロダクト詳細",
      backToList: "一覧へ戻る",
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
      detailLabel: "产品详情",
      backToList: "返回列表",
    },
  },
} as const satisfies Record<ContentLanguage, InterfaceContent>;
