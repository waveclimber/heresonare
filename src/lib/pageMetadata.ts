import type { Metadata } from "next";
import { pageContent, type PageKey } from "@/data/pageContent";

const BRAND_NAME = "h\u00e9ReSonare";

const routeTitles = {
  artists: "Artists",
  music: "Music",
  productions: "Productions",
  tour: "Tour",
  venues: "Venues",
  video: "Video",
  store: "Store",
  about: "About",
  contact: "Contact",
} satisfies Record<PageKey, string>;

function buildMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: BRAND_NAME,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export function createHomeMetadata(): Metadata {
  return buildMetadata(
    `${BRAND_NAME} | Sound Beyond Boundaries`,
    "An entertainment and creative platform where music, artists and imagination come together."
  );
}

export function createPageMetadata(pageKey: PageKey): Metadata {
  const page = pageContent.EN[pageKey];

  return buildMetadata(
    `${routeTitles[pageKey]} | ${BRAND_NAME}`,
    page.hero.description
  );
}
