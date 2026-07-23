import assert from "node:assert/strict";

import { getSecurityHeaders } from "../src/config/http.mjs";
import {
  auditLiveSite,
  getExpectedRoutes,
  localizeRoute,
  localeDefinitions,
  parseArguments,
  parseOrigin,
  routeShapes,
} from "./check-live-site.mjs";

const targetOrigin = "https://preview.example.com";
const canonicalOrigin = "https://heresonare.com";
const alternateOrigin = "https://www.heresonare.com";
const expectedRoutes = new Set(getExpectedRoutes());

assert.equal(expectedRoutes.size, 39);
assert.equal(localizeRoute("/", "en"), "/en");
assert.equal(localizeRoute("/about", "zh-cn"), "/zh-cn/about");
assert.equal(
  parseOrigin("https://heresonare.com/", "test origin"),
  canonicalOrigin,
);
assert.equal(
  parseOrigin("http://127.0.0.1:3100", "local origin", {
    allowHttpLocal: true,
  }),
  "http://127.0.0.1:3100",
);

for (const invalidCase of [
  () => parseOrigin("heresonare.com", "test origin"),
  () => parseOrigin("http://heresonare.com", "test origin"),
  () => parseOrigin("https://user:pass@heresonare.com", "test origin"),
  () => parseOrigin("https://heresonare.com/en", "test origin"),
  () => parseOrigin("https://heresonare.com/?preview=1", "test origin"),
  () => parseOrigin("https://heresonare.com/#preview", "test origin"),
  () => parseArguments([]),
  () => parseArguments(["--target"]),
  () => parseArguments(["--target", canonicalOrigin, "--unknown"]),
  () =>
    parseArguments([
      "--target",
      canonicalOrigin,
      "--alternate",
      canonicalOrigin,
    ]),
]) {
  assert.throws(invalidCase);
}

assert.deepEqual(
  parseArguments([
    "--target",
    targetOrigin,
    "--canonical",
    canonicalOrigin,
    "--alternate",
    alternateOrigin,
  ]),
  {
    help: false,
    targetOrigin,
    canonicalOrigin,
    alternateOrigin,
    requireHsts: false,
  },
);

const securityHeaders = Object.fromEntries(
  getSecurityHeaders("production").map(({ key, value }) => [key, value]),
);

function createHeaders(values = {}) {
  return {
    ...securityHeaders,
    ...values,
  };
}

function createHtml(pathname) {
  const localeDefinition = localeDefinitions.find(
    ({ locale }) =>
      pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  assert.ok(localeDefinition);
  const routeShape =
    pathname === `/${localeDefinition.locale}`
      ? "/"
      : pathname.slice(localeDefinition.locale.length + 1);
  assert.ok(routeShapes.includes(routeShape));

  const canonicalUrl = `${canonicalOrigin}${pathname}`;
  const alternates = [
    ...localeDefinitions.map(
      ({ locale, hrefLang }) =>
        `<link rel="alternate" hrefLang="${hrefLang}" href="${canonicalOrigin}${localizeRoute(routeShape, locale)}">`,
    ),
    `<link rel="alternate" hrefLang="x-default" href="${canonicalOrigin}${localizeRoute(routeShape, "en")}">`,
  ].join("");
  const socialBase = `${canonicalOrigin}/${localeDefinition.locale}`;
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        url: canonicalUrl,
        inLanguage: localeDefinition.htmlLang,
      },
    ],
  });

  return [
    `<!doctype html><html lang="${localeDefinition.htmlLang}"><head>`,
    `<title>Fixture ${pathname}</title>`,
    '<meta name="description" content="Fixture description">',
    `<link rel="canonical" href="${canonicalUrl}">`,
    alternates,
    `<meta property="og:url" content="${canonicalUrl}">`,
    '<meta name="robots" content="index, follow">',
    `<meta property="og:image" content="${socialBase}/opengraph-image/brand-share">`,
    `<meta name="twitter:image" content="${socialBase}/twitter-image/brand-share">`,
    `<script type="application/ld+json">${structuredData}</script>`,
    "</head><body><main id=\"main-content\">Fixture</main></body></html>",
  ].join("");
}

function createPng() {
  const buffer = Buffer.alloc(24);
  Buffer.from("89504e470d0a1a0a", "hex").copy(buffer, 0);
  buffer.writeUInt32BE(1200, 16);
  buffer.writeUInt32BE(630, 20);
  return buffer;
}

function createFixtureFetch({ brokenHealth = false } = {}) {
  return async function fixtureFetch(input, options = {}) {
    const url = new URL(input);

    if (url.origin === alternateOrigin) {
      return new Response(null, {
        status: 308,
        headers: {
          location: `${canonicalOrigin}${url.pathname}${url.search}`,
        },
      });
    }

    assert.equal(url.origin, targetOrigin);

    if (url.pathname === "/robots.txt") {
      return new Response(
        [
          "User-Agent: *",
          "Allow: /",
          "Disallow: /api/",
          `Host: ${canonicalOrigin}`,
          `Sitemap: ${canonicalOrigin}/sitemap.xml`,
        ].join("\n"),
        {
          status: 200,
          headers: createHeaders({
            "cache-control": "public, max-age=0, must-revalidate",
            "content-type": "text/plain",
          }),
        },
      );
    }

    if (url.pathname === "/sitemap.xml") {
      const entries = [...expectedRoutes]
        .map((route) => `<url><loc>${canonicalOrigin}${route}</loc></url>`)
        .join("");
      return new Response(`<urlset>${entries}</urlset>`, {
        status: 200,
        headers: createHeaders({
          "cache-control": "public, max-age=0, must-revalidate",
          "content-type": "application/xml",
        }),
      });
    }

    if (
      /\/(?:opengraph-image|twitter-image)\/brand-share$/u.test(url.pathname)
    ) {
      return new Response(createPng(), {
        status: 200,
        headers: createHeaders({ "content-type": "image/png" }),
      });
    }

    if (url.pathname === "/api/health") {
      return Response.json(brokenHealth ? { status: "degraded" } : { status: "ok" }, {
        status: 200,
        headers: createHeaders({ "cache-control": "no-store" }),
      });
    }

    if (url.pathname.includes("domain-readiness-not-found")) {
      return new Response(
        '<html><head><meta name="robots" content="noindex"></head></html>',
        {
          status: 404,
          headers: createHeaders({
            "cache-control":
              "private, no-cache, no-store, max-age=0, must-revalidate",
            "content-type": "text/html",
          }),
        },
      );
    }

    const redirectCases = new Map([
      ["/", "/ja"],
      ["/about", "/zh-cn/about"],
      ["/music", "/en/music"],
    ]);
    if (redirectCases.has(url.pathname)) {
      assert.equal(options.redirect, "manual");
      return new Response(null, {
        status: 307,
        headers: createHeaders({
          location: `${targetOrigin}${redirectCases.get(url.pathname)}`,
        }),
      });
    }

    if (expectedRoutes.has(url.pathname)) {
      return new Response(createHtml(url.pathname), {
        status: 200,
        headers: createHeaders({
          "cache-control": "s-maxage=31536000",
          "content-type": "text/html; charset=utf-8",
        }),
      });
    }

    return new Response("Unexpected fixture request", {
      status: 500,
      headers: createHeaders(),
    });
  };
}

const passingResult = await auditLiveSite({
  targetOrigin,
  canonicalOrigin,
  alternateOrigin,
  fetchImpl: createFixtureFetch(),
});
assert.deepEqual(passingResult.failures, []);
assert.equal(passingResult.warnings.length, 1);
assert.equal(passingResult.summary.publicRoutes, 39);
assert.equal(passingResult.summary.socialImages, 6);
assert.equal(passingResult.summary.alternateChecked, true);

const failingResult = await auditLiveSite({
  targetOrigin,
  canonicalOrigin,
  fetchImpl: createFixtureFetch({ brokenHealth: true }),
});
assert.ok(
  failingResult.failures.some((failure) => failure.includes("/api/health")),
);

const hstsResult = await auditLiveSite({
  targetOrigin,
  canonicalOrigin,
  requireHsts: true,
  fetchImpl: createFixtureFetch(),
});
assert.ok(
  hstsResult.failures.some((failure) =>
    failure.includes("Strict-Transport-Security"),
  ),
);

console.log(
  `Live site audit contract passed (${passingResult.summary.publicRoutes} routes, ${passingResult.summary.socialImages} social images, invalid health and missing required HSTS rejected).`,
);
