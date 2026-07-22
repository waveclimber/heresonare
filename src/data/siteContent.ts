import type { ContentLanguage } from "@/i18n/config";

type SitePageContent = {
  tag: string;
  title: string;
  description: string;
};

export type SiteContentEntry = {
  heroEyebrow: string;
  heroBusinessAreas: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  discover: string;
  contactButton: string;
  latestReleaseLabel: string;
  latestReleaseTitle: string;
  latestReleaseMeta: string;
  latestReleaseText: string;
  productsTitle: string;
  product1Title: string;
  product1Text: string;
  product2Title: string;
  product2Text: string;
  product3Title: string;
  product3Text: string;
  featuredLabel: string;
  featuredTitle: string;
  featuredCategoryLabel: string;
  featuredDiscoverLabel: string;
  featuredArtistsTitle: string;
  featuredArtistsText: string;
  featuredMusicTitle: string;
  featuredMusicText: string;
  featuredProductionsTitle: string;
  featuredProductionsText: string;
  aboutTag: string;
  aboutTitle: string;
  aboutText1: string;
  aboutText2: string;
  aboutCardLabel: string;
  aboutStoryTitle: string;
  aboutStoryText: string;
  aboutMissionTitle: string;
  aboutMissionText: string;
  aboutVisionTitle: string;
  aboutVisionText: string;
  contactTag: string;
  contactTitle: string;
  contactText: string;
  contactEmailLabel: string;
  contactCardLabel: string;
  contactArtistsTitle: string;
  contactArtistsText: string;
  contactPartnersTitle: string;
  contactPartnersText: string;
  contactVenuesTitle: string;
  contactVenuesText: string;
  socialChannelsLabel: string;
  instagramLabel: string;
  xiaohongshuLabel: string;
  douyinLabel: string;
  footerSlogan: string;
  footerCopyright: string;
  pages: Record<
    | "artists"
    | "music"
    | "productions"
    | "venues"
    | "tour"
    | "video"
    | "store"
    | "about"
    | "contact",
    SitePageContent
  >;
};

export const siteContent = {
    EN: {
        heroEyebrow: "Music • Emotion • Resonance",
        heroBusinessAreas: "ENTERTAINMENT • LABEL • PRODUCTION",
        heroTitle: "héReSonare",
        heroSubtitle: "Resonate with the Future",
        heroDescription:
          "An entertainment and creative platform where music, artists and imagination come together.",
          discover: "Discover",
        contactButton: "Contact",
        latestReleaseLabel: "LATEST RELEASE",
        latestReleaseTitle: "Coming Soon",
        latestReleaseMeta: "SINGLE · 2026",
        latestReleaseText: "New sound experiences are on the way.",
      
        productsTitle: "Products",
        product1Title: "Audio Innovation",
        product1Text:
          "Next-generation sound technology designed to inspire creativity and human connection.",
        product2Title: "Creative Resonance",
        product2Text:
          "Creating meaningful connections through sound, design and technology.",
        product3Title: "Future Experience",
        product3Text:
          "Exploring new possibilities where creativity, emotion and innovation meet.",
      
        featuredLabel: "FEATURED",
        featuredTitle: "Featured Content",
        featuredCategoryLabel: "CATEGORY",
        featuredDiscoverLabel: "DISCOVER",
      
        featuredArtistsTitle: "ARTISTS",
        featuredArtistsText:
          "Discover the talents shaping the future of sound.",
      
        featuredMusicTitle: "MUSIC",
        featuredMusicText:
          "Explore releases and sonic experiences.",
      
        featuredProductionsTitle: "PRODUCTIONS",
        featuredProductionsText:
          "Creative production and sound design services for new forms of expression.",
      
        aboutTag: "About héReSonare",
        aboutTitle: "Where sound becomes resonance.",
        aboutText1:
          "héReSonare believes that sound is more than a medium of communication. It is a bridge connecting creativity, emotion, technology and human experience.",
        aboutText2:
          "Through artistic expression and technological innovation, we explore new ways for people, brands and communities to resonate with each other.",
        aboutCardLabel: "BRAND IDENTITY",
      
        aboutStoryTitle: "Brand Story",
        aboutStoryText:
          "Born from the idea of resonance, héReSonare explores how sound, creativity and technology can shape meaningful experiences.",
      
        aboutMissionTitle: "Mission",
        aboutMissionText:
          "To create experiences that resonate beyond boundaries.",
      
        aboutVisionTitle: "Vision",
        aboutVisionText:
          "To become a global creative technology brand connecting people through sound, emotion and innovation.",
      
        contactTag: "Contact",
        contactTitle: "Let's Create Resonance Together",
        contactText:
          "Whether you are a creator, partner or innovator, we would love to hear from you.",
        contactEmailLabel: "contact@heresonare.com",
        contactCardLabel: "CONTACT TYPE",
        contactArtistsTitle: "Artists",
        contactArtistsText:
          "Artist management, collaboration and creative opportunities.",
        contactPartnersTitle: "Partners",
        contactPartnersText:
          "Business partnerships, brand collaborations and production projects.",
        contactVenuesTitle: "Venues",
        contactVenuesText:
          "Live events, venues, performances and future stage experiences.",
        socialChannelsLabel: "Official Social Channels",
        instagramLabel: "Instagram",
        xiaohongshuLabel: "Xiaohongshu",
        douyinLabel: "Douyin",
      
        footerSlogan: "Sound Beyond Boundaries",
        footerCopyright:
          "© 2026 héReSonare. All rights reserved.",

          pages: {
            artists: {
              tag: "héReSonare Artists",
              title: "Voices That Resonate",
              description: "Discover the talents shaping the future of sound.",
            },
            music: {
              tag: "héReSonare Music",
              title: "Sound for the Future",
              description: "Explore releases and sonic experiences.",
            },
            productions: {
              tag: "héReSonare Productions",
              title: "Creative Production",
              description: "Creative production and sound design services.",
            },
            venues: {
              tag: "héReSonare Venues",
              title: "Spaces for Resonance",
              description: "Live spaces designed for sound, emotion and connection.",
            },
            tour: {
              tag: "héReSonare Tour",
              title: "Live Beyond Boundaries",
              description: "Tour experiences connecting artists and audiences.",
            },
            video: {
              tag: "héReSonare Video",
              title: "Visual Soundscapes",
              description: "Music videos, visual works and creative films.",
            },
            store: {
              tag: "héReSonare Store",
              title: "Official Store",
              description: "Official goods, releases and future collectibles.",
            },
            about: {
              tag: "About héReSonare",
              title: "Where Sound Becomes Resonance",
              description: "A creative platform connecting sound, emotion and technology.",
            },
            contact: {
              tag: "Contact",
              title: "Create Resonance Together",
              description: "Reach out for collaboration, production and partnership.",
            },
          },
      },
  
      JP: {
        heroEyebrow: "音楽 • 感情 • 共鳴",
        heroBusinessAreas: "エンターテインメント • レーベル • プロダクション",
        heroTitle: "héReSonare",
        heroSubtitle: "未来と共鳴する。",
        heroDescription:
          "音楽、アーティスト、そして創造性が交差するエンターテインメントとクリエイティブのプラットフォーム。",
          discover: "探索する",
        contactButton: "お問い合わせ",
        latestReleaseLabel: "最新リリース",
        latestReleaseTitle: "近日公開",
        latestReleaseMeta: "シングル · 2026",
        latestReleaseText: "新しいサウンド体験をまもなくお届けします。",
      
        productsTitle: "製品",
        product1Title: "音響イノベーション",
        product1Text:
          "創造性と人とのつながりを刺激する、次世代のサウンドテクノロジー。",
        product2Title: "創造的な共鳴",
        product2Text:
          "音、デザイン、テクノロジーを通じて意味のあるつながりを生み出します。",
        product3Title: "未来の体験",
        product3Text:
          "創造性、感情、革新が交わる新しい可能性を探求します。",
      
        featuredLabel: "注目",
        featuredTitle: "注目コンテンツ",
        featuredCategoryLabel: "カテゴリー",
        featuredDiscoverLabel: "詳しく見る",
      
        featuredArtistsTitle: "アーティスト",
        featuredArtistsText:
          "未来のサウンドを形づくるアーティストたちをご紹介します。",
      
        featuredMusicTitle: "音楽",
        featuredMusicText:
          "最新リリースと新しいサウンド体験を探求します。",
      
        featuredProductionsTitle: "プロダクション",
        featuredProductionsText:
          "新しい表現のためのクリエイティブ制作とサウンドデザインを提供します。",
      
        aboutTag: "héReSonareについて",
        aboutTitle: "音が共鳴へと変わる場所。",
        aboutText1:
          "héReSonareは、音を単なるコミュニケーション手段ではなく、創造性・感情・技術・人間体験をつなぐ架け橋だと考えています。",
        aboutText2:
          "芸術表現と技術革新を通じて、人々、ブランド、コミュニティが共鳴する新しい方法を探求します。",
        aboutCardLabel: "ブランドアイデンティティ",
      
        aboutStoryTitle: "ブランドストーリー",
        aboutStoryText:
          "共鳴という思想から生まれた héReSonare は、音・創造性・テクノロジーがどのように意味ある体験を形づくるかを探求します。",
      
        aboutMissionTitle: "ミッション",
        aboutMissionText:
          "境界を越えて共鳴する体験を創造すること。",
      
        aboutVisionTitle: "ビジョン",
        aboutVisionText:
          "音、感情、革新を通じて人々をつなぐ、グローバルなクリエイティブ・ブランドを目指します。",
      
        contactTag: "お問い合わせ",
        contactTitle: "共に新しい共鳴を創りましょう",
        contactText:
          "クリエイター、パートナー、イノベーターの皆様からのご連絡をお待ちしております。",
        contactEmailLabel: "contact@heresonare.com",
        contactCardLabel: "お問い合わせ種別",
        contactArtistsTitle: "アーティスト",
        contactArtistsText:
          "アーティストマネジメント、コラボレーション、創作活動のご相談。",
        contactPartnersTitle: "パートナー",
        contactPartnersText:
          "ビジネス提携、ブランドコラボレーション、制作プロジェクトのご相談。",
        contactVenuesTitle: "会場",
        contactVenuesText:
          "ライブイベント、会場、公演、未来のステージ体験のご相談。",
        socialChannelsLabel: "公式ソーシャルチャンネル",
        instagramLabel: "Instagram",
        xiaohongshuLabel: "小紅書",
        douyinLabel: "Douyin（抖音）",
      
        footerSlogan: "Sound Beyond Boundaries",
        footerCopyright:
          "© 2026 héReSonare. All rights reserved.",

          pages: {
            artists: {
              tag: "héReSonare Artists",
              title: "響き合うアーティスト",
              description:
                "未来のサウンドを形づくるアーティストたちをご紹介します。",
            },
          
            music: {
              tag: "héReSonare Music",
              title: "未来のサウンド",
              description:
                "最新リリースと新しいサウンド体験を探求します。",
            },
          
            productions: {
              tag: "héReSonare Productions",
              title: "クリエイティブプロダクション",
              description:
                "新しい表現のための制作とサウンドデザイン。",
            },
          
            venues: {
              tag: "héReSonare Venues",
              title: "共鳴のための空間",
              description:
                "音と感情、人々をつなぐライブ空間。",
            },
          
            tour: {
              tag: "héReSonare Tour",
              title: "境界を越えるライブ",
              description:
                "アーティストと観客をつなぐツアー体験。",
            },
          
            video: {
              tag: "héReSonare Video",
              title: "映像とサウンド",
              description:
                "ミュージックビデオと映像作品。",
            },
          
            store: {
              tag: "héReSonare Store",
              title: "公式ストア",
              description:
                "公式グッズとリリース作品。",
            },
          
            about: {
              tag: "About héReSonare",
              title: "音が共鳴へと変わる場所",
              description:
                "音・感情・技術をつなぐクリエイティブプラットフォーム。",
            },
          
            contact: {
              tag: "Contact",
              title: "共に新しい共鳴を創りましょう",
              description:
                "コラボレーションや制作のご相談はこちら。",
            },
          },
      },
  
      CN: {
        heroEyebrow: "音乐 • 情感 • 共鸣",
        heroBusinessAreas: "娱乐 • 厂牌 • 制作",
        heroTitle: "héReSonare",
        heroSubtitle: "与未来共鸣",
        heroDescription:
          "一个汇聚音乐、艺人与创造力的娱乐与创意平台。",
          discover: "探索",
        contactButton: "联系我们",
        latestReleaseLabel: "最新发行",
        latestReleaseTitle: "即将发布",
        latestReleaseMeta: "单曲 · 2026",
        latestReleaseText: "全新的声音体验即将到来。",
      
        productsTitle: "产品",
        product1Title: "声音创新",
        product1Text:
          "以新一代声音技术激发创造力与人与人之间的连接。",
        product2Title: "创意共鸣",
        product2Text:
          "通过声音、设计与技术，创造有意义的连接。",
        product3Title: "未来体验",
        product3Text:
          "探索创造力、情感与创新交汇处的全新可能。",
      
        featuredLabel: "精选",
        featuredTitle: "精选内容",
        featuredCategoryLabel: "类别",
        featuredDiscoverLabel: "探索",
      
        featuredArtistsTitle: "艺人",
        featuredArtistsText:
          "探索正在塑造未来声音的创作者与艺人。",
      
        featuredMusicTitle: "音乐",
        featuredMusicText:
          "探索音乐作品与全新的声音体验。",
      
        featuredProductionsTitle: "制作",
        featuredProductionsText:
          "提供创意制作、声音设计与全新表达形式的制作服务。",
      
        aboutTag: "关于 héReSonare",
        aboutTitle: "让声音成为共鸣之处。",
        aboutText1:
          "héReSonare 认为声音不仅仅是传播媒介，它是连接创造力、情感、技术与人类体验的桥梁。",
        aboutText2:
          "通过艺术表达与技术创新，我们探索人与人、品牌与社区之间产生共鸣的新方式。",
        aboutCardLabel: "品牌理念",
      
        aboutStoryTitle: "品牌故事",
        aboutStoryText:
          "héReSonare 源于“共鸣”的理念，探索声音、创造力与科技如何塑造有意义的体验。",
      
        aboutMissionTitle: "使命",
        aboutMissionText:
          "创造超越边界、能够引发共鸣的体验。",
      
        aboutVisionTitle: "愿景",
        aboutVisionText:
          "成为一个通过声音、情感与创新连接人们的全球创意品牌。",
      
        contactTag: "联系我们",
        contactTitle: "一起创造新的共鸣",
        contactText:
          "无论您是创作者、合作伙伴还是创新者，我们都期待与您交流。",
        contactEmailLabel: "contact@heresonare.com",
        contactCardLabel: "联系类型",
        contactArtistsTitle: "艺人",
        contactArtistsText: "艺人管理、合作与创意机会。",
        contactPartnersTitle: "合作伙伴",
        contactPartnersText: "商务合作、品牌联动与制作项目。",
        contactVenuesTitle: "场地",
        contactVenuesText: "现场活动、场地、演出与未来舞台体验。",
        socialChannelsLabel: "官方社交平台",
        instagramLabel: "Instagram",
        xiaohongshuLabel: "小红书",
        douyinLabel: "抖音",
      
        footerSlogan: "超越边界的声音",
        footerCopyright:
          "© 2026 héReSonare. 保留所有权利。",


          pages: {
            artists: {
              tag: "héReSonare Artists",
              title: "共鸣的声音",
              description:
                "探索正在塑造未来声音的创作者与艺人。",
            },
          
            music: {
              tag: "héReSonare Music",
              title: "未来之声",
              description:
                "探索音乐作品与全新的声音体验。",
            },
          
            productions: {
              tag: "héReSonare Productions",
              title: "创意制作",
              description:
                "提供创意制作、声音设计与全新表达形式的制作服务。",
            },
          
            venues: {
              tag: "héReSonare Venues",
              title: "共鸣空间",
              description:
                "连接声音、情感与人群的现场空间。",
            },
          
            tour: {
              tag: "héReSonare Tour",
              title: "超越边界的现场体验",
              description:
                "连接艺人与观众的巡演与现场活动。",
            },
          
            video: {
              tag: "héReSonare Video",
              title: "影像与声音",
              description:
                "音乐影像、视觉创作与未来叙事。",
            },
          
            store: {
              tag: "héReSonare Store",
              title: "官方商店",
              description:
                "官方周边、音乐作品与未来收藏品。",
            },
          
            about: {
              tag: "关于 héReSonare",
              title: "让声音成为共鸣",
              description:
                "连接声音、情感与科技的创意平台。",
            },
          
            contact: {
              tag: "联系我们",
              title: "一起创造新的共鸣",
              description:
                "欢迎合作、制作与商务洽谈。",
            },
          },
      },
  } as const satisfies Record<ContentLanguage, SiteContentEntry>;

  export type SiteContent = typeof siteContent;
  export type Language = keyof typeof siteContent;
