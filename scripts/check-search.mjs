import assert from "node:assert/strict";
import { normalizeSearchText, parseSearchIndex, searchEntries } from "../src/lib/siteSearch.mjs";

const base = { label: "Page", title: "héReSonare", description: "Creative music", keywords: "", kind: "page", status: "" };
const entries = [
  { ...base, href: "/en/music", title: "Music", description: "Audio Innovation concepts", keywords: "Resonance 01" },
  { ...base, href: "/en/productions/audio-innovation", title: "Audio Innovation", description: "Spatial sound", kind: "production", status: "Concept" },
  { ...base, href: "/en/about" },
  { ...base, href: "/en/contact", title: "Contact", description: "Partnership inquiries" },
];
assert.equal(normalizeSearchText("  ＡＵＤＩＯ héReSonare  "), "audio heresonare");
assert.equal(searchEntries(entries, "audio innovation")[0].href, "/en/productions/audio-innovation");
assert.equal(searchEntries(entries, "ＡＵＤＩＯ")[0].href, "/en/productions/audio-innovation");
assert.equal(searchEntries(entries, "heresonare")[0].href, "/en/about");
assert.deepEqual(searchEntries(entries, "music resonance 01").map(({ href }) => href), ["/en/music"]);
assert.deepEqual(searchEntries(entries, "missing-keyword"), []);
assert.deepEqual(searchEntries(entries, "[.*]+?"), []);
assert.deepEqual(searchEntries(entries, "audio unknown"), []);
assert.deepEqual(searchEntries(entries, "\n\t "), entries);
assert.equal(searchEntries(Array.from({ length: 12 }, () => entries[0]), "").length, 6);
assert.deepEqual(searchEntries([{ ...base, href: "/en/music" }, { ...base, href: "/en/about" }], "creative").map(({ href }) => href), ["/en/music", "/en/about"], "Equal scores must keep source ordering.");
assert.deepEqual(searchEntries(entries, `audio${" ".repeat(115)}missing`), searchEntries(entries, "audio"), "Queries must stay within the public input limit.");
assert.equal(searchEntries([{ ...base, href: "/zh-cn/music", title: "音乐", description: "新音乐正在筹备" }], "音乐").length, 1);
assert.equal(searchEntries([{ ...base, href: "/ja/artists", title: "アーティスト", description: "コラボレーション" }], "ｱｰﾃｨｽﾄ").length, 1);

assert.deepEqual(parseSearchIndex({ locale: "en", entries }, "en"), entries);
for (const href of ["https://example.com", "//example.com", "/ja/music", "/en/../api/locale", "/en/%2e%2e/api", "/en/music?private=1", "/en/music#missing", "javascript:alert(1)"]) {
  assert.throws(() => parseSearchIndex({ locale: "en", entries: [{ ...base, href }] }, "en"), `Reject ${href}`);
}
assert.throws(() => parseSearchIndex({ locale: "ja", entries }, "en"));
assert.throws(() => parseSearchIndex({ locale: "en", entries: [entries[0], entries[0]] }, "en"));
assert.throws(() => parseSearchIndex({ locale: "en", entries: [{ ...entries[0], title: null }] }, "en"));
assert.throws(() => parseSearchIndex({ locale: "en", entries: [{ ...entries[0], title: " " }] }, "en"));
assert.throws(() => parseSearchIndex({ locale: "en", entries: [{ ...entries[0], keywords: "x".repeat(20001) }] }, "en"));
assert.throws(() => parseSearchIndex({ locale: "en", entries: Array(51).fill(entries[0]) }, "en"));

console.log("Search checks passed: ranked multilingual matching, full-width input, stable results, empty states, and safe index parsing.");
