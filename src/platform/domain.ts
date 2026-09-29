export const modules = [
  "artists",
  "music",
  "video",
  "productions",
  "tour",
  "venues",
  "store",
  "about",
  "contact",
] as const;
export type Module = (typeof modules)[number];
export const locales = ["en", "ja", "zh-cn"] as const;
export type Locale = (typeof locales)[number];
export type Translation = { title: string; summary: string; body: string };
export type Entry = {
  id: string;
  module: Module;
  slug: string;
  revision: number;
  status: "draft" | "review" | "published" | "archived";
  translations: Record<Locale, Translation>;
  category: string;
  location: string;
  startsAt: string;
  endsAt: string;
  externalUrl: string;
  price: number;
  currency: "JPY" | "USD" | "CNY";
  available: boolean;
  related: string[];
  updatedAt: string;
  featured?: boolean;
  cover?: { id: string; alt: Record<Locale, string> };
};
export type ContentRecord = {
  draft: Entry;
  published: Entry | null;
  history?: Entry[];
};
export type MediaAsset = {
  id: string;
  name: string;
  width: number;
  height: number;
  bytes: number;
  createdAt: string;
};
export type Submission = {
  id: string;
  kind: "inquiry" | "order";
  locale: Locale;
  name: string;
  email: string;
  topic: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  status: "new" | "in-progress" | "resolved" | "closed";
  revision: number;
  lines: {
    id: string;
    title: string;
    quantity: number;
    price: number;
    currency: string;
  }[];
  key: string;
  digest: string;
};
export type State = {
  version: 1;
  records: ContentRecord[];
  submissions: Submission[];
  sessions: { hash: string; expires: number; credential: string }[];
  limits: Record<string, { count: number; until: number }>;
  audit: { at: string; action: string; target: string }[];
  media?: MediaAsset[];
};
export class PlatformError extends Error {
  constructor(
    public code: string,
    public status = 400,
  ) {
    super(code);
  }
}
export function emptyState(): State {
  return {
    version: 1,
    records: [],
    submissions: [],
    sessions: [],
    limits: {},
    audit: [],
  };
}
export function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new PlatformError("invalid");
  return value as Record<string, unknown>;
}
export function text(value: unknown, max: number, required = false): string {
  if (
    typeof value !== "string" ||
    value.length > max ||
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/u.test(value)
  )
    throw new PlatformError("invalid");
  const result = value.trim();
  if (required && !result) throw new PlatformError("invalid");
  return result;
}
export function oneOf<T extends string>(
  value: unknown,
  choices: readonly T[],
): T {
  if (typeof value !== "string" || !choices.includes(value as T))
    throw new PlatformError("invalid");
  return value as T;
}
export function safeUrl(value: unknown) {
  const result = text(value, 1000);
  if (!result) return "";
  try {
    const url = new URL(result);
    if (url.protocol !== "https:" || url.username || url.password)
      throw new Error();
    return url.href;
  } catch {
    throw new PlatformError("invalid-url");
  }
}
function date(value: unknown) {
  const result = text(value, 30);
  if (
    result &&
    (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{3})?)?(?:Z|[+-]\d{2}:\d{2})$/u.test(
      result,
    ) ||
      !Number.isFinite(Date.parse(result)))
  )
    throw new PlatformError("invalid-date");
  if (result) {
    const [year, month, day, hour, minute] = result
      .match(/^\d{4}|\d{2}/gu)!
      .slice(0, 5)
      .map(Number);
    if (
      year < 1970 ||
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > new Date(Date.UTC(year, month, 0)).getUTCDate() ||
      hour > 23 ||
      minute > 59
    )
      throw new PlatformError("invalid-date");
  }
  return result ? new Date(result).toISOString() : "";
}
export function parseEntry(
  value: unknown,
): Omit<Entry, "id" | "revision" | "status" | "updatedAt"> {
  const input = object(value);
  const section = oneOf(input.module, modules);
  const slug = text(input.slug, 80, true);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(slug))
    throw new PlatformError("invalid-slug");
  const translations = {} as Record<Locale, Translation>;
  const content = object(input.translations);
  for (const locale of locales) {
    const item = object(content[locale]);
    translations[locale] = {
      title: text(item.title, 140),
      summary: text(item.summary, 400),
      body: text(item.body, 12000),
    };
  }
  if (!locales.some((locale) => translations[locale].title))
    throw new PlatformError("invalid");
  const startsAt = date(input.startsAt),
    endsAt = date(input.endsAt);
  if (section !== "tour" && (startsAt || endsAt))
    throw new PlatformError("invalid-date");
  if (endsAt && (!startsAt || endsAt <= startsAt))
    throw new PlatformError("invalid-date");
  if (
    !Number.isSafeInteger(input.price) ||
    Number(input.price) < 0 ||
    Number(input.price) > 100000000
  )
    throw new PlatformError("invalid-price");
  if (
    typeof input.available !== "boolean" ||
    !Array.isArray(input.related) ||
    input.related.length > 12
  )
    throw new PlatformError("invalid");
  const related = [...new Set(input.related.map((id) => text(id, 36, true)))];
  let cover: Entry["cover"];
  if (input.cover) {
    const value = object(input.cover),
      alt = object(value.alt);
    const id = text(value.id, 36, true);
    if (!/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/u.test(id))
      throw new PlatformError("invalid-media");
    cover = {
      id,
      alt: Object.fromEntries(
        locales.map((locale) => [locale, text(alt[locale], 240)]),
      ) as Record<Locale, string>,
    };
  }
  if (input.featured !== undefined && typeof input.featured !== "boolean")
    throw new PlatformError("invalid");
  return {
    module: section,
    slug,
    translations,
    startsAt,
    endsAt,
    category: text(input.category, 60),
    location: text(input.location, 180),
    externalUrl: safeUrl(input.externalUrl),
    price: Number(input.price),
    currency: oneOf(input.currency, ["JPY", "USD", "CNY"]),
    available: input.available,
    related,
    featured: input.featured === true,
    ...(cover ? { cover } : {}),
  };
}
export function assertPublishable(entry: Entry, records: ContentRecord[]) {
  if (entry.cover && locales.some((locale) => !entry.cover!.alt[locale]))
    throw new PlatformError("media-alt-required");
  if (
    locales.some(
      (locale) =>
        !entry.translations[locale].title ||
        !entry.translations[locale].summary ||
        !entry.translations[locale].body,
    )
  )
    throw new PlatformError("translations-required");
  if (
    entry.module === "tour" &&
    (!entry.startsAt || !entry.endsAt || !entry.location)
  )
    throw new PlatformError("event-required");
  if (entry.module === "venues" && !entry.location)
    throw new PlatformError("location-required");
  if (entry.module === "store" && entry.available && entry.price <= 0)
    throw new PlatformError("invalid-price");
  if (
    entry.related.some(
      (id) =>
        id === entry.id ||
        !records.some((record) => record.draft.id === id && record.published),
    )
  )
    throw new PlatformError("invalid-related");
}
export function publicEntries(state: State): Entry[] {
  return state.records
    .flatMap((record) => (record.published ? [record.published] : []))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
export function recordPath(
  entry: Pick<Entry, "module" | "slug">,
  locale: Locale,
) {
  return `/${locale}/catalog/${entry.module}/${entry.slug}`;
}
export function money(price: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    price / (currency === "JPY" ? 1 : 100),
  );
}
export function calendar(entry: Entry, locale: Locale, origin: string) {
  if (entry.module !== "tour" || !entry.startsAt || !entry.endsAt)
    throw new PlatformError("not-found", 404);
  const escape = (value: string) =>
    value
      .replaceAll("\\", "\\\\")
      .replaceAll("\n", "\\n")
      .replaceAll(",", "\\,")
      .replaceAll(";", "\\;")
      .replaceAll("\r", "");
  const stamp = (value: string) =>
    new Date(value)
      .toISOString()
      .replaceAll(/[-:]/gu, "")
      .replace(/\.\d{3}/u, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//heReSonare//Events//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${entry.id}@heresonare.com`,
    `DTSTAMP:${stamp(entry.updatedAt)}`,
    `DTSTART:${stamp(entry.startsAt)}`,
    `DTEND:${stamp(entry.endsAt)}`,
    `SUMMARY:${escape(entry.translations[locale].title)}`,
    `DESCRIPTION:${escape(entry.translations[locale].summary)}`,
    `LOCATION:${escape(entry.location)}`,
    `URL:${origin}${recordPath(entry, locale)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  // RFC 5545 counts octets, not characters; never split a UTF-8 code point.
  return (
    lines
      .map((line) => {
        let result = "",
          width = 0;
        for (const char of line) {
          const size = new TextEncoder().encode(char).length;
          if (width + size > 74) {
            result += "\r\n ";
            width = 1;
          }
          result += char;
          width += size;
        }
        return result;
      })
      .join("\r\n") + "\r\n"
  );
}
