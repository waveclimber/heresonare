export const searchQueryLimit = 120;

/** @typedef {{href: string, label: string, title: string, description: string, keywords: string, kind: "page" | "production", status: string}} SearchEntry */

/** @param {string} value */
export function normalizeSearchText(value) {
  return value.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

/** @param {SearchEntry[]} entries @param {string} query */
export function searchEntries(entries, query) {
  if (!query.trim()) return entries.slice(0, 6);
  const normalized = normalizeSearchText(query.slice(0, searchQueryLimit));
  if (!normalized) return [];
  const tokens = [...new Set(normalized.split(/\s+/u))];

  return entries.map((entry, order) => {
    const title = normalizeSearchText(`${entry.label} ${entry.title}`);
    const description = normalizeSearchText(entry.description);
    const all = `${title} ${description} ${normalizeSearchText(entry.keywords)}`;
    if (!tokens.every((token) => all.includes(token))) return { entry, order, score: 0 };
    const score = 1 + (title.includes(normalized) ? 100 : 0) + tokens.reduce((total, token) => total + (title.includes(token) ? 10 : description.includes(token) ? 3 : 1), 0);
    return { entry, order, score };
  }).filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .map(({ entry }) => entry);
}

/** @param {unknown} payload @param {string} locale @returns {SearchEntry[]} */
export function parseSearchIndex(payload, locale) {
  if (!payload || typeof payload !== "object" || !("locale" in payload) || payload.locale !== locale || !("entries" in payload) || !Array.isArray(payload.entries) || payload.entries.length > 50) {
    throw new Error("Invalid search index");
  }
  const destinations = new Set();
  for (const entry of payload.entries) {
    if (!entry || typeof entry !== "object") throw new Error("Invalid search entry");
    for (const field of ["href", "label", "title", "description", "keywords", "status"]) {
      if (typeof entry[field] !== "string" || entry[field].length > 20000) throw new Error("Invalid search text");
    }
    if (!entry.title.trim() || !entry.label.trim() || !entry.description.trim() || !["page", "production"].includes(entry.kind) || !/^\/(?:en|ja|zh-cn)(?:\/[a-z0-9-]+)*$/u.test(entry.href) || !(entry.href === `/${locale}` || entry.href.startsWith(`/${locale}/`)) || destinations.has(entry.href)) {
      throw new Error("Invalid search destination");
    }
    destinations.add(entry.href);
  }
  return payload.entries;
}
