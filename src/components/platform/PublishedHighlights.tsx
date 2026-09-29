import { editorialContent } from "@/data/editorialContent";
import { platformContent } from "@/data/platformContent";
import { getPublishedEntries } from "@/platform/server";
import { recordPath, type Locale, type Module } from "@/platform/domain";
import CoverImage from "./CoverImage";
export default async function PublishedHighlights({
  locale,
  module,
}: {
  locale: Locale;
  module?: Module;
}) {
  let entries;
  try {
    entries = (await getPublishedEntries())
      .filter((entry) => (module ? entry.module === module : entry.featured))
      .slice(0, module ? 3 : 6);
  } catch {
    console.error("platform_highlights_unavailable");
    return null;
  }
  if (!entries.length) return null;
  const c = platformContent[locale],
    e = editorialContent[locale];
  return (
    <section
      aria-label={module ? c.latest : e.featuredTitle}
      style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}
    >
      <p style={{ color: "#5eead4", letterSpacing: ".12em", fontSize: 12 }}>
        héReSonare
      </p>
      <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", margin: "12px 0" }}>
        {module ? c.latest : e.featuredTitle}
      </h2>
      <p style={{ color: "#a1a1aa", marginBottom: 24 }}>{e.featuredIntro}</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
          gap: 24,
        }}
      >
        {entries.map((entry) => (
          <article
            key={entry.id}
            style={{
              border: "1px solid #303037",
              borderRadius: 16,
              padding: 20,
              overflowWrap: "anywhere",
            }}
          >
            <CoverImage cover={entry.cover} locale={locale} />
            <h3 style={{ fontSize: 22, margin: "16px 0 10px" }}>
              <a href={recordPath(entry, locale)}>
                {entry.translations[locale].title}
              </a>
            </h3>
            <p style={{ color: "#c1c1c9", lineHeight: 1.75 }}>
              {entry.translations[locale].summary}
            </p>
            <a
              href={recordPath(entry, locale)}
              style={{
                color: "#5eead4",
                display: "inline-flex",
                alignItems: "center",
                minHeight: 44,
                marginTop: 12,
              }}
            >
              {c.details} →
            </a>
          </article>
        ))}
      </div>
      {module && (
        <a
          href={`/${locale}/catalog/${module}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            minHeight: 44,
            color: "#5eead4",
            marginTop: 20,
          }}
        >
          {c.catalog} →
        </a>
      )}
    </section>
  );
}
