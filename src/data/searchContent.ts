import type { ContentLanguage } from "@/i18n/config";

type SearchLabels = {
  open: string;
  title: string;
  close: string;
  placeholder: string;
  hint: string;
  loading: string;
  failed: string;
  retry: string;
  empty: string;
  emptyHint: string;
  clear: string;
  suggestions: string;
  resultCount: string;
  home: string;
};

export const searchContent = {
  EN: {
    open: "Search site",
    title: "Find your next resonance",
    close: "Close search",
    placeholder: "Search pages, music, or concepts",
    hint: "Search this language. Use Tab to reach results and Enter to open a page. Escape closes search.",
    loading: "Loading searchable content…",
    failed: "Search could not load. Please try again.",
    retry: "Retry search",
    empty: "No matching pages",
    emptyHint: "Try a shorter phrase, or explore the suggested pages by clearing your search.",
    clear: "Clear search",
    suggestions: "Explore pages",
    resultCount: "{count} matching pages",
    home: "Home",
  },
  JP: {
    open: "サイト内検索",
    title: "次の共鳴を見つける",
    close: "検索を閉じる",
    placeholder: "ページ、音楽、コンセプトを検索",
    hint: "現在の言語で検索します。Tabで結果へ移動し、Enterでページを開きます。Escapeで検索を閉じます。",
    loading: "検索用コンテンツを読み込み中…",
    failed: "検索を読み込めませんでした。もう一度お試しください。",
    retry: "再読み込み",
    empty: "一致するページがありません",
    emptyHint: "短い言葉で検索するか、検索をクリアしておすすめのページをご覧ください。",
    clear: "検索をクリア",
    suggestions: "ページを探す",
    resultCount: "{count} 件のページ",
    home: "ホーム",
  },
  CN: {
    open: "站内搜索",
    title: "找到下一次共鸣",
    close: "关闭搜索",
    placeholder: "搜索页面、音乐或概念方案",
    hint: "搜索当前语言的内容。按 Tab 移至结果，Enter 打开页面，Escape 关闭搜索。",
    loading: "正在加载可搜索内容…",
    failed: "搜索暂时无法加载，请重试。",
    retry: "重新加载",
    empty: "没有找到相关页面",
    emptyHint: "可以尝试更短的关键词，或清空搜索后浏览推荐页面。",
    clear: "清空搜索",
    suggestions: "探索页面",
    resultCount: "找到 {count} 个页面",
    home: "首页",
  },
} satisfies Record<ContentLanguage, SearchLabels>;
