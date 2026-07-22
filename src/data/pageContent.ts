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
        "A foundation for future artist profiles, collaborations, and creative rosters.",
    },
    sections: [
      {
        id: "featured-artists",
        label: "Roster",
        title: "Featured Artists",
        description:
          "Static artist records that can later map to database-backed profiles.",
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
        "A structured catalog foundation for releases, playlists, and sound concepts.",
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
        "A product-oriented foundation for audio technology products, creative platform modules, and live experience systems.",
    },
    sections: [
      {
        id: "product-lines",
        label: "Products",
        title: "Product Line Catalog",
        description:
          "Static product-line records designed for future product detail pages, media, and structured product data.",
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
        "Static tour and event records for future schedules, locations, and ticket links.",
    },
    sections: [
      {
        id: "tour-dates",
        label: "Live",
        title: "Tour Framework",
        comingSoon: {
          label: "Coming Soon",
          title: "Tour announcements are coming soon",
          description:
            "Dates, locations, and event details can be dropped into this structure when confirmed.",
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
              "A placeholder event record for future route, date, and venue data.",
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
        "Venue content prepared for future spaces, partners, and live environment data.",
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
        "A content model for music videos, live sessions, and visual works.",
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
        "A simple structure for future goods, releases, and collectible products.",
    },
    sections: [
      {
        id: "products",
        label: "Store",
        title: "Product Placeholders",
        comingSoon: {
          label: "Coming Soon",
          title: "Store opening soon",
          description:
            "Merchandise, digital releases, and limited items can use this static schema before commerce is added.",
        },
        items: [
          {
            id: "store-foundation-item",
            slug: "foundation-item",
            title: "Foundation Item",
            type: "Goods",
            subtitle: "Goods",
            status: "Coming soon",
            description:
              "A placeholder item for future product content and storefront data.",
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
        "Brand story, mission, and vision content organized for future expansion.",
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
        "A typed foundation for partnership, artist, venue, and production inquiries.",
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
          "未来のアーティストプロフィール、コラボレーション、クリエイティブなアーティストラインナップのための基盤です。",
      },
      sections: [
        {
          label: "所属アーティスト",
          title: "注目のアーティスト",
          description:
            "将来、データベース連携のプロフィールへ展開できる静的なアーティスト情報です。",
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
          "リリース、プレイリスト、サウンドコンセプトを整理するカタログ基盤です。",
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
          "オーディオ技術製品、クリエイティブプラットフォームのモジュール、ライブ体験システムの製品展開を見据えた基盤です。",
      },
      sections: [
        {
          label: "プロダクト",
          title: "プロダクトラインカタログ",
          description:
            "将来の製品詳細ページ、メディア、構造化された製品データに対応する静的なプロダクトライン情報です。",
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
          "将来のスケジュール、開催地、チケットリンクに対応する静的なツアー・イベント情報です。",
      },
      sections: [
        {
          label: "ライブ",
          title: "ツアー情報の基盤",
          comingSoon: {
            label: "\u8fd1\u65e5\u516c\u958b",
            title: "ツアー情報は近日公開予定です",
            description: "日程、開催地、イベント詳細が確定次第、この構成に追加できます。",
            cta: { label: "お問い合わせ" },
          },
          items: [
            {
              title: "未来のライブ体験",
              subtitle: "近日発表",
              status: "企画中",
              description: "将来のルート、日程、会場情報のための仮イベント情報です。",
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
        description: "将来の会場、パートナー、ライブ環境データに対応する会場コンテンツです。",
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
        description: "ミュージックビデオ、ライブセッション、映像作品のためのコンテンツモデルです。",
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
        description: "将来のグッズ、リリース、コレクター向け製品のためのシンプルな構成です。",
      },
      sections: [
        {
          label: "ストア",
          title: "商品プレースホルダー",
          comingSoon: {
            label: "\u8fd1\u65e5\u516c\u958b",
            title: "ストアは近日オープン予定です",
            description:
              "コマース機能の追加前でも、グッズ、デジタルリリース、限定アイテムにこの静的スキーマを利用できます。",
          },
          items: [
            {
              title: "基盤アイテム",
              type: "グッズ",
              subtitle: "グッズ",
              status: "近日公開",
              description: "将来の商品コンテンツとストアデータのための仮アイテムです。",
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
          "将来の展開に向けて整理された、ブランドストーリー、ミッション、ビジョンのコンテンツです。",
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
          "パートナーシップ、アーティスト、会場、制作に関するお問い合わせを体系的に受け付けるための基盤です。",
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
        description: "为未来的艺人档案、合作项目和创意阵容打造的基础。",
      },
      sections: [
        {
          label: "艺人阵容",
          title: "精选艺人",
          description: "可在未来映射至数据库驱动档案的静态艺人记录。",
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
        description: "为发行作品、播放列表和声音概念构建的结构化目录基础。",
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
        description: "面向音频技术产品、创意平台模块与现场体验系统产品化的基础。",
      },
      sections: [
        {
          label: "产品",
          title: "产品线目录",
          description: "为未来产品详情页、媒体内容和结构化产品数据设计的静态产品线记录。",
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
        description: "为未来日程、地点与票务链接准备的静态巡演和活动记录。",
      },
      sections: [
        {
          label: "现场",
          title: "巡演信息框架",
          comingSoon: {
            label: "即将公开",
            title: "巡演信息即将公布",
            description: "日期、地点与活动详情确认后即可加入此结构。",
            cta: { label: "联系我们" },
          },
          items: [
            {
              title: "未来现场体验",
              subtitle: "待公布",
              status: "规划中",
              description: "用于未来巡演路线、日期和场地数据的占位活动记录。",
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
        description: "为未来空间、合作伙伴与现场环境数据准备的场地内容。",
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
        description: "面向音乐视频、现场录制与视觉作品的内容模型。",
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
        description: "为未来商品、发行作品与收藏产品准备的简洁结构。",
      },
      sections: [
        {
          label: "商店",
          title: "商品占位内容",
          comingSoon: {
            label: "即将公开",
            title: "商店即将开放",
            description: "在加入电商功能前，周边商品、数字发行作品和限量商品可使用此静态架构。",
          },
          items: [
            {
              title: "基础商品",
              type: "周边商品",
              subtitle: "周边商品",
              status: "即将公开",
              description: "用于未来商品内容和店铺数据的占位商品。",
            },
          ],
        },
      ],
    },
    about: {
      hero: {
        tag: "About h\u00e9ReSonare",
        title: "让声音化为共鸣",
        description: "为未来扩展而组织的品牌故事、使命与愿景内容。",
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
        description: "为合作伙伴、艺人、场地与制作相关咨询构建的结构化基础。",
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
