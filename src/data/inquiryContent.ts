import type { ContentLanguage } from "@/i18n/config";
import type { InquiryDraftLabels, InquiryError } from "@/lib/inquiry.mjs";

export type InquiryLabels = InquiryDraftLabels & {
  title: string;
  description: string;
  privacy: string;
  fallback: string;
  topic: string;
  optional: string;
  required: string;
  anyConcept: string;
  messageHint: string;
  limitHint: string;
  prepare: string;
  previewTitle: string;
  previewEmpty: string;
  previewHint: string;
  openEmail: string;
  copy: string;
  copying: string;
  copied: string;
  copyFailed: string;
  longMessage: string;
  download: string;
  edit: string;
  reset: string;
  resetConfirm: string;
  errors: Record<InquiryError, string>;
};

export const inquiryContent = {
  EN: {
    title: "Start a conversation",
    description: "A collaboration, a live space, or an idea taking shape — tell us what you have in mind.",
    privacy: "Your draft stays on this page until you copy it, download it, or open your email app. Review and send the email there. Drafts are not saved automatically; download or copy anything you want to keep before leaving.",
    fallback: "You can also contact us directly by email.",
    topic: "What would you like to discuss?",
    topics: { general: "General inquiry", artists: "Artist collaboration", partners: "Brand partnership", venues: "Venues & live events", production: "Production concept" },
    name: "Name / organization",
    email: "Reply email",
    concept: "Concept",
    message: "Your message",
    optional: "optional",
    required: "required",
    anyConcept: "A new idea / no specific concept",
    messageHint: "Share your idea, timing, and any relevant links. Up to 3,000 characters.",
    limitHint: "Up to {limit} characters.",
    prepare: "Preview email",
    previewTitle: "Your email draft",
    previewEmpty: "Your preview will appear here. You can review everything before opening your email app.",
    previewHint: "This is a draft. It has not been sent. You can select and copy the text below.",
    subjectPrefix: "héReSonare inquiry",
    recipient: "To",
    subject: "Subject",
    openEmail: "Open email app",
    copy: "Copy full draft",
    copying: "Copying…",
    copied: "Draft copied",
    copyFailed: "Copying is unavailable. Select the draft below and copy it manually.",
    longMessage: "This draft is too long for some email apps to open reliably. Download it as a text file, or copy the full draft into a new email.",
    download: "Download draft (.txt)",
    edit: "Continue editing",
    reset: "Reset form",
    resetConfirm: "Reset this form and clear everything you entered?",
    errors: { required: "Please enter a message.", tooLong: "Please shorten this field to the indicated limit.", invalidEmail: "Enter a valid email address, or leave this optional field empty.", invalidChoice: "Please choose an available option." },
  },
  JP: {
    title: "対話をはじめましょう",
    description: "コラボレーション、ライブ空間、これから形にしたいアイデア。ご相談の内容をお聞かせください。",
    privacy: "入力内容は、コピー、ダウンロード、またはメールアプリを開くまでこのページ内に留まります。メールアプリで確認して送信してください。下書きは自動保存されません。ページを離れる前に、必要な内容をダウンロードするかコピーしてください。",
    fallback: "メールで直接お問い合わせいただくこともできます。",
    topic: "ご相談の種類",
    topics: { general: "その他のお問い合わせ", artists: "アーティストとのコラボレーション", partners: "ブランドとのパートナーシップ", venues: "会場・ライブイベント", production: "プロダクションのコンセプト" },
    name: "お名前・団体名",
    email: "返信先メールアドレス",
    concept: "コンセプト",
    message: "お問い合わせ内容",
    optional: "任意",
    required: "必須",
    anyConcept: "新しいアイデア・指定なし",
    messageHint: "アイデア、ご希望の時期、関連リンクなどをご記入ください。3,000文字以内。",
    limitHint: "{limit}文字以内。",
    prepare: "メールをプレビュー",
    previewTitle: "メールの下書き",
    previewEmpty: "ここにプレビューが表示されます。メールアプリを開く前に内容をご確認いただけます。",
    previewHint: "これは下書きです。まだ送信されていません。下のテキストを選択してコピーすることもできます。",
    subjectPrefix: "héReSonareへのお問い合わせ",
    recipient: "宛先",
    subject: "件名",
    openEmail: "メールアプリを開く",
    copy: "下書き全体をコピー",
    copying: "コピー中…",
    copied: "下書きをコピーしました",
    copyFailed: "自動コピーを利用できません。下の下書きを選択して手動でコピーしてください。",
    longMessage: "この下書きは一部のメールアプリで開くには長すぎます。テキストファイルとしてダウンロードするか、下書き全体をコピーして新しいメールに貼り付けてください。",
    download: "下書きをダウンロード（.txt）",
    edit: "編集を続ける",
    reset: "フォームをリセット",
    resetConfirm: "フォームをリセットして、入力した内容を消去しますか？",
    errors: { required: "お問い合わせ内容を入力してください。", tooLong: "表示されている文字数以内に短くしてください。", invalidEmail: "有効なメールアドレスを入力するか、空欄にしてください。", invalidChoice: "選択肢からお選びください。" },
  },
  CN: {
    title: "从一个想法开始",
    description: "一次创作合作、一处演出空间，或一个正在成形的想法，欢迎告诉我们你的需求。",
    privacy: "填写内容会留在当前页面，直到你复制、下载或打开邮箱。请在邮箱中确认并发送。草稿不会自动保存，离开前请下载或复制需要保留的内容。",
    fallback: "也可以直接通过邮箱联系我们。",
    topic: "你想讨论什么？",
    topics: { general: "一般咨询", artists: "艺人合作", partners: "品牌合作", venues: "场地与现场活动", production: "概念方案" },
    name: "姓名 / 机构",
    email: "回复邮箱",
    concept: "相关方案",
    message: "需求内容",
    optional: "选填",
    required: "必填",
    anyConcept: "新想法 / 暂不指定方案",
    messageHint: "可以介绍你的想法、计划时间和相关链接，最多 3,000 字。",
    limitHint: "最多 {limit} 字。",
    prepare: "预览邮件",
    previewTitle: "你的邮件草稿",
    previewEmpty: "预览将在这里显示，你可以先确认完整内容，再打开邮箱。",
    previewHint: "这是一份草稿，尚未发送。也可以选中下方文本手动复制。",
    subjectPrefix: "héReSonare 合作咨询",
    recipient: "收件人",
    subject: "主题",
    openEmail: "打开邮箱",
    copy: "复制完整草稿",
    copying: "正在复制…",
    copied: "草稿已复制",
    copyFailed: "无法自动复制，请选中下方草稿手动复制。",
    longMessage: "草稿较长，部分邮箱应用可能无法完整打开。可以下载为文本文件保存，或复制完整草稿后粘贴到新邮件中。",
    download: "下载草稿（.txt）",
    edit: "继续编辑",
    reset: "重置表单",
    resetConfirm: "重置表单并清空已填写的内容？",
    errors: { required: "请填写需求内容。", tooLong: "请将内容缩短至标注的字数上限。", invalidEmail: "请填写有效的邮箱地址，或留空此选填项。", invalidChoice: "请选择列表中的选项。" },
  },
} satisfies Record<ContentLanguage, InquiryLabels>;
