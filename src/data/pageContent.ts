import type { Language } from "@/data/siteContent";
import { getProductionDetailPath } from "@/data/productionRoutes";
import { officialSocialLinks } from "@/data/socialLinks";

export type PageKey =
  | "artists"
  | "music"
  | "productions"
  | "tour"
  | "venues"
  | "video"
  | "store"
  | "about"
  | "contact";

export type PageHeroContent = {
  tag: string;
  title: string;
  description: string;
};

export type PageLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type PageContentItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  subtitle?: string;
  role?: string;
  type?: string;
  category?: string;
  status?: string;
  /** Stable primary destination. Omit until a distinct route exists. */
  href?: string;
  image?: string;
  media?: {
    card?: string;
    hero?: string;
    render?: string;
    icon?: string;
  };
  meta?: string;
  year?: string;
  date?: string;
  location?: string;
  features?: string[];
  useCases?: string[];
  specs?: {
    label: string;
    value: string;
  }[];
  /** Explicit supplementary or external actions. */
  links?: PageLink[];
};

export type ComingSoonContent = {
  label: string;
  title: string;
  description: string;
  cta?: PageLink;
};

export type PageSectionContent = {
  id: string;
  label: string;
  title: string;
  description?: string;
  items?: PageContentItem[];
  comingSoon?: ComingSoonContent;
};

export type StaticPageContent = {
  slug: PageKey;
  hero: PageHeroContent;
  sections: PageSectionContent[];
};

export type PageContentByLanguage = Record<
  Language,
  Record<PageKey, StaticPageContent>
>;

const englishPages = {
  artists: {
    slug: "artists",
    hero: {
      tag: "héReSonare Artists",
      title: "Voices That Resonate",
      description:
        "Explore our creative direction in vocals, production, and collaboration. Artist announcements are still to come.",
    },
    sections: [
      {
        id: "featured-artists",
        label: "Roster",
        title: "Artist Directions",
        description:
          "These profiles illustrate our creative direction. Our artist roster has not yet been announced.",
        items: [
          {
            id: "artist-01",
            slug: "artist-01",
            title: "Artist 01",
            role: "Vocal Artist",
            subtitle: "Vocal Artist",
            status: "In development",
            description:
              "A voice connecting emotion, technology, and future-facing sound.",
            image: "/images/placeholders/artist-01.jpg",
          },
          {
            id: "artist-02",
            slug: "artist-02",
            title: "Artist 02",
            role: "Producer / Composer",
            subtitle: "Producer / Composer",
            status: "In development",
            description:
              "A producer shaping immersive music experiences for digital and live spaces.",
            image: "/images/placeholders/artist-02.jpg",
          },
        ],
      },
    ],
  },
  music: {
    slug: "music",
    hero: {
      tag: "héReSonare Music",
      title: "Sound for the Future",
      description:
        "Discover sound concepts in development. Release dates and listening links will appear here when confirmed.",
    },
    sections: [
      {
        id: "releases",
        label: "Catalog",
        title: "Release Concepts",
        items: [
          {
            id: "release-resonance-01",
            slug: "resonance-01",
            title: "Resonance 01",
            type: "Single",
            subtitle: "Single",
            status: "Coming soon",
            description:
              "A futuristic soundscape built around emotion, clarity, and movement.",
            year: "2026",
          },
          {
            id: "release-blue-signal",
            slug: "blue-signal",
            title: "Blue Signal",
            type: "EP",
            subtitle: "EP",
            status: "Concept",
            description:
              "Electronic textures and melodic storytelling shaped for a new era.",
            year: "2026",
          },
        ],
      },
    ],
  },
  productions: {
    slug: "productions",
    hero: {
      tag: "héReSonare Productions",
      title: "Product Lines",
      description:
        "Explore concepts in audio technology, creative platforms, and live experiences.",
    },
    sections: [
      {
        id: "product-lines",
        label: "Products",
        title: "Product Line Catalog",
        description:
          "Explore each concept's direction, potential uses, and current stage of development.",
        items: [
          {
            id: "audio-innovation",
            slug: "audio-innovation",
            title: "Audio Innovation",
            category: "Audio Technology Product",
            type: "Audio Technology",
            subtitle: "Audio Technology Product",
            status: "Concept",
            description:
              "A modular audio technology product line for future listening, spatial sound, and resonance-driven experiences.",
            features: [
              "Spatial sound framework",
              "Adaptive resonance layer",
              "Brand-ready audio modules",
            ],
            useCases: [
              "Immersive listening",
              "Interactive installations",
              "Productized sound identity",
            ],
            specs: [
              { label: "Format", value: "Modular audio system" },
              { label: "Stage", value: "Concept" },
            ],
            media: {
              card: "/images/products/audio-innovation/card.webp",
              hero: "/images/products/audio-innovation/hero.webp",
              render: "/images/products/audio-innovation/render.webp",
              icon: "/images/products/audio-innovation/icon.svg",
            },
            href: getProductionDetailPath("audio-innovation"),
          },
          {
            id: "creative-platform",
            slug: "creative-platform",
            title: "Creative Platform",
            category: "Creative Platform Product",
            type: "Platform",
            subtitle: "Creative Platform Product",
            status: "In development",
            description:
              "A creative platform product for organizing releases, artist worlds, media, and digital sound experiences.",
            features: [
              "Artist world modules",
              "Release and media structure",
              "Multilingual content foundation",
            ],
            useCases: [
              "Artist storytelling",
              "Digital sound experience hubs",
              "Brand and community portals",
            ],
            specs: [
              { label: "Format", value: "Web platform module" },
              { label: "Stage", value: "In development" },
            ],
            media: {
              card: "/images/products/creative-platform/card.webp",
              hero: "/images/products/creative-platform/hero.webp",
              render: "/images/products/creative-platform/render.webp",
              icon: "/images/products/creative-platform/icon.svg",
            },
            href: getProductionDetailPath("creative-platform"),
          },
          {
            id: "live-experience",
            slug: "live-experience",
            title: "Live Experience",
            category: "Live Experience Product",
            type: "Experience System",
            subtitle: "Live Experience Product",
            status: "Research",
            description:
              "A live experience product line for connecting performance, venue environments, and responsive sound moments.",
            features: [
              "Venue-ready experience kit",
              "Live sound interaction layer",
              "Audience resonance touchpoints",
            ],
            useCases: [
              "Concert environments",
              "Pop-up experiences",
              "Venue and brand activations",
            ],
            specs: [
              { label: "Format", value: "Experience system" },
              { label: "Stage", value: "Research" },
            ],
            media: {
              card: "/images/products/live-experience/card.webp",
              hero: "/images/products/live-experience/hero.webp",
              render: "/images/products/live-experience/render.webp",
              icon: "/images/products/live-experience/icon.svg",
            },
            href: getProductionDetailPath("live-experience"),
          },
        ],
      },
    ],
  },
  tour: {
    slug: "tour",
    hero: {
      tag: "héReSonare Tour",
      title: "Live Beyond Boundaries",
      description:
        "Future live experiences from héReSonare. Dates, venues, and ticket information have not yet been announced.",
    },
    sections: [
      {
        id: "tour-dates",
        label: "Live",
        title: "Live Updates",
        comingSoon: {
          label: "Coming Soon",
          title: "Tour details to be announced",
          description:
            "No dates are confirmed yet. Check back for announcements, or contact us about live collaborations.",
          cta: { label: "Contact", href: "/contact" },
        },
        items: [
          {
            id: "tour-placeholder",
            slug: "tour-placeholder",
            title: "Future Live Experience",
            subtitle: "To be announced",
            status: "Planning",
            description:
              "A live experience concept in planning. Dates and venues are not yet confirmed.",
            date: "TBA",
            location: "TBA",
          },
        ],
      },
    ],
  },
  venues: {
    slug: "venues",
    hero: {
      tag: "héReSonare Venues",
      title: "Spaces for Resonance",
      description:
        "Explore our ideas for live spaces and immersive listening. Locations are still to be confirmed.",
    },
    sections: [
      {
        id: "spaces",
        label: "Venues",
        title: "Venue Concepts",
        items: [
          {
            id: "venue-resonance-room",
            slug: "resonance-room",
            title: "Resonance Room",
            type: "Live Space",
            subtitle: "Live Space",
            status: "Concept",
            description:
              "A modular space for intimate performances and immersive sound tests.",
            location: "TBA",
          },
        ],
      },
    ],
  },
  video: {
    slug: "video",
    hero: {
      tag: "héReSonare Video",
      title: "Visual Soundscapes",
      description:
        "Music, movement, and stories in development. Films and viewing links will appear here when ready.",
    },
    sections: [
      {
        id: "video-works",
        label: "Video",
        title: "Visual Works",
        items: [
          {
            id: "video-signal-film",
            slug: "signal-film",
            title: "Signal Film",
            type: "Short Film",
            subtitle: "Short Film",
            status: "In development",
            description:
              "A visual concept for future music and story-driven releases.",
            year: "2026",
          },
        ],
      },
    ],
  },
  store: {
    slug: "store",
    hero: {
      tag: "héReSonare Store",
      title: "Official Store",
      description:
        "A future home for héReSonare merchandise and releases. The store is not open for orders yet.",
    },
    sections: [
      {
        id: "products",
        label: "Store",
        title: "Store Updates",
        comingSoon: {
          label: "Coming Soon",
          title: "Store in preparation",
          description:
            "Products, prices, and availability have not yet been announced. Please check back for updates.",
          cta: { label: "Ask about the store", href: "/contact" },
        },
        items: [
          {
            id: "store-foundation-item",
            slug: "foundation-item",
            title: "Future Merchandise",
            type: "Goods",
            subtitle: "Goods",
            status: "Coming soon",
            description:
              "An early merchandise concept. Design, pricing, and availability are not yet confirmed.",
          },
        ],
      },
    ],
  },
  about: {
    slug: "about",
    hero: {
      tag: "About héReSonare",
      title: "Where Sound Becomes Resonance",
      description:
        "Discover how sound, emotion, and technology shape héReSonare's creative direction.",
    },
    sections: [
      {
        id: "brand-pillars",
        label: "Identity",
        title: "Brand Pillars",
        items: [
          {
            id: "pillar-story",
            slug: "story",
            title: "Story",
            subtitle: "Brand",
            description:
              "A creative platform exploring how sound, emotion, and technology connect.",
          },
          {
            id: "pillar-mission",
            slug: "mission",
            title: "Mission",
            subtitle: "Purpose",
            description:
              "To create experiences that resonate beyond boundaries.",
          },
        ],
      },
    ],
  },
  contact: {
    slug: "contact",
    hero: {
      tag: "Contact",
      title: "Create Resonance Together",
      description:
        "Get in touch about artist collaborations, partnerships, venues, or production projects.",
    },
    sections: [
      {
        id: "inquiry-types",
        label: "Inquiries",
        title: "Contact Paths",
        items: [
          {
            id: "contact-artists",
            slug: "artists",
            title: "Artists",
            subtitle: "Collaboration",
            description:
              "Artist management, collaboration, and creative opportunities.",
            href: "mailto:contact@heresonare.com",
            links: [
              {
                label: "Email",
                href: "mailto:contact@heresonare.com",
                external: true,
              },
            ],
          },
          {
            id: "contact-partners",
            slug: "partners",
            title: "Partners",
            subtitle: "Business",
            description:
              "Brand collaborations, product partnerships, and strategic business relationships.",
            href: "mailto:contact@heresonare.com",
            links: [
              {
                label: "Email",
                href: "mailto:contact@heresonare.com",
                external: true,
              },
            ],
          },
        ],
      },
      {
        id: "official-social-channels",
        label: "Social",
        title: "Official Social Channels",
        description:
          "Follow héReSonare through our official public profiles.",
        items: [
          {
            id: "contact-socials",
            slug: "official-socials",
            title: "Follow héReSonare",
            subtitle: "Official Profiles",
            description:
              "Discover current updates, creative work, and new signals from héReSonare.",
            links: [
              {
                label: "Instagram",
                href: officialSocialLinks.instagram,
                external: true,
              },
              {
                label: "Xiaohongshu",
                href: officialSocialLinks.xiaohongshu,
                external: true,
              },
              {
                label: "Douyin",
                href: officialSocialLinks.douyin,
                external: true,
              },
            ],
          },
        ],
      },
    ],
  },
} satisfies Record<PageKey, StaticPageContent>;

type LocalizedPageLink = {
  label: string;
};

type LocalizedSpec = {
  label: string;
  value: string;
};

type LocalizedPageContentItem = {
  title: string;
  description: string;
  subtitle?: string;
  role?: string;
  type?: string;
  category?: string;
  status?: string;
  meta?: string;
  year?: string;
  date?: string;
  location?: string;
  features?: string[];
  useCases?: string[];
  specs?: LocalizedSpec[];
  links?: LocalizedPageLink[];
};

type LocalizedComingSoonContent = {
  label: string;
  title: string;
  description: string;
  cta?: LocalizedPageLink;
};

type LocalizedPageSectionContent = {
  label: string;
  title: string;
  description?: string;
  items?: LocalizedPageContentItem[];
  comingSoon?: LocalizedComingSoonContent;
};

type LocalizedStaticPageContent = {
  hero: PageHeroContent;
  sections: LocalizedPageSectionContent[];
};

const localizedPages = {
  JP: {
    artists: {
      hero: {
        tag: "h\u00e9ReSonare Artists",
        title: "共鳴する声",
        description:
          "歌声、音楽制作、コラボレーションを通じた創作の方向性をご紹介します。アーティスト情報は今後発表予定です。",
      },
      sections: [
        {
          label: "所属アーティスト",
          title: "アーティストの方向性",
          description:
            "以下は創作の方向性を示すプロフィール例です。所属アーティストはまだ発表していません。",
          items: [
            {
              title: "アーティスト 01",
              role: "ボーカルアーティスト",
              subtitle: "ボーカルアーティスト",
              status: "開発中",
              description: "感情、テクノロジー、未来志向のサウンドをつなぐ歌声。",
            },
            {
              title: "アーティスト 02",
              role: "プロデューサー／作曲家",
              subtitle: "プロデューサー／作曲家",
              status: "開発中",
              description:
                "デジタル空間とライブ空間に向け、没入感のある音楽体験を形づくるプロデューサー。",
            },
          ],
        },
      ],
    },
    music: {
      hero: {
        tag: "h\u00e9ReSonare Music",
        title: "未来のためのサウンド",
        description:
          "制作中のサウンドコンセプトをご紹介します。リリース日や試聴リンクは、確定次第こちらでお知らせします。",
      },
      sections: [
        {
          label: "カタログ",
          title: "リリースコンセプト",
          items: [
            {
              title: "Resonance 01",
              type: "シングル",
              subtitle: "シングル",
              status: "近日公開",
              description: "感情、透明感、躍動を軸に構築した未来的なサウンドスケープ。",
              year: "2026",
            },
            {
              title: "Blue Signal",
              type: "EP",
              subtitle: "EP",
              status: "コンセプト",
              description: "新たな時代に向けて形づくられた、電子的な質感と旋律による物語。",
              year: "2026",
            },
          ],
        },
      ],
    },
    productions: {
      hero: {
        tag: "h\u00e9ReSonare Productions",
        title: "プロダクトライン",
        description:
          "オーディオ技術、クリエイティブプラットフォーム、ライブ体験のコンセプトをご紹介します。",
      },
      sections: [
        {
          label: "プロダクト",
          title: "プロダクトラインカタログ",
          description:
            "各コンセプトの方向性、想定する活用例、現在の開発段階をご覧ください。",
          items: [
            {
              title: "Audio Innovation",
              category: "オーディオ技術プロダクト",
              type: "オーディオ技術",
              subtitle: "オーディオ技術プロダクト",
              status: "コンセプト",
              description:
                "未来のリスニング、空間音響、共鳴を軸とした体験のためのモジュール式オーディオ技術プロダクトライン。",
              features: [
                "空間音響フレームワーク",
                "適応型レゾナンスレイヤー",
                "ブランド対応オーディオモジュール",
              ],
              useCases: [
                "没入型リスニング",
                "インタラクティブインスタレーション",
                "プロダクト化されたサウンドアイデンティティ",
              ],
              specs: [
                { label: "形式", value: "モジュール式オーディオシステム" },
                { label: "段階", value: "コンセプト" },
              ],
            },
            {
              title: "Creative Platform",
              category: "Creative Platformプロダクト",
              type: "プラットフォーム",
              subtitle: "Creative Platformプロダクト",
              status: "開発中",
              description:
                "リリース、アーティストの世界観、メディア、デジタルサウンド体験を整理するためのCreative Platformプロダクト。",
              features: [
                "アーティスト世界観モジュール",
                "リリースとメディアの構造",
                "多言語コンテンツ基盤",
              ],
              useCases: [
                "アーティストのストーリーテリング",
                "デジタルサウンド体験のハブ",
                "ブランドとコミュニティのポータル",
              ],
              specs: [
                { label: "形式", value: "Webプラットフォームモジュール" },
                { label: "段階", value: "開発中" },
              ],
            },
            {
              title: "Live Experience",
              category: "Live Experienceプロダクト",
              type: "体験システム",
              subtitle: "Live Experienceプロダクト",
              status: "研究段階",
              description:
                "パフォーマンス、会場環境、反応する音の瞬間をつなぐLive Experienceプロダクトライン。",
              features: [
                "会場導入対応の体験キット",
                "ライブサウンドのインタラクションレイヤー",
                "観客との共鳴を生むタッチポイント",
              ],
              useCases: [
                "コンサート環境",
                "ポップアップ体験",
                "会場とブランドのアクティベーション",
              ],
              specs: [
                { label: "形式", value: "体験システム" },
                { label: "段階", value: "研究段階" },
              ],
            },
          ],
        },
      ],
    },
    tour: {
      hero: {
        tag: "h\u00e9ReSonare Tour",
        title: "境界を越えるライブ",
        description:
          "héReSonareが構想するライブ体験。日程、会場、チケット情報はまだ発表していません。",
      },
      sections: [
        {
          label: "ライブ",
          title: "ライブのお知らせ",
          comingSoon: {
            label: "\u8fd1\u65e5\u516c\u958b",
            title: "ツアー情報は決定次第お知らせします",
            description: "日程はまだ確定していません。続報をお待ちいただくか、ライブでの協業についてお問い合わせください。",
            cta: { label: "お問い合わせ" },
          },
          items: [
            {
              title: "未来のライブ体験",
              subtitle: "近日発表",
              status: "企画中",
              description: "企画段階のライブ体験コンセプトです。日程と会場はまだ確定していません。",
              date: "未定",
              location: "未定",
            },
          ],
        },
      ],
    },
    venues: {
      hero: {
        tag: "h\u00e9ReSonare Venues",
        title: "共鳴のための空間",
        description: "ライブ空間や没入型リスニングのアイデアをご紹介します。開催場所は今後決定予定です。",
      },
      sections: [
        {
          label: "会場",
          title: "会場コンセプト",
          items: [
            {
              title: "Resonance Room",
              type: "ライブ空間",
              subtitle: "ライブ空間",
              status: "コンセプト",
              description: "親密なパフォーマンスと没入型サウンドテストのためのモジュール式空間。",
              location: "未定",
            },
          ],
        },
      ],
    },
    video: {
      hero: {
        tag: "h\u00e9ReSonare Video",
        title: "映像で描くサウンドスケープ",
        description: "音楽、動き、物語をめぐる制作中の映像コンセプト。作品や視聴リンクは準備が整い次第公開します。",
      },
      sections: [
        {
          label: "ビデオ",
          title: "映像作品",
          items: [
            {
              title: "Signal Film",
              type: "短編映画",
              subtitle: "短編映画",
              status: "開発中",
              description: "未来の音楽作品と物語性のあるリリースに向けた映像コンセプト。",
              year: "2026",
            },
          ],
        },
      ],
    },
    store: {
      hero: {
        tag: "h\u00e9ReSonare Store",
        title: "公式ストア",
        description: "héReSonareのグッズやリリースをお届けするストアを準備中です。現在、ご注文は受け付けていません。",
      },
      sections: [
        {
          label: "ストア",
          title: "ストアのお知らせ",
          comingSoon: {
            label: "\u8fd1\u65e5\u516c\u958b",
            title: "ストア準備中",
            description:
              "商品、価格、販売時期はまだ発表していません。今後のお知らせをお待ちください。",
            cta: { label: "ストアについて問い合わせる" },
          },
          items: [
            {
              title: "今後のグッズ展開",
              type: "グッズ",
              subtitle: "グッズ",
              status: "近日公開",
              description: "初期段階のグッズコンセプトです。デザイン、価格、販売時期はまだ確定していません。",
            },
          ],
        },
      ],
    },
    about: {
      hero: {
        tag: "About h\u00e9ReSonare",
        title: "音が共鳴へと変わる場所",
        description:
          "音、感情、テクノロジーが、héReSonareの創作をどのように形づくるのかをご紹介します。",
      },
      sections: [
        {
          label: "アイデンティティ",
          title: "ブランドの柱",
          items: [
            {
              title: "ストーリー",
              subtitle: "ブランド",
              description:
                "音、感情、テクノロジーがどのようにつながるかを探求するクリエイティブプラットフォーム。",
            },
            {
              title: "ミッション",
              subtitle: "目的",
              description: "境界を越えて共鳴する体験を創造すること。",
            },
          ],
        },
      ],
    },
    contact: {
      hero: {
        tag: "お問い合わせ",
        title: "共に共鳴を創る",
        description:
          "アーティストとのコラボレーション、パートナーシップ、会場、制作プロジェクトについて、お気軽にお問い合わせください。",
      },
      sections: [
        {
          label: "お問い合わせ",
          title: "お問い合わせ窓口",
          items: [
            {
              title: "アーティスト",
              subtitle: "コラボレーション",
              description: "アーティストマネジメント、コラボレーション、クリエイティブな機会について。",
              links: [{ label: "メール" }],
            },
            {
              title: "パートナー",
              subtitle: "ビジネス",
              description: "ブランドコラボレーション、製品パートナーシップ、戦略的な事業関係について。",
              links: [{ label: "メール" }],
            },
          ],
        },
        {
          label: "ソーシャル",
          title: "公式ソーシャルチャンネル",
          description: "héReSonareの公式公開プロフィールをご案内します。",
          items: [
            {
              title: "héReSonareをフォロー",
              subtitle: "公式アカウント",
              description:
                "héReSonareの最新情報、クリエイティブ活動、新しい発信をご覧いただけます。",
              links: [
                { label: "Instagram" },
                { label: "小紅書" },
                { label: "Douyin（抖音）" },
              ],
            },
          ],
        },
      ],
    },
  },
  CN: {
    artists: {
      hero: {
        tag: "h\u00e9ReSonare Artists",
        title: "引发共鸣的声音",
        description: "探索我们在演唱、音乐制作与合作方面的创作方向。正式艺人阵容尚待公布。",
      },
      sections: [
        {
          label: "艺人阵容",
          title: "艺人方向",
          description: "以下档案用于展示创作方向，尚不代表已公布的正式艺人阵容。",
          items: [
            {
              title: "艺人 01",
              role: "声乐艺人",
              subtitle: "声乐艺人",
              status: "开发中",
              description: "连接情感、科技与未来感声音的嗓音。",
            },
            {
              title: "艺人 02",
              role: "制作人／作曲家",
              subtitle: "制作人／作曲家",
              status: "开发中",
              description: "为数字与现场空间塑造沉浸式音乐体验的制作人。",
            },
          ],
        },
      ],
    },
    music: {
      hero: {
        tag: "h\u00e9ReSonare Music",
        title: "面向未来的声音",
        description: "了解正在酝酿的声音概念。发行日期与试听链接将在确认后公布。",
      },
      sections: [
        {
          label: "目录",
          title: "发行概念",
          items: [
            {
              title: "Resonance 01",
              type: "单曲",
              subtitle: "单曲",
              status: "即将公开",
              description: "围绕情感、清晰感与律动构建的未来主义声音景观。",
              year: "2026",
            },
            {
              title: "Blue Signal",
              type: "EP",
              subtitle: "EP",
              status: "概念阶段",
              description: "为新时代塑造的电子质感与旋律叙事。",
              year: "2026",
            },
          ],
        },
      ],
    },
    productions: {
      hero: {
        tag: "h\u00e9ReSonare Productions",
        title: "产品线",
        description: "探索音频技术、创意平台与现场体验的概念方案。",
      },
      sections: [
        {
          label: "产品",
          title: "产品线目录",
          description: "了解各个概念方案的方向、潜在应用与当前研发阶段。",
          items: [
            {
              title: "Audio Innovation",
              category: "音频技术产品",
              type: "音频技术",
              subtitle: "音频技术产品",
              status: "概念阶段",
              description: "面向未来聆听、空间音频与共鸣驱动体验的模块化音频技术产品线。",
              features: [
                "空间音频框架",
                "自适应共鸣层",
                "品牌适配音频模块",
              ],
              useCases: [
                "沉浸式聆听",
                "互动装置",
                "产品化的声音品牌标识",
              ],
              specs: [
                { label: "形式", value: "模块化音频系统" },
                { label: "阶段", value: "概念阶段" },
              ],
            },
            {
              title: "Creative Platform",
              category: "Creative Platform产品",
              type: "平台",
              subtitle: "Creative Platform产品",
              status: "开发中",
              description: "用于组织发行作品、艺人世界观、媒体内容和数字声音体验的Creative Platform产品。",
              features: [
                "艺人世界观模块",
                "发行与媒体结构",
                "多语言内容基础",
              ],
              useCases: [
                "艺人叙事",
                "数字声音体验中心",
                "品牌与社区门户",
              ],
              specs: [
                { label: "形式", value: "Web平台模块" },
                { label: "阶段", value: "开发中" },
              ],
            },
            {
              title: "Live Experience",
              category: "Live Experience产品",
              type: "体验系统",
              subtitle: "Live Experience产品",
              status: "研究阶段",
              description: "连接演出、场地环境与会随互动变化的声音瞬间的Live Experience产品线。",
              features: [
                "场地适配体验套件",
                "现场声音互动层",
                "观众共鸣触点",
              ],
              useCases: [
                "演唱会环境",
                "快闪体验",
                "场地与品牌活动",
              ],
              specs: [
                { label: "形式", value: "体验系统" },
                { label: "阶段", value: "研究阶段" },
              ],
            },
          ],
        },
      ],
    },
    tour: {
      hero: {
        tag: "h\u00e9ReSonare Tour",
        title: "跨越边界的现场体验",
        description: "héReSonare 正在构想未来的现场体验，演出日期、场地与票务信息尚未公布。",
      },
      sections: [
        {
          label: "现场",
          title: "现场动态",
          comingSoon: {
            label: "即将公开",
            title: "巡演信息待公布",
            description: "目前暂无已确认的演出日期。欢迎关注后续消息，或联系我们探讨现场合作。",
            cta: { label: "联系我们" },
          },
          items: [
            {
              title: "未来现场体验",
              subtitle: "待公布",
              status: "规划中",
              description: "规划中的现场体验概念，演出日期与场地尚未确认。",
              date: "待定",
              location: "待定",
            },
          ],
        },
      ],
    },
    venues: {
      hero: {
        tag: "h\u00e9ReSonare Venues",
        title: "共鸣空间",
        description: "探索现场空间与沉浸式聆听的构想，具体地点尚待确认。",
      },
      sections: [
        {
          label: "场地",
          title: "场地概念",
          items: [
            {
              title: "Resonance Room",
              type: "现场空间",
              subtitle: "现场空间",
              status: "概念阶段",
              description: "用于小型演出与沉浸式声音测试的模块化空间。",
              location: "待定",
            },
          ],
        },
      ],
    },
    video: {
      hero: {
        tag: "h\u00e9ReSonare Video",
        title: "视觉声音景观",
        description: "探索音乐、影像与故事的创作构想。作品及观看链接将在准备就绪后公开。",
      },
      sections: [
        {
          label: "视频",
          title: "视觉作品",
          items: [
            {
              title: "Signal Film",
              type: "短片",
              subtitle: "短片",
              status: "开发中",
              description: "面向未来音乐作品与叙事型发行内容的视觉概念。",
              year: "2026",
            },
          ],
        },
      ],
    },
    store: {
      hero: {
        tag: "h\u00e9ReSonare Store",
        title: "官方商店",
        description: "héReSonare 周边与发行作品的未来商店，目前尚未开放下单。",
      },
      sections: [
        {
          label: "商店",
          title: "商店动态",
          comingSoon: {
            label: "即将公开",
            title: "商店筹备中",
            description: "商品、价格与发售时间尚未公布，请关注后续消息。",
            cta: { label: "咨询商店" },
          },
          items: [
            {
              title: "未来周边",
              type: "周边商品",
              subtitle: "周边商品",
              status: "即将公开",
              description: "处于早期构想阶段的周边商品，设计、价格与发售时间尚未确认。",
            },
          ],
        },
      ],
    },
    about: {
      hero: {
        tag: "About h\u00e9ReSonare",
        title: "让声音化为共鸣",
        description: "了解声音、情感与科技如何塑造 héReSonare 的创作方向。",
      },
      sections: [
        {
          label: "品牌定位",
          title: "品牌支柱",
          items: [
            {
              title: "故事",
              subtitle: "品牌",
              description: "探索声音、情感与科技如何相互连接的创意平台。",
            },
            {
              title: "使命",
              subtitle: "宗旨",
              description: "创造跨越边界、引发共鸣的体验。",
            },
          ],
        },
      ],
    },
    contact: {
      hero: {
        tag: "联系我们",
        title: "共同创造共鸣",
        description: "欢迎与我们联系，探讨艺人合作、品牌合作、场地或制作项目。",
      },
      sections: [
        {
          label: "咨询",
          title: "联系渠道",
          items: [
            {
              title: "艺人",
              subtitle: "合作",
              description: "艺人管理、合作与创意机会相关咨询。",
              links: [{ label: "电子邮件" }],
            },
            {
              title: "合作伙伴",
              subtitle: "商务",
              description: "品牌合作、产品合作关系与战略业务关系相关咨询。",
              links: [{ label: "电子邮件" }],
            },
          ],
        },
        {
          label: "社交平台",
          title: "官方社交平台",
          description: "通过 héReSonare 的官方公开主页关注我们的动态。",
          items: [
            {
              title: "关注 héReSonare",
              subtitle: "官方账号",
              description: "查看 héReSonare 的最新动态、创意作品与全新内容。",
              links: [
                { label: "Instagram" },
                { label: "小红书" },
                { label: "抖音" },
              ],
            },
          ],
        },
      ],
    },
  },
} satisfies Record<
  Exclude<Language, "EN">,
  Record<PageKey, LocalizedStaticPageContent>
>;

function assertNoCorruptedLocalizedStrings(
  value: unknown,
  language: Exclude<Language, "EN">,
  path: string
): void {
  if (typeof value === "string") {
    if (/\?{2,}/.test(value)) {
      throw new Error(
        `Corrupted localized text detected for ${language} at ${path}.`
      );
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((entry, index) =>
      assertNoCorruptedLocalizedStrings(entry, language, `${path}.${index}`)
    );
    return;
  }

  if (value !== null && typeof value === "object") {
    Object.entries(value).forEach(([key, entry]) =>
      assertNoCorruptedLocalizedStrings(entry, language, `${path}.${key}`)
    );
  }
}

for (const language of ["JP", "CN"] as const) {
  assertNoCorruptedLocalizedStrings(
    localizedPages[language],
    language,
    language
  );
}

function requireLocalizedText(
  sourceText: string,
  localizedText: string | undefined,
  context: string
): string;
function requireLocalizedText(
  sourceText: undefined,
  localizedText: string | undefined,
  context: string
): undefined;
function requireLocalizedText(
  sourceText: string | undefined,
  localizedText: string | undefined,
  context: string
): string | undefined;
function requireLocalizedText(
  sourceText: string | undefined,
  localizedText: string | undefined,
  context: string
): string | undefined {
  if (sourceText === undefined) {
    return undefined;
  }

  if (localizedText === undefined) {
    throw new Error("Missing localized text for " + context + ".");
  }

  return localizedText;
}

function requireLocalizedList(
  sourceList: string[] | undefined,
  localizedList: string[] | undefined,
  context: string
) {
  if (sourceList === undefined) {
    return undefined;
  }

  if (
    localizedList === undefined ||
    localizedList.length !== sourceList.length
  ) {
    throw new Error("Missing localized list for " + context + ".");
  }

  return localizedList;
}

function localizeLinks(
  links: PageLink[] | undefined,
  localizedLinks: LocalizedPageLink[] | undefined,
  context: string
) {
  if (links === undefined) {
    return undefined;
  }

  if (
    localizedLinks === undefined ||
    localizedLinks.length !== links.length
  ) {
    throw new Error("Missing localized link labels for " + context + ".");
  }

  return links.map((link, index) => ({
    ...link,
    label: localizedLinks[index].label,
  }));
}

function localizeSpecs(
  specs: PageContentItem["specs"],
  localizedSpecs: LocalizedSpec[] | undefined,
  context: string
) {
  if (specs === undefined) {
    return undefined;
  }

  if (
    localizedSpecs === undefined ||
    localizedSpecs.length !== specs.length
  ) {
    throw new Error("Missing localized specs for " + context + ".");
  }

  return specs.map((spec, index) => ({
    ...spec,
    label: localizedSpecs[index].label,
    value: localizedSpecs[index].value,
  }));
}

function omitUndefinedOptionalFields<T extends object>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, fieldValue]) => fieldValue !== undefined)
  ) as T;
}

function localizeItem(
  item: PageContentItem,
  localizedItem: LocalizedPageContentItem,
  context: string
): PageContentItem {
  return omitUndefinedOptionalFields({
    ...item,
    title: localizedItem.title,
    description: localizedItem.description,
    subtitle: requireLocalizedText(
      item.subtitle,
      localizedItem.subtitle,
      context + ".subtitle"
    ),
    role: requireLocalizedText(item.role, localizedItem.role, context + ".role"),
    type: requireLocalizedText(item.type, localizedItem.type, context + ".type"),
    category: requireLocalizedText(
      item.category,
      localizedItem.category,
      context + ".category"
    ),
    status: requireLocalizedText(
      item.status,
      localizedItem.status,
      context + ".status"
    ),
    meta: requireLocalizedText(item.meta, localizedItem.meta, context + ".meta"),
    year: requireLocalizedText(item.year, localizedItem.year, context + ".year"),
    date: requireLocalizedText(item.date, localizedItem.date, context + ".date"),
    location: requireLocalizedText(
      item.location,
      localizedItem.location,
      context + ".location"
    ),
    features: requireLocalizedList(
      item.features,
      localizedItem.features,
      context + ".features"
    ),
    useCases: requireLocalizedList(
      item.useCases,
      localizedItem.useCases,
      context + ".useCases"
    ),
    specs: localizeSpecs(item.specs, localizedItem.specs, context + ".specs"),
    links: localizeLinks(item.links, localizedItem.links, context + ".links"),
  });
}

function localizeItems(
  items: PageContentItem[] | undefined,
  localizedItems: LocalizedPageContentItem[] | undefined,
  context: string
) {
  if (items === undefined) {
    return undefined;
  }

  if (
    localizedItems === undefined ||
    localizedItems.length !== items.length
  ) {
    throw new Error("Missing localized items for " + context + ".");
  }

  return items.map((item, index) =>
    localizeItem(item, localizedItems[index], context + "." + item.id)
  );
}

function localizeComingSoon(
  comingSoon: ComingSoonContent | undefined,
  localizedComingSoon: LocalizedComingSoonContent | undefined,
  context: string
) {
  if (comingSoon === undefined) {
    return undefined;
  }

  if (localizedComingSoon === undefined) {
    throw new Error("Missing localized coming soon content for " + context + ".");
  }

  return omitUndefinedOptionalFields({
    ...comingSoon,
    label: localizedComingSoon.label,
    title: localizedComingSoon.title,
    description: localizedComingSoon.description,
    cta:
      comingSoon.cta === undefined
        ? undefined
        : {
            ...comingSoon.cta,
            label: requireLocalizedText(
              comingSoon.cta.label,
              localizedComingSoon.cta?.label,
              context + ".comingSoon.cta.label"
            ),
          },
  });
}

function localizeSection(
  section: PageSectionContent,
  localizedSection: LocalizedPageSectionContent,
  context: string
): PageSectionContent {
  return omitUndefinedOptionalFields({
    ...section,
    label: localizedSection.label,
    title: localizedSection.title,
    description: requireLocalizedText(
      section.description,
      localizedSection.description,
      context + ".description"
    ),
    items: localizeItems(section.items, localizedSection.items, context + ".items"),
    comingSoon: localizeComingSoon(
      section.comingSoon,
      localizedSection.comingSoon,
      context + ".comingSoon"
    ),
  });
}

function localizePage(
  page: StaticPageContent,
  localizedPage: LocalizedStaticPageContent,
  pageKey: PageKey
): StaticPageContent {
  if (localizedPage.sections.length !== page.sections.length) {
    throw new Error("Missing localized sections for " + pageKey + ".");
  }

  return {
    ...page,
    hero: localizedPage.hero,
    sections: page.sections.map((section, index) =>
      localizeSection(
        section,
        localizedPage.sections[index],
        pageKey + ".sections." + section.id
      )
    ),
  };
}

function localizePages(
  pages: Record<PageKey, LocalizedStaticPageContent>
): Record<PageKey, StaticPageContent> {
  return {
    artists: localizePage(englishPages.artists, pages.artists, "artists"),
    music: localizePage(englishPages.music, pages.music, "music"),
    productions: localizePage(
      englishPages.productions,
      pages.productions,
      "productions"
    ),
    tour: localizePage(englishPages.tour, pages.tour, "tour"),
    venues: localizePage(englishPages.venues, pages.venues, "venues"),
    video: localizePage(englishPages.video, pages.video, "video"),
    store: localizePage(englishPages.store, pages.store, "store"),
    about: localizePage(englishPages.about, pages.about, "about"),
    contact: localizePage(englishPages.contact, pages.contact, "contact"),
  };
}

function assertDistinctItemDestinations(
  pages: Record<PageKey, StaticPageContent>
) {
  for (const pageKey of Object.keys(pages) as PageKey[]) {
    const page = pages[pageKey];
    const listPath = `/${pageKey}`;

    for (const section of page.sections) {
      for (const item of section.items ?? []) {
        const destinations = [
          item.href,
          ...(item.links ?? []).map((link) => link.href),
        ].filter((href): href is string => Boolean(href));

        if (
          destinations.some(
            (href) => href === listPath || href === `${listPath}/`
          )
        ) {
          throw new Error(
            `Self-referential content action for ${pageKey}.${item.id}.`
          );
        }
      }
    }
  }
}

assertDistinctItemDestinations(englishPages);

export const pageContent = {
  EN: englishPages,
  JP: localizePages(localizedPages.JP),
  CN: localizePages(localizedPages.CN),
} satisfies PageContentByLanguage;
