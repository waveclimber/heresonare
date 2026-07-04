import type { Language } from "@/data/siteContent";

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
            href: "/artists",
            image: "/images/placeholders/artist-01.jpg",
            links: [{ label: "Profile", href: "/artists" }],
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
            href: "/artists",
            image: "/images/placeholders/artist-02.jpg",
            links: [{ label: "Profile", href: "/artists" }],
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
            href: "/music",
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
            href: "/music",
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
            href: "/productions",
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
            href: "/productions",
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
            href: "/productions",
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
            href: "/tour",
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
            href: "/venues",
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
            href: "/video",
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
            href: "/store",
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
        title: "????????????",
        description:
          "????????????????????????????????????????????????",
      },
      sections: [
        {
          label: "????",
          title: "????????",
          description:
            "???????????????????????????????????????",
          items: [
            {
              title: "?????? 01",
              role: "??????????",
              subtitle: "??????????",
              status: "???",
              description:
                "???????????????????????????",
              links: [{ label: "??????" }],
            },
            {
              title: "?????? 02",
              role: "??????? / ???",
              subtitle: "??????? / ???",
              status: "???",
              description:
                "???????????????????????????????????????",
              links: [{ label: "??????" }],
            },
          ],
        },
      ],
    },
    music: {
      hero: {
        tag: "h\u00e9ReSonare Music",
        title: "?????????",
        description:
          "??????????????????????????????????????????",
      },
      sections: [
        {
          label: "????",
          title: "??????",
          items: [
            {
              title: "Resonance 01",
              type: "????",
              subtitle: "????",
              status: "????",
              description:
                "??????????????????????????????",
              year: "2026",
            },
            {
              title: "Blue Signal",
              type: "EP",
              subtitle: "EP",
              status: "?????",
              description:
                "????????????????????????????????????????????",
              year: "2026",
            },
          ],
        },
      ],
    },
    productions: {
      hero: {
        tag: "h\u00e9ReSonare Productions",
        title: "????????",
        description:
          "Audio Innovation?Creative Platform?Live Experience??????????????????????????????????",
      },
      sections: [
        {
          label: "?????",
          title: "????????????",
          description:
            "??????????????????????????????????????????????????????",
          items: [
            {
              title: "Audio Innovation",
              category: "????????????????",
              type: "???????????",
              subtitle: "????????????????",
              status: "?????",
              description:
                "??????????????????????????????????????????????????",
              features: [
                "???????????",
                "????????????",
                "??????????????????",
              ],
              useCases: [
                "????????",
                "?????????????????",
                "?????????????????????",
              ],
              specs: [
                { label: "??", value: "???????????????" },
                { label: "??", value: "?????" },
              ],
            },
            {
              title: "Creative Platform",
              category: "Creative Platform?????",
              type: "????????",
              subtitle: "Creative Platform?????",
              status: "???",
              description:
                "???????????????????????????????????????Creative Platform??????",
              features: [
                "??????????????",
                "????????????",
                "??????????",
              ],
              useCases: [
                "???????????????",
                "????????????",
                "????????????????",
              ],
              specs: [
                { label: "??", value: "Web?????????????" },
                { label: "??", value: "???" },
              ],
            },
            {
              title: "Live Experience",
              category: "Live Experience?????",
              type: "??????",
              subtitle: "Live Experience?????",
              status: "?????",
              description:
                "????????????????????????????Live Experience?????????",
              features: [
                "??????????????",
                "????????????????????",
                "?????????????",
              ],
              useCases: [
                "???????",
                "????????",
                "????????????????",
              ],
              specs: [
                { label: "??", value: "??????" },
                { label: "??", value: "?????" },
              ],
            },
          ],
        },
      ],
    },
    tour: {
      hero: {
        tag: "h\u00e9ReSonare Tour",
        title: "?????????",
        description:
          "??????????????????????????????????????????",
      },
      sections: [
        {
          label: "???",
          title: "?????",
          comingSoon: {
            label: "\u8fd1\u65e5\u516c\u958b",
            title: "??????????????",
            description:
              "?????????????????????????????????",
            cta: { label: "??????" },
          },
          items: [
            {
              title: "??????????",
              subtitle: "????",
              status: "???",
              description:
                "?????????????????????????????????",
              date: "??",
              location: "??",
            },
          ],
        },
      ],
    },
    venues: {
      hero: {
        tag: "h\u00e9ReSonare Venues",
        title: "?????????",
        description:
          "??????????????????????????????????????",
      },
      sections: [
        {
          label: "??",
          title: "???????",
          items: [
            {
              title: "Resonance Room",
              type: "???????",
              subtitle: "???????",
              status: "?????",
              description:
                "?????????????????????????????????????",
              location: "??",
            },
          ],
        },
      ],
    },
    video: {
      hero: {
        tag: "h\u00e9ReSonare Video",
        title: "?????????????",
        description:
          "??????????????????????????????????????????",
      },
      sections: [
        {
          label: "??",
          title: "????????",
          items: [
            {
              title: "Signal Film",
              type: "????????",
              subtitle: "????????",
              status: "???",
              description:
                "?????????????????????????????????",
              year: "2026",
            },
          ],
        },
      ],
    },
    store: {
      hero: {
        tag: "h\u00e9ReSonare Store",
        title: "?????",
        description:
          "?????????????????????????????????????????",
      },
      sections: [
        {
          label: "???",
          title: "???????",
          comingSoon: {
            label: "\u8fd1\u65e5\u516c\u958b",
            title: "????????",
            description:
              "????????????????????????????????????????????????",
          },
          items: [
            {
              title: "??????",
              type: "???",
              subtitle: "???",
              status: "????",
              description:
                "?????????????????????????????????????",
            },
          ],
        },
      ],
    },
    about: {
      hero: {
        tag: "About h\u00e9ReSonare",
        title: "???????????",
        description:
          "??????????????????????????????????????????",
      },
      sections: [
        {
          label: "????????",
          title: "??????",
          items: [
            {
              title: "?????",
              subtitle: "????",
              description:
                "???????????????????????????????????????????",
            },
            {
              title: "?????",
              subtitle: "??",
              description: "????????????????????",
            },
          ],
        },
      ],
    },
    contact: {
      hero: {
        tag: "Contact",
        title: "??????????",
        description:
          "?????????????????????????????????????????????",
      },
      sections: [
        {
          label: "??????",
          title: "????????",
          items: [
            {
              title: "??????",
              subtitle: "????????",
              description:
                "?????????????????????????????????????",
              links: [{ label: "???" }],
            },
            {
              title: "?????",
              subtitle: "????",
              description:
                "??????????????????????????????????????????",
              links: [{ label: "???" }],
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
        title: "???????????",
        description: "??????????????????????????",
      },
      sections: [
        {
          label: "????",
          title: "?????",
          description: "????????????????????",
          items: [
            {
              title: "??? 01",
              role: "????",
              subtitle: "????",
              status: "???",
              description: "???????????????????",
              links: [{ label: "??" }],
            },
            {
              title: "??? 02",
              role: "??? / ???",
              subtitle: "??? / ???",
              status: "???",
              description: "????????????????????????",
              links: [{ label: "??" }],
            },
          ],
        },
      ],
    },
    music: {
      hero: {
        tag: "h\u00e9ReSonare Music",
        title: "???????",
        description: "?????????????????????????",
      },
      sections: [
        {
          label: "??",
          title: "????",
          items: [
            {
              title: "Resonance 01",
              type: "??",
              subtitle: "??",
              status: "????",
              description: "????????????????????",
              year: "2026",
            },
            {
              title: "Blue Signal",
              type: "EP",
              subtitle: "EP",
              status: "????",
              description: "???????????????????????",
              year: "2026",
            },
          ],
        },
      ],
    },
    productions: {
      hero: {
        tag: "h\u00e9ReSonare Productions",
        title: "???",
        description:
          "??Audio Innovation?Creative Platform?Live Experience????????????????",
      },
      sections: [
        {
          label: "??",
          title: "?????",
          description:
            "????????????????????????????????",
          items: [
            {
              title: "Audio Innovation",
              category: "??????",
              type: "????",
              subtitle: "??????",
              status: "????",
              description:
                "??????????????????????????????",
              features: [
                "??????",
                "??????",
                "???????????",
              ],
              useCases: [
                "?????",
                "????",
                "?????????",
              ],
              specs: [
                { label: "??", value: "???????" },
                { label: "??", value: "????" },
              ],
            },
            {
              title: "Creative Platform",
              category: "Creative Platform??",
              type: "??",
              subtitle: "Creative Platform??",
              status: "???",
              description:
                "??????????????????????????Creative Platform???",
              features: [
                "????????",
                "???????",
                "???????",
              ],
              useCases: [
                "?????",
                "????????",
                "???????",
              ],
              specs: [
                { label: "??", value: "Web????" },
                { label: "??", value: "???" },
              ],
            },
            {
              title: "Live Experience",
              category: "Live Experience??",
              type: "????",
              subtitle: "Live Experience??",
              status: "???",
              description: "??????????????????Live Experience????",
              features: [
                "?????????",
                "???????",
                "??????",
              ],
              useCases: [
                "?????",
                "????",
                "???????",
              ],
              specs: [
                { label: "??", value: "????" },
                { label: "??", value: "???" },
              ],
            },
          ],
        },
      ],
    },
    tour: {
      hero: {
        tag: "h\u00e9ReSonare Tour",
        title: "???????",
        description: "???????????????????????????",
      },
      sections: [
        {
          label: "??",
          title: "????",
          comingSoon: {
            label: "\u5373\u5c06\u516c\u5f00",
            title: "????????",
            description: "??????????????????????????",
            cta: { label: "??" },
          },
          items: [
            {
              title: "??????",
              subtitle: "???",
              status: "???",
              description: "?????????????????????",
              date: "??",
              location: "??",
            },
          ],
        },
      ],
    },
    venues: {
      hero: {
        tag: "h\u00e9ReSonare Venues",
        title: "???????",
        description: "?????????????????????????",
      },
      sections: [
        {
          label: "??",
          title: "????",
          items: [
            {
              title: "Resonance Room",
              type: "????",
              subtitle: "????",
              status: "????",
              description: "?????????????????????",
              location: "??",
            },
          ],
        },
      ],
    },
    video: {
      hero: {
        tag: "h\u00e9ReSonare Video",
        title: "????????",
        description: "????????????????????????",
      },
      sections: [
        {
          label: "??",
          title: "????",
          items: [
            {
              title: "Signal Film",
              type: "??",
              subtitle: "??",
              status: "???",
              description: "???????????????????",
              year: "2026",
            },
          ],
        },
      ],
    },
    store: {
      hero: {
        tag: "h\u00e9ReSonare Store",
        title: "????",
        description: "????????????????????????",
      },
      sections: [
        {
          label: "??",
          title: "??????",
          comingSoon: {
            label: "\u5373\u5c06\u4e0a\u7ebf",
            title: "???????",
            description:
              "??????????????????????????????????",
          },
          items: [
            {
              title: "????",
              type: "????",
              subtitle: "????",
              status: "????",
              description: "????????????????????",
            },
          ],
        },
      ],
    },
    about: {
      hero: {
        tag: "About h\u00e9ReSonare",
        title: "?????????",
        description: "?????????????????????",
      },
      sections: [
        {
          label: "??",
          title: "????",
          items: [
            {
              title: "??",
              subtitle: "??",
              description: "??????????????????????",
            },
            {
              title: "??",
              subtitle: "??",
              description: "?????????????????",
            },
          ],
        },
      ],
    },
    contact: {
      hero: {
        tag: "Contact",
        title: "??????",
        description: "??????????????????????????",
      },
      sections: [
        {
          label: "??",
          title: "????",
          items: [
            {
              title: "???",
              subtitle: "??",
              description: "????????????????????",
              links: [{ label: "??" }],
            },
            {
              title: "????",
              subtitle: "??",
              description: "????????????????????????",
              links: [{ label: "??" }],
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

function localizeItem(
  item: PageContentItem,
  localizedItem: LocalizedPageContentItem,
  context: string
): PageContentItem {
  return {
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
  };
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

  return {
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
  };
}

function localizeSection(
  section: PageSectionContent,
  localizedSection: LocalizedPageSectionContent,
  context: string
): PageSectionContent {
  return {
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
  };
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

export const pageContent = {
  EN: englishPages,
  JP: localizePages(localizedPages.JP),
  CN: localizePages(localizedPages.CN),
} satisfies PageContentByLanguage;
