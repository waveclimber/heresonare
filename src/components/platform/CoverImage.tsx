import type { Entry, Locale } from "@/platform/domain";
export default function CoverImage({
  cover,
  locale,
}: {
  cover: Entry["cover"];
  locale: Locale;
}) {
  if (!cover) return null;
  // Images are normalized, bounded and served by the authenticated/published media route.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/api/platform/media/${cover.id}`}
      alt={cover.alt[locale]}
      width={1600}
      height={1000}
      loading="lazy"
      decoding="async"
      style={{
        width: "100%",
        height: "auto",
        aspectRatio: "8 / 5",
        objectFit: "cover",
        borderRadius: 12,
      }}
    />
  );
}
