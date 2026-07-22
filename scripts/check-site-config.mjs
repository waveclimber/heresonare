import assert from "node:assert/strict";

import {
  defaultSiteOrigin,
  parseSiteUrl,
  resolveSiteUrlFromEnvironment,
} from "../src/config/site.mjs";

const activeSiteUrl = resolveSiteUrlFromEnvironment({
  ...process.env,
  NODE_ENV: "production",
});

assert.equal(
  resolveSiteUrlFromEnvironment({ NODE_ENV: "production" }).origin,
  defaultSiteOrigin,
);
assert.equal(
  resolveSiteUrlFromEnvironment({
    NODE_ENV: "development",
    SITE_URL: "http://localhost:3108",
  }).origin,
  "http://localhost:3108",
);
assert.equal(
  resolveSiteUrlFromEnvironment({
    NODE_ENV: "production",
    NEXT_PUBLIC_SITE_URL: "https://example.com",
  }).origin,
  "https://example.com",
);
assert.equal(
  resolveSiteUrlFromEnvironment({
    NODE_ENV: "production",
    SITE_URL: "https://example.com/",
    NEXT_PUBLIC_SITE_URL: "https://example.com",
  }).origin,
  "https://example.com",
);

const invalidCases = [
  {
    label: "relative URL",
    run: () => parseSiteUrl("heresonare.com", "production"),
  },
  {
    label: "unsupported protocol",
    run: () => parseSiteUrl("ftp://heresonare.com", "production"),
  },
  {
    label: "credentials",
    run: () => parseSiteUrl("https://user:password@heresonare.com", "production"),
  },
  {
    label: "path",
    run: () => parseSiteUrl("https://heresonare.com/en", "production"),
  },
  {
    label: "query",
    run: () => parseSiteUrl("https://heresonare.com/?preview=1", "production"),
  },
  {
    label: "fragment",
    run: () => parseSiteUrl("https://heresonare.com/#contact", "production"),
  },
  {
    label: "production HTTP",
    run: () => parseSiteUrl("http://heresonare.com", "production"),
  },
  {
    label: "empty SITE_URL",
    run: () =>
      resolveSiteUrlFromEnvironment({ NODE_ENV: "production", SITE_URL: " " }),
  },
  {
    label: "conflicting variables",
    run: () =>
      resolveSiteUrlFromEnvironment({
        NODE_ENV: "production",
        SITE_URL: "https://heresonare.com",
        NEXT_PUBLIC_SITE_URL: "https://www.heresonare.com",
      }),
  },
];

for (const invalidCase of invalidCases) {
  assert.throws(invalidCase.run, undefined, invalidCase.label);
}

console.log(
  `Site configuration contract passed for ${activeSiteUrl.origin} (${invalidCases.length} invalid cases rejected).`,
);
