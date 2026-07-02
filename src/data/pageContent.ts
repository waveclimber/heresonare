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
  status?: string;
  href?: string;
  image?: string;
  meta?: string;
  year?: string;
  date?: string;
  location?: string;
  links?: PageLink[];
};

export type ComingSoonContent = {
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
      tag: "heReSonare Artists",
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
      tag: "heReSonare Music",
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
      tag: "heReSonare Productions",
      title: "Creative Production",
      description:
        "Reusable content for production services, sound design, and creative direction.",
    },
    sections: [
      {
        id: "services",
        label: "Services",
        title: "Production Capabilities",
        items: [
          {
            id: "service-sound-design",
            slug: "sound-design",
            title: "Sound Design",
            type: "Production",
            subtitle: "Production",
            description:
              "Sonic identity, cues, and atmospheres for brand and stage experiences.",
            status: "Available",
            href: "/productions",
          },
          {
            id: "service-creative-direction",
            slug: "creative-direction",
            title: "Creative Direction",
            type: "Strategy",
            subtitle: "Strategy",
            description:
              "Concept development for projects where sound, visuals, and story meet.",
            status: "Available",
            href: "/productions",
          },
        ],
      },
    ],
  },
  tour: {
    slug: "tour",
    hero: {
      tag: "heReSonare Tour",
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
      tag: "heReSonare Venues",
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
      tag: "heReSonare Video",
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
      tag: "heReSonare Store",
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
      tag: "About heReSonare",
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
              "Brand collaborations, production projects, and strategic partnerships.",
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

const localizedPages = {
  JP: {
    artists: {
      hero: {
        tag: "heReSonare Artists JP",
        title: "Future Artist Roster",
        description:
          "Artist profiles and collaborations prepared for Japanese content.",
      },
    },
    music: {
      hero: {
        tag: "heReSonare Music JP",
        title: "Future Sound Catalog",
        description:
          "Release and playlist content prepared for Japanese audiences.",
      },
    },
    productions: {
      hero: {
        tag: "heReSonare Productions JP",
        title: "Creative Production",
        description:
          "Production services and creative direction prepared for Japanese content.",
      },
    },
    tour: {
      hero: {
        tag: "heReSonare Tour JP",
        title: "Future Live Schedule",
        description:
          "Tour and event content prepared for Japanese announcements.",
      },
    },
    venues: {
      hero: {
        tag: "heReSonare Venues JP",
        title: "Resonance Spaces",
        description:
          "Venue and partner space content prepared for Japanese pages.",
      },
    },
    video: {
      hero: {
        tag: "heReSonare Video JP",
        title: "Visual Soundscapes",
        description:
          "Video and visual work content prepared for Japanese pages.",
      },
    },
    store: {
      hero: {
        tag: "heReSonare Store JP",
        title: "Official Store",
        description:
          "Store and product content prepared for Japanese pages.",
      },
    },
    about: {
      hero: {
        tag: "About heReSonare JP",
        title: "Sound Becomes Resonance",
        description:
          "Brand story and mission content prepared for Japanese pages.",
      },
    },
    contact: {
      hero: {
        tag: "Contact JP",
        title: "Create Resonance Together",
        description:
          "Inquiry and partnership content prepared for Japanese pages.",
      },
    },
  },
  CN: {
    artists: {
      hero: {
        tag: "heReSonare Artists CN",
        title: "Future Artist Roster",
        description:
          "Artist profiles and collaborations prepared for Chinese content.",
      },
    },
    music: {
      hero: {
        tag: "heReSonare Music CN",
        title: "Future Sound Catalog",
        description:
          "Release and playlist content prepared for Chinese audiences.",
      },
    },
    productions: {
      hero: {
        tag: "heReSonare Productions CN",
        title: "Creative Production",
        description:
          "Production services and creative direction prepared for Chinese content.",
      },
    },
    tour: {
      hero: {
        tag: "heReSonare Tour CN",
        title: "Future Live Schedule",
        description:
          "Tour and event content prepared for Chinese announcements.",
      },
    },
    venues: {
      hero: {
        tag: "heReSonare Venues CN",
        title: "Resonance Spaces",
        description:
          "Venue and partner space content prepared for Chinese pages.",
      },
    },
    video: {
      hero: {
        tag: "heReSonare Video CN",
        title: "Visual Soundscapes",
        description:
          "Video and visual work content prepared for Chinese pages.",
      },
    },
    store: {
      hero: {
        tag: "heReSonare Store CN",
        title: "Official Store",
        description:
          "Store and product content prepared for Chinese pages.",
      },
    },
    about: {
      hero: {
        tag: "About heReSonare CN",
        title: "Sound Becomes Resonance",
        description:
          "Brand story and mission content prepared for Chinese pages.",
      },
    },
    contact: {
      hero: {
        tag: "Contact CN",
        title: "Create Resonance Together",
        description:
          "Inquiry and partnership content prepared for Chinese pages.",
      },
    },
  },
} satisfies Record<
  Exclude<Language, "EN">,
  Record<PageKey, { hero: PageHeroContent }>
>;

function withLocalizedHero(
  language: Exclude<Language, "EN">
): Record<PageKey, StaticPageContent> {
  return Object.fromEntries(
    Object.entries(englishPages).map(([key, page]) => [
      key,
      {
        ...page,
        hero: localizedPages[language][key as PageKey].hero,
      },
    ])
  ) as Record<PageKey, StaticPageContent>;
}

export const pageContent = {
  EN: englishPages,
  JP: withLocalizedHero("JP"),
  CN: withLocalizedHero("CN"),
} satisfies PageContentByLanguage;
