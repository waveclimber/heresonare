import type { PageKey } from "@/data/pageContent";
import type { ContentLanguage } from "@/i18n/config";
import type { InquiryTopic } from "@/lib/inquiry.mjs";

export const pageInquiryTopics = {
  artists: "artists", music: "artists", video: "production", productions: "production",
  tour: "venues", venues: "venues", store: "general", about: "partners",
} as const satisfies Record<Exclude<PageKey, "contact">, InquiryTopic>;

type VisitorLabels = {
  onThisPage: string;
  inquiry: string;
  help: string;
  nextStep: string;
  contactAction: string;
  nextSteps: Record<Exclude<PageKey, "contact">, string>;
  questions: { id: string; question: string; answer: string }[];
};

export type PageJourneyLabels = Pick<VisitorLabels, "onThisPage" | "inquiry" | "help" | "nextStep" | "contactAction"> & {
  description: string;
  topic: InquiryTopic;
  catalog: string;
  connect?: string;
  bag?: string;
};

export const visitorContent = {
  EN: {
    onThisPage: "On this page", inquiry: "Prepare an inquiry", help: "Visitor questions",
    nextStep: "Continue the conversation", contactAction: "Prepare an inquiry",
    nextSteps: {
      artists: "Introduce your creative practice and the collaboration you have in mind.",
      music: "Tell us about your music, production needs, or a possible collaboration.",
      video: "Share your story, format, and the production you would like to explore.",
      productions: "Choose a concept in the inquiry form, or tell us about a new idea.",
      tour: "For live collaborations, share your location, possible dates, and event idea. Confirmed tour information will appear here when available.",
      venues: "Introduce your space, city, and the live experience you would like to host.",
      store: "Ask about merchandise ideas or the store. Products and checkout are not available yet.",
      about: "Tell us how your brand or organization would like to work with héReSonare.",
    },
    questions: [
      { id: "sending", question: "Does the inquiry form send my message?", answer: "Previewing creates an email draft only. Open your email app, review the recipient and message, then send it there. Downloading or copying a draft does not send it." },
      { id: "preparing", question: "What should I include in an inquiry?", answer: "Choose a topic and describe your idea, timing, and relevant links. Your name and reply email are optional in the draft; include a way for us to reach you in the email you send. Please share links to work instead of pasting private documents." },
      { id: "email", question: "What if I use webmail or have a long message?", answer: "Copy the full draft into a new email, or download the text file and use its contents in your webmail. Send it to contact@heresonare.com. The full message remains available even when the email-app link is unavailable." },
      { id: "availability", question: "Can I book a show or buy merchandise here?", answer: "The current tour, venue, and store pages present plans and concepts. No ticket booking or checkout is available. Confirmed dates, locations, products, and official purchase links will be published when ready." },
      { id: "drafts", question: "Will my draft be saved when I leave?", answer: "Drafts stay in the current page and are not saved automatically. Download or copy your draft before leaving or changing language. Reset form clears the current draft after confirmation when content has been entered." },
    ],
  },
  JP: {
    onThisPage: "このページの内容", inquiry: "お問い合わせを作成", help: "よくあるご質問",
    nextStep: "次の対話へ", contactAction: "お問い合わせを作成",
    nextSteps: {
      artists: "ご自身の創作活動と、ご希望のコラボレーションについてお聞かせください。",
      music: "音楽作品、制作のご相談、コラボレーションのアイデアをお聞かせください。",
      video: "伝えたい物語、映像の形式、ご検討中の制作についてお聞かせください。",
      productions: "お問い合わせフォームでコンセプトを選ぶか、新しいアイデアをご紹介ください。",
      tour: "ライブのご相談は、開催地、候補日、企画の内容をお知らせください。確定したツアー情報は準備が整い次第掲載します。",
      venues: "会場、都市、実現したいライブ体験についてお聞かせください。",
      store: "グッズのアイデアやストアについてお問い合わせいただけます。商品の販売・決済はまだご利用いただけません。",
      about: "ブランドや団体として、héReSonareとの協業のアイデアをお聞かせください。",
    },
    questions: [
      { id: "sending", question: "フォームからメッセージは送信されますか？", answer: "プレビューではメールの下書きを作成するだけです。メールアプリを開き、宛先と内容を確認してから送信してください。ダウンロードやコピーだけでは送信されません。" },
      { id: "preparing", question: "お問い合わせには何を書けばよいですか？", answer: "種類を選び、アイデア、ご希望の時期、関連リンクをご記入ください。下書きのお名前と返信先は任意ですが、送信するメールには連絡方法を含めてください。非公開の資料を貼り付ける代わりに、作品へのリンクをご案内ください。" },
      { id: "email", question: "ウェブメールを使う場合や、文章が長い場合は？", answer: "下書き全体を新しいメールにコピーするか、テキストファイルをダウンロードして内容をご利用ください。宛先はcontact@heresonare.comです。メールアプリへのリンクが表示されない場合も、全文を保存できます。" },
      { id: "availability", question: "公演の予約やグッズの購入はできますか？", answer: "現在のツアー、会場、ストアのページは企画やコンセプトの紹介です。チケット予約・決済機能は提供していません。日程、会場、商品、公式購入リンクは準備が整い次第公開します。" },
      { id: "drafts", question: "ページを離れても下書きは保存されますか？", answer: "下書きは現在のページ内に留まり、自動保存されません。ページを離れる前や言語を切り替える前に、ダウンロードまたはコピーしてください。入力内容がある場合、フォームのリセットは確認後に下書きを消去します。" },
    ],
  },
  CN: {
    onThisPage: "本页导航", inquiry: "填写咨询需求", help: "常见问题",
    nextStep: "让想法继续向前", contactAction: "填写咨询需求",
    nextSteps: {
      artists: "介绍你的创作方向，以及希望开展的合作。",
      music: "欢迎介绍你的音乐作品、制作需求或合作想法。",
      video: "告诉我们你想表达的故事、影像形式和制作需求。",
      productions: "可以在咨询表单中选择相关概念方案，也欢迎提出新的想法。",
      tour: "如需探讨现场合作，请介绍城市、计划时间和活动想法。确定的巡演信息将在准备就绪后公布。",
      venues: "介绍你的场地、所在城市，以及希望共同打造的现场体验。",
      store: "可以咨询周边创意和商店筹备情况，目前尚未开放商品购买与结算。",
      about: "欢迎介绍你的品牌或机构，以及与 héReSonare 合作的想法。",
    },
    questions: [
      { id: "sending", question: "填写咨询表单后，消息就发送了吗？", answer: "预览只会生成邮件草稿。请打开邮箱，核对收件人和内容，再在邮箱中发送。下载或复制草稿都不会发送邮件。" },
      { id: "preparing", question: "咨询时需要提供哪些信息？", answer: "选择咨询类型，介绍你的想法、计划时间和相关链接。姓名与回复邮箱在草稿中为选填项，请在最终发送的邮件中留下联系方式。作品可以提供链接，无需粘贴私人文件。" },
      { id: "email", question: "使用网页邮箱，或者内容很长怎么办？", answer: "可以将完整草稿复制到新邮件，或下载文本文件后使用其中的内容，发送至 contact@heresonare.com。即使没有显示打开邮箱的按钮，草稿全文仍可保存。" },
      { id: "availability", question: "现在可以预订演出或购买周边吗？", answer: "目前巡演、场地和商店栏目展示的是计划与概念，尚未开放购票与结算。确定的时间、场地、商品和官方购买链接将在准备就绪后公布。" },
      { id: "drafts", question: "离开页面后，草稿会自动保存吗？", answer: "草稿只保留在当前页面，不会自动保存。离开或切换语言前，请先下载或复制。重置表单会清除当前草稿；已有填写内容时，会先请你确认。" },
    ],
  },
} satisfies Record<ContentLanguage, VisitorLabels>;
