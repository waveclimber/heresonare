import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const projectRoot = process.cwd();
const localeBoundary = read("src", "app", "[locale]", "error.tsx");
const globalBoundary = read("src", "app", "global-error.tsx");
const errorPage = read("src", "components", "RuntimeErrorPage.tsx");
const interfaceSource = read("src", "data", "interfaceContent.ts");

assert.match(
  localeBoundary,
  /^"use client";/u,
  "The localized runtime error boundary must remain a Client Component.",
);
assert.match(
  localeBoundary,
  /useLanguage\(\)/u,
  "The localized boundary must derive its language and home route from the active locale.",
);
assert.match(
  localeBoundary,
  /onRetry=\{unstable_retry\}/u,
  "The localized boundary must use the framework retry operation.",
);

assert.match(
  globalBoundary,
  /^"use client";/u,
  "The global runtime error boundary must remain a Client Component.",
);
assert.match(
  globalBoundary,
  /import "\.\/globals\.css";/u,
  "The global boundary must load the global design and accessibility styles.",
);
assert.match(
  globalBoundary,
  /<html\s+lang=/u,
  "The global boundary must render its replacement html element with a language.",
);
assert.match(
  globalBoundary,
  /<body>/u,
  "The global boundary must render its replacement body element.",
);
assert.match(
  globalBoundary,
  /onRetry=\{unstable_retry\}/u,
  "The global boundary must use the framework retry operation.",
);

assert.match(
  errorPage,
  /<button\s+[\s\S]*?type="button"[\s\S]*?onClick=\{onRetry\}/u,
  "The retry control must remain an explicit keyboard-accessible button.",
);
assert.match(
  errorPage,
  /href=\{homeHref\}/u,
  "The recovery screen must retain a safe route back to the localized homepage.",
);

for (const source of [localeBoundary, globalBoundary, errorPage]) {
  assert.doesNotMatch(
    source,
    /\{\s*error\.(?:message|stack|cause|digest)\s*\}/u,
    "Runtime error details must not be rendered to public visitors.",
  );
}

assert.equal(
  [...interfaceSource.matchAll(/runtimeError:\s*\{/gu)].length,
  4,
  "The runtime error contract and all three localized entries must remain aligned.",
);

console.log(
  "Runtime error recovery contract passed (localized boundary, global fallback, safe retry, no public diagnostics).",
);

function read(...segments) {
  return readFileSync(join(projectRoot, ...segments), "utf8");
}
