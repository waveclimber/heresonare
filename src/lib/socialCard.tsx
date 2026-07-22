import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import type { SiteMetadataContent } from "@/content/contracts";
import { getSiteContent } from "@/content/repository";
import {
  contentLanguageByLocale,
  htmlLangByLocale,
  type Locale,
} from "@/i18n/config";
import { brandName } from "@/lib/siteIdentity";

export const socialCardSize = {
  width: 1200,
  height: 630,
};

export const socialCardContentType = "image/png";

const spectrumHeights = [
  10, 18, 13, 27, 46, 61, 39, 22, 12, 16, 35, 57, 44, 24, 31, 69, 51,
  28, 17, 11, 25, 48, 63, 37, 19, 14, 33, 55, 42, 26, 16, 29, 21, 12, 8,
];

const spectrumOffsets = [
  2, -3, 4, 0, -4, 2, -2, 5, 1, -4, 3, -1, 4, 0, -5, 1, 3, -2, 5,
  0, -3, 2, -4, 1, 4, -1, 3, -5, 0, 4, -2, 1, -3, 2, 0,
];

const spectrumHorizontalOffsets = [
  0, -6, 5, -3, 8, -2, 4, -7, 2, 6, -5, 3, -8, 5, -2, 7, -4, 1, -6,
  8, -3, 5, -7, 2, 6, -4, 7, -8, 3, -2, 6, -5, 4, -3, 0,
];

const spectrumWidths = [
  2, 3, 2, 3, 4, 5, 4, 3, 2, 2, 3, 4, 4, 3, 3, 5, 4, 3, 2, 2, 3, 4,
  5, 3, 2, 2, 3, 5, 4, 3, 2, 3, 2, 2, 2,
];

const spectrumAccents: Record<
  number,
  { color: string; shadow: string }
> = {
  5: {
    color: "rgba(76,186,175,0.88)",
    shadow: "0 0 16px rgba(76,186,175,0.42)",
  },
  11: {
    color: "rgba(14,108,178,0.78)",
    shadow: "0 0 14px rgba(14,108,178,0.34)",
  },
  15: {
    color: "rgba(233,43,139,0.86)",
    shadow: "0 0 18px rgba(233,43,139,0.46)",
  },
  22: {
    color: "rgba(76,186,175,0.84)",
    shadow: "0 0 16px rgba(76,186,175,0.38)",
  },
  27: {
    color: "rgba(233,43,139,0.78)",
    shadow: "0 0 15px rgba(233,43,139,0.36)",
  },
};

const orbitPoints = [
  { left: 1012, top: 116, size: 10, color: "#4CBAAF" },
  { left: 1087, top: 282, size: 7, color: "#FFCF17" },
  { left: 926, top: 445, size: 9, color: "#E92B8B" },
  { left: 778, top: 170, size: 6, color: "#0E6CB2" },
];

async function getSocialCardFonts(locale: Locale) {
  const prefix =
    locale === "en"
      ? "noto-sans-en"
      : locale === "ja"
        ? "noto-sans-jp"
        : "noto-sans-sc";
  const fontDirectory = join(
    process.cwd(),
    "src/assets/social-card-fonts",
  );
  const [regular, bold] = await Promise.all([
    readFile(join(fontDirectory, `${prefix}-400.ttf`)),
    readFile(join(fontDirectory, `${prefix}-700.ttf`)),
  ]);

  return [
    {
      name: "Social Card",
      data: Uint8Array.from(regular).buffer,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Social Card",
      data: Uint8Array.from(bold).buffer,
      weight: 700 as const,
      style: "normal" as const,
    },
  ];
}

export function getSocialCardAlt(content: SiteMetadataContent) {
  return `${brandName} — ${content.heroSubtitle}`;
}

export async function createSocialCardMetadata(locale: Locale) {
  const content = await getSiteContent(contentLanguageByLocale[locale]);

  return {
    id: "brand-share",
    alt: getSocialCardAlt(content),
    size: socialCardSize,
    contentType: socialCardContentType,
  };
}

export async function createSocialCard(locale: Locale) {
  const [content, fonts] = await Promise.all([
    getSiteContent(contentLanguageByLocale[locale]),
    getSocialCardFonts(locale),
  ]);

  const response = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          overflow: "hidden",
          color: "#ffffff",
          backgroundColor: "#06070a",
          fontFamily: "Social Card",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "radial-gradient(circle at 78% 44%, rgba(14,108,178,0.28), transparent 33%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "radial-gradient(circle at 92% 18%, rgba(233,43,139,0.18), transparent 28%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 30,
            display: "flex",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 30,
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 70,
            top: 70,
            width: 430,
            height: 62,
            display: "flex",
            alignItems: "center",
          }}
        >
          <svg
            width="58"
            height="58"
            viewBox="0 0 293.23 293.23"
            aria-hidden="true"
          >
            <g fill="#ffffff">
              <circle cx="146.62" cy="146.62" r="48.87" />
              <path d="M48.87,195.49A48.88,48.88,0,1,0,0,146.62,48.87,48.87,0,0,1,48.87,195.49Z" />
              <path d="M244.36,97.74a48.88,48.88,0,1,0,48.87,48.88A48.87,48.87,0,0,1,244.36,97.74Z" />
              <path d="M48.87,195.49a48.87,48.87,0,1,0,48.87,48.87A48.87,48.87,0,0,1,48.87,195.49Z" />
              <path d="M244.36,195.49a48.87,48.87,0,1,0,48.87,48.87A48.87,48.87,0,0,1,244.36,195.49Z" />
              <path d="M146.62,195.49a48.87,48.87,0,0,1-48.88,48.87,48.88,48.88,0,1,0,48.88-48.87Z" />
              <path d="M48.87,97.74A48.87,48.87,0,1,0,0,48.87,48.87,48.87,0,0,1,48.87,97.74Z" />
              <path d="M146.62,97.74a48.87,48.87,0,0,1,48.87-48.87,48.88,48.88,0,1,0-48.87,48.87Z" />
              <path d="M244.36,97.74a48.87,48.87,0,1,0-48.87-48.87A48.87,48.87,0,0,1,244.36,97.74Z" />
            </g>
          </svg>
          <div
            style={{
              display: "flex",
              marginLeft: 20,
              fontSize: 54,
              fontWeight: 700,
              letterSpacing: "-0.045em",
              fontFamily: "sans-serif",
            }}
          >
            {brandName}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 72,
            top: 214,
            width: 590,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#4CBAAF",
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            {content.heroEyebrow}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              maxWidth: 580,
              fontSize: locale === "en" ? 58 : 62,
              fontWeight: 700,
              lineHeight: 1.06,
              letterSpacing: locale === "en" ? "-0.035em" : "-0.02em",
            }}
          >
            {content.heroSubtitle}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              color: "rgba(255,255,255,0.62)",
              fontSize: 17,
              letterSpacing: "0.11em",
            }}
          >
            {content.heroBusinessAreas}
          </div>
        </div>

        {[420, 304, 188].map((diameter, index) => (
          <div
            key={diameter}
            style={{
              position: "absolute",
              left: 936 - diameter / 2,
              top: 298 - diameter / 2,
              width: diameter,
              height: diameter,
              display: "flex",
              borderRadius: "999px",
              border: `1px solid rgba(76,186,175,${0.12 + index * 0.08})`,
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            left: 842,
            top: 204,
            width: 188,
            height: 188,
            display: "flex",
            borderRadius: "999px",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.96) 0%, rgba(76,186,175,0.78) 18%, rgba(14,108,178,0.46) 44%, rgba(14,108,178,0) 72%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 914,
            top: 276,
            width: 44,
            height: 44,
            display: "flex",
            borderRadius: "999px",
            backgroundColor: "#ffffff",
            boxShadow: "0 0 42px rgba(76,186,175,0.9)",
          }}
        />

        {orbitPoints.map((point) => (
          <div
            key={`${point.left}-${point.top}`}
            style={{
              position: "absolute",
              left: point.left,
              top: point.top,
              width: point.size,
              height: point.size,
              display: "flex",
              borderRadius: "999px",
              backgroundColor: point.color,
              boxShadow: `0 0 18px ${point.color}`,
            }}
          />
        ))}

        <div
          style={{
            position: "absolute",
            left: 72,
            right: 72,
            bottom: 114,
            height: 1,
            display: "flex",
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.08), rgba(76,186,175,0.32), rgba(14,108,178,0.22), rgba(233,43,139,0.18), rgba(255,255,255,0.08))",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 72,
            right: 72,
            bottom: 69,
            height: 92,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {spectrumHeights.map((height, index) => {
            const accent = spectrumAccents[index];

            return (
              <div
                key={`${height}-${index}`}
                style={{
                  width: spectrumWidths[index],
                  height,
                  display: "flex",
                  borderRadius: 4,
                  backgroundColor:
                    accent?.color ?? "rgba(255,255,255,0.3)",
                  boxShadow: accent?.shadow ?? "none",
                  transform: `translate(${spectrumHorizontalOffsets[index]}px, ${spectrumOffsets[index]}px)`,
                }}
              />
            );
          })}
        </div>
        <div
          style={{
            position: "absolute",
            left: 72,
            bottom: 48,
            display: "flex",
            color: "rgba(255,255,255,0.54)",
            fontSize: 15,
            letterSpacing: "0.14em",
          }}
        >
          HERESONARE.COM · {htmlLangByLocale[locale].toUpperCase()}
        </div>
      </div>
    ),
    {
      ...socialCardSize,
      fonts,
    },
  );

  return response;
}
