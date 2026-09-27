import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
import {
  buildInquiryDraft,
  buildInquiryTextDownload,
  inquiryEmail,
  inquiryLimits,
  resolveInquiryContext,
  validateInquiry,
} from "../src/lib/inquiry.mjs";

// Compile the actual localized copy; its imports are type-only.
const localizedModule = ts.transpileModule(readFileSync(new URL("../src/data/inquiryContent.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.ESNext },
}).outputText;
const { inquiryContent } = await import(`data:text/javascript;base64,${Buffer.from(localizedModule).toString("base64")}`);
const concepts = [{ slug: "audio-innovation", title: "Audio Innovation" }];
const fields = { topic: "production", concept: "audio-innovation", name: "Test visitor", email: "visitor@example.com", message: "A live music project." };

assert.deepEqual(validateInquiry(fields, concepts), {});
assert.deepEqual(validateInquiry({ ...fields, name: "", email: "" }, concepts), {});
assert.equal(validateInquiry({ ...fields, message: " \n " }, concepts).message, "required");
for (const email of ["missing-at", "a@@example.com", "a@", "a@example.com\r\nBcc:test@example.com"]) {
  assert.equal(validateInquiry({ ...fields, email }, concepts).email, "invalidEmail");
}
for (const field of ["name", "email", "message"]) {
  const value = field === "email" ? `${"a".repeat(inquiryLimits.email)}@example.com` : "x".repeat(inquiryLimits[field] + 1);
  assert.equal(validateInquiry({ ...fields, [field]: value }, concepts)[field], "tooLong");
}
assert.equal(validateInquiry({ ...fields, topic: "__proto__" }, concepts).topic, "invalidChoice");
assert.equal(validateInquiry({ ...fields, concept: "unknown" }, concepts).concept, "invalidChoice");
assert.throws(() => buildInquiryDraft({ ...fields, message: "" }, inquiryContent.EN, concepts));
assert.deepEqual(resolveInquiryContext(null, null, concepts), { topic: "general", concept: "" });
assert.deepEqual(resolveInquiryContext("artists", null, concepts), { topic: "artists", concept: "" });
assert.deepEqual(resolveInquiryContext("general", "audio-innovation", concepts), { topic: "production", concept: "audio-innovation" });
assert.deepEqual(resolveInquiryContext("javascript:alert(1)", "<script>untrusted</script>", concepts), { topic: "general", concept: "" });

for (const language of ["EN", "JP", "CN"]) {
  const labels = inquiryContent[language];
  const message = "音乐 / 音楽 & sound? = 50% #1 🎶\nhttps://example.com/?a=1&b=2";
  const draft = buildInquiryDraft({ ...fields, message }, labels, concepts);
  assert.ok(draft.href);
  const url = new URL(draft.href);
  assert.equal(url.protocol, "mailto:");
  assert.equal(url.pathname, inquiryEmail);
  assert.deepEqual([...url.searchParams.keys()], ["subject", "body"]);
  assert.equal(url.searchParams.get("subject"), `${labels.subjectPrefix}: Audio Innovation`);
  assert.equal(url.searchParams.get("body"), draft.body);
  assert.ok(draft.body.endsWith(message.replace(/\r\n|\r|\n/gu, "\r\n")));
  assert.ok(draft.text.includes(`${labels.recipient}: ${inquiryEmail}`));
  assert.ok(draft.text.includes(`${labels.email}: visitor@example.com`));
  const download = buildInquiryTextDownload(draft);
  assert.equal(download.filename, "heresonare-inquiry.txt");
  assert.ok(download.href.startsWith("data:text/plain;charset=utf-8,%EF%BB%BF"));
  const downloadedText = decodeURIComponent(download.href.slice(download.href.indexOf(",") + 1));
  assert.equal(downloadedText, `\uFEFF${draft.text.replace(/\r\n|\r|\n/gu, "\r\n")}\r\n`);
  assert.ok(!downloadedText.replaceAll("\r\n", "").includes("\n"), "Downloaded text should use consistent desktop-editor line endings.");

  const generic = buildInquiryDraft({ ...fields, topic: "artists", name: "", email: "" }, labels, concepts);
  assert.equal(generic.subject, `${labels.subjectPrefix}: ${labels.topics.artists}`);
  assert.ok(!generic.body.includes("Audio Innovation"), "A hidden concept must not leak into a different inquiry topic.");
  assert.ok(!generic.body.includes(`${labels.email}:`));

  const longMessage = "音".repeat(inquiryLimits.message);
  const longDraft = buildInquiryDraft({ ...fields, message: longMessage }, labels, concepts);
  assert.equal(longDraft.href, null);
  assert.ok(longDraft.text.endsWith(longMessage), "Long drafts must remain complete for copying.");
  const longDownload = buildInquiryTextDownload(longDraft);
  assert.ok(decodeURIComponent(longDownload.href).endsWith(`${longMessage}\r\n`), "Long messages must remain complete in text downloads.");
  assert.equal(new URL(longDownload.href).protocol, "data:", "Downloads must not send the draft to a remote endpoint.");
  assert.doesNotThrow(() => buildInquiryDraft({ ...fields, message: "A lone surrogate: \uD800" }, labels, concepts));
  const multiline = buildInquiryDraft({ ...fields, message: "one\rtwo\nthree\r\nfour" }, labels, concepts);
  assert.ok(new URL(multiline.href).searchParams.get("body").endsWith("one\r\ntwo\r\nthree\r\nfour"));
}

const unusualText = buildInquiryDraft({ ...fields, message: '<script>alert("text only")</script> & 100% #?\nEmoji: 🎶\nUnpaired: \uD800' }, inquiryContent.CN, concepts);
const unusualDownload = buildInquiryTextDownload(unusualText);
assert.ok(!unusualDownload.href.includes("<script>"));
assert.ok(decodeURIComponent(unusualDownload.href).includes('alert("text only")'));
assert.ok(decodeURIComponent(unusualDownload.href).includes("Unpaired: \uFFFD"));
assert.ok(!unusualDownload.filename.includes(fields.name));

console.log("Inquiry checks passed: validation, safe context, three-language drafts, URL encoding, and complete Unicode text downloads/long-message fallback.");
