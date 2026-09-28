import type { ContentLanguage } from "@/i18n/config";

type InterfaceContent = {
  language: string;
  languageSelector: string;
  openNavigationMenu: string;
  closeNavigationMenu: string;
  primaryNavigation: string;
  skipToContent: string;
  visitorQuestions: string;
  languageNames: Record<ContentLanguage, string>;
  email: {
    copy: string;
    copied: string;
    failed: string;
    address: string;
  };
  notFound: {
    label: string;
    title: string;
    description: string;
    backHome: string;
  };
  runtimeError: {
    label: string;
    title: string;
    description: string;
    retry: string;
    backHome: string;
  };
  staticPage: {
    features: string;
    useCases: string;
    specifications: string;
    links: string;
    status: string;
    view: string;
    opensInNewTab: string;
  };
  productionDetail: {
    detailLabel: string;
    backToList: string;
    onThisPage: string;
    inquiryTitle: string;
    inquiryDescription: string;
    inquiryAction: string;
    inquirySubject: string;
    prepareInquiry: string;
  };
};

export type ProductionDetailLabels = InterfaceContent["productionDetail"];
export type RuntimeErrorContent = InterfaceContent["runtimeError"];

export const interfaceContent = {
  EN: {
    email: {
      copy: "Copy email",
      copied: "Email copied",
      failed: "Automatic copying is unavailable. Select the address below to copy it manually.",
      address: "Email address",
    },
    language: "Language",
    languageSelector: "Choose language",
    openNavigationMenu: "Open navigation menu",
    closeNavigationMenu: "Close navigation menu",
    primaryNavigation: "Main navigation",
    skipToContent: "Skip to main content",
    visitorQuestions: "Visitor questions",
    languageNames: {
      EN: "English",
      JP: "日本語",
      CN: "中文",
    },
    notFound: {
      label: "404 / Signal Lost",
      title: "This page is out of range.",
      description:
        "The address may have changed, or the page may not exist yet.",
      backHome: "Return home",
    },
    runtimeError: {
      label: "Signal Interrupted",
      title: "The connection lost resonance.",
      description:
        "A temporary problem interrupted this page. Try again, or return home.",
      retry: "Try again",
      backHome: "Return home",
    },
    staticPage: {
      features: "Features",
      useCases: "Use Cases",
      specifications: "Specifications",
      links: "Links",
      status: "Status",
      view: "View",
      opensInNewTab: "opens in a new tab",
    },
    productionDetail: {
      detailLabel: "Product Details",
      backToList: "Back to list",
      onThisPage: "On this page",
      inquiryTitle: "Discuss this concept",
      inquiryDescription: "Tell us about your project and how you would like to collaborate.",
      inquiryAction: "Email about this concept",
      inquirySubject: "Concept inquiry",
      prepareInquiry: "Prepare an inquiry",
    },
  },
  JP: {
    email: {
      copy: "メールアドレスをコピー",
      copied: "コピーしました",
      failed: "自動コピーを利用できません。下のアドレスを選択してコピーしてください。",
      address: "メールアドレス",
    },
    language: "言語",
    languageSelector: "言語を選択",
    openNavigationMenu: "ナビゲーションメニューを開く",
    closeNavigationMenu: "ナビゲーションメニューを閉じる",
    primaryNavigation: "メインナビゲーション",
    skipToContent: "メインコンテンツへ移動",
    visitorQuestions: "よくあるご質問",
    languageNames: {
      EN: "英語",
      JP: "日本語",
      CN: "中国語",
    },
    notFound: {
      label: "404 / シグナルロスト",
      title: "このページは受信範囲外です。",
      description:
        "アドレスが変更されたか、ページがまだ存在しない可能性があります。",
      backHome: "ホームへ戻る",
    },
    runtimeError: {
      label: "シグナルが中断されました",
      title: "接続の共鳴が途切れました。",
      description:
        "一時的な問題により、このページを表示できません。もう一度お試しいただくか、ホームへ戻ってください。",
      retry: "もう一度試す",
      backHome: "ホームへ戻る",
    },
    staticPage: {
      features: "特徴",
      useCases: "活用例",
      specifications: "仕様",
      links: "リンク",
      status: "ステータス",
      view: "詳細を見る",
      opensInNewTab: "新しいタブで開きます",
    },
    productionDetail: {
      detailLabel: "プロダクト詳細",
      backToList: "一覧へ戻る",
      onThisPage: "ページ内の項目",
      inquiryTitle: "このコンセプトについて相談する",
      inquiryDescription: "プロジェクトの内容や、ご希望のコラボレーションについてお聞かせください。",
      inquiryAction: "メールで相談する",
      inquirySubject: "コンセプトに関するお問い合わせ",
      prepareInquiry: "お問い合わせを作成",
    },
  },
  CN: {
    email: {
      copy: "复制邮箱",
      copied: "邮箱已复制",
      failed: "无法自动复制，请选中下方邮箱地址手动复制。",
      address: "邮箱地址",
    },
    language: "语言",
    languageSelector: "选择语言",
    openNavigationMenu: "打开导航菜单",
    closeNavigationMenu: "关闭导航菜单",
    primaryNavigation: "主要导航",
    skipToContent: "跳到主要内容",
    visitorQuestions: "常见问题",
    languageNames: {
      EN: "英语",
      JP: "日语",
      CN: "中文",
    },
    notFound: {
      label: "404 / 信号丢失",
      title: "这个页面不在接收范围内。",
      description: "地址可能已更改，或者这个页面尚未存在。",
      backHome: "返回首页",
    },
    runtimeError: {
      label: "信号暂时中断",
      title: "连接暂时失去共鸣。",
      description: "临时问题中断了此页面。请重试，或返回首页。",
      retry: "重试",
      backHome: "返回首页",
    },
    staticPage: {
      features: "特点",
      useCases: "应用场景",
      specifications: "规格",
      links: "链接",
      status: "状态",
      view: "查看详情",
      opensInNewTab: "在新标签页中打开",
    },
    productionDetail: {
      detailLabel: "产品详情",
      backToList: "返回列表",
      onThisPage: "本页内容",
      inquiryTitle: "探讨这个概念方案",
      inquiryDescription: "欢迎介绍你的项目，以及希望开展的合作。",
      inquiryAction: "邮件咨询此方案",
      inquirySubject: "概念方案咨询",
      prepareInquiry: "填写咨询需求",
    },
  },
} as const satisfies Record<ContentLanguage, InterfaceContent>;
