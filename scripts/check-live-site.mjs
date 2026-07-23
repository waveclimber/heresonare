import { isIP } from "node:net";
import { pathToFileURL } from "node:url";

import {
  getSecurityHeaders,
  noStoreCacheControl,
} from "../src/config/http.mjs";

export const localeDefinitions = [
  { locale: "en", htmlLang: "en", hrefLang: "en" },
  { locale: "ja", htmlLang: "ja", hrefLang: "ja" },
  { locale: "zh-cn", htmlLang: "zh-CN", hrefLang: "zh-CN" },
];

export const routeShapes = [
  "/",
  "/tour",
  "/artists",
  "/productions",
  "/music",
  "/video",
  "/venues",
  "/store",
  "/about",
  "/contact",
  "/productions/audio-innovation",
  "/productions/creative-platform",
  "/productions/live-experience",
];

const expectedSecurityHeaders = getSecurityHeaders("production");
const staticPageCacheControl = "s-maxage=31536000";
const discoveryCacheControl = "public, max-age=0, must-revalidate";
const notFoundCacheControl =
  "private, no-cache, no-store, max-age=0, must-revalidate";
const localHostnames = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

export function localizeRoute(shape, locale) {
  return shape === "/" ? `/${locale}` : `/${locale}${shape}`;
}

export function getExpectedRoutes() {
  return routeShapes.flatMap((shape) =>
    localeDefinitions.map(({ locale }) => localizeRoute(shape, locale)),
  );
}

function isLocalHostname(hostname) {
  if (localHostnames.has(hostname)) return true;
  if (isIP(hostname) === 4) {
    return (
      hostname.startsWith("10.") ||
      hostname.startsWith("127.") ||
      hostname.startsWith("169.254.") ||
      hostname.startsWith("192.168.") ||
      /^172\.(1[6-9]|2\d|3[01])\./u.test(hostname)
    );
  }
  return false;
}

export function parseOrigin(
  value,
  label,
  { allowHttpLocal = false } = {},
) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${label} must be an absolute URL.`);
  }

  if (url.username || url.password) {
    throw new Error(`${label} must not contain credentials.`);
  }
  if (url.pathname !== "/" || url.search || url.hash) {
    throw new Error(
      `${label} must contain only an origin without a path, query, or fragment.`,
    );
  }

  if (url.protocol === "https:") return url.origin;
  if (
    allowHttpLocal &&
    url.protocol === "http:" &&
    isLocalHostname(url.hostname)
  ) {
    return url.origin;
  }

  throw new Error(
    `${label} must use HTTPS${allowHttpLocal ? " unless it is an explicitly allowed local test target" : ""}.`,
  );
}

export function parseArguments(argv) {
  const values = new Map();
  const flags = new Set();
  const valueOptions = new Set(["--target", "--canonical", "--alternate"]);
  const flagOptions = new Set([
    "--allow-http-local",
    "--help",
    "--require-hsts",
  ]);

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (valueOptions.has(argument)) {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`${argument} requires a value.`);
      }
      if (values.has(argument)) {
        throw new Error(`${argument} must not be repeated.`);
      }
      values.set(argument, value);
      index += 1;
      continue;
    }
    if (flagOptions.has(argument)) {
      if (flags.has(argument)) {
        throw new Error(`${argument} must not be repeated.`);
      }
      flags.add(argument);
      continue;
    }
    throw new Error(`Unknown option: ${argument}`);
  }

  if (flags.has("--help")) return { help: true };

  const targetValue = values.get("--target");
  if (!targetValue) {
    throw new Error("--target is required.");
  }

  const allowHttpLocal = flags.has("--allow-http-local");
  const targetOrigin = parseOrigin(targetValue, "--target", {
    allowHttpLocal,
  });
  const canonicalOrigin = parseOrigin(
    values.get("--canonical") ?? targetOrigin,
    "--canonical",
  );
  const alternateValue = values.get("--alternate");
  const alternateOrigin = alternateValue
    ? parseOrigin(alternateValue, "--alternate")
    : undefined;

  if (alternateOrigin === canonicalOrigin) {
    throw new Error("--alternate must differ from --canonical.");
  }

  return {
    help: false,
    targetOrigin,
    canonicalOrigin,
    alternateOrigin,
    requireHsts: flags.has("--require-hsts"),
  };
}

export function getUsage() {
  return [
    "Usage:",
    "  npm run check:live -- --target <origin> [options]",
    "",
    "Options:",
    "  --canonical <origin>   Expected metadata origin (defaults to target)",
    "  --alternate <origin>   Host that must redirect to the canonical origin",
    "  --require-hsts         Fail unless a one-year HSTS policy is active",
    "  --allow-http-local     Allow an HTTP localhost target for local testing",
    "  --help                 Show this help",
    "",
    "Production example:",
    "  npm run check:live -- --target https://heresonare.com --alternate https://www.heresonare.com",
  ].join("\n");
}

function getAttribute(tag, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  const match = tag.match(
    new RegExp(`\\b${escapedName}=(["'])(.*?)\\1`, "iu"),
  );
  return match?.[2];
}

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function getTags(html, expression) {
  return [...html.matchAll(expression)].map(([tag]) => tag);
}

function getLinkTags(html, relation) {
  return getTags(html, /<link\b[^>]*>/giu).filter(
    (tag) => getAttribute(tag, "rel") === relation,
  );
}

function getMetaTags(html, attribute, value) {
  return getTags(html, /<meta\b[^>]*>/giu).filter(
    (tag) => getAttribute(tag, attribute) === value,
  );
}

function getSingleMetadataValue({
  tags,
  attribute,
  route,
  label,
  failures,
}) {
  if (tags.length !== 1) {
    failures.push(`${route} has ${tags.length} ${label} entries instead of one.`);
    return undefined;
  }
  const value = getAttribute(tags[0], attribute);
  if (!value) failures.push(`${route} has an empty ${label} value.`);
  return value ? decodeHtml(value) : undefined;
}

function checkSecurityHeaders(response, label, failures) {
  for (const expected of expectedSecurityHeaders) {
    if (response.headers.get(expected.key) !== expected.value) {
      failures.push(`${label} has an invalid ${expected.key} header.`);
    }
  }
  const policy = response.headers.get("content-security-policy") ?? "";
  if (policy.includes("'unsafe-eval'")) {
    failures.push(`${label} allows unsafe-eval in production.`);
  }
}

function checkCacheControl(response, label, expected, failures) {
  if (response.headers.get("cache-control") !== expected) {
    failures.push(`${label} has an invalid Cache-Control header.`);
  }
}

function checkHsts(response, requireHsts, failures, warnings) {
  const value = response.headers.get("strict-transport-security");
  if (!value) {
    const message =
      "The canonical host does not publish Strict-Transport-Security yet.";
    if (requireHsts) failures.push(message);
    else warnings.push(`${message} This is expected before the HTTPS soak.`);
    return;
  }

  const maxAge = Number(value.match(/(?:^|;)\s*max-age=(\d+)/iu)?.[1]);
  if (!Number.isFinite(maxAge) || maxAge < 31_536_000) {
    const message = "Strict-Transport-Security has less than a one-year max-age.";
    if (requireHsts) failures.push(message);
    else warnings.push(message);
  }
}

function getExpectedAlternates(routeShape, canonicalOrigin) {
  return Object.fromEntries([
    ...localeDefinitions.map(({ locale, hrefLang }) => [
      hrefLang,
      `${canonicalOrigin}${localizeRoute(routeShape, locale)}`,
    ]),
    ["x-default", `${canonicalOrigin}${localizeRoute(routeShape, "en")}`],
  ]);
}

function checkStructuredData({
  html,
  route,
  canonicalUrl,
  htmlLang,
  failures,
}) {
  const matches = [
    ...html.matchAll(
      /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/giu,
    ),
  ];
  if (matches.length !== 1) {
    failures.push(
      `${route} has ${matches.length} JSON-LD scripts instead of one.`,
    );
    return;
  }

  let data;
  try {
    data = JSON.parse(matches[0][1]);
  } catch {
    failures.push(`${route} contains invalid JSON-LD.`);
    return;
  }

  const graph = Array.isArray(data?.["@graph"]) ? data["@graph"] : [];
  const webPage = graph.find((node) => node?.["@type"] === "WebPage");
  if (
    data?.["@context"] !== "https://schema.org" ||
    webPage?.url !== canonicalUrl ||
    webPage?.inLanguage !== htmlLang
  ) {
    failures.push(`${route} has invalid canonical WebPage structured data.`);
  }
}

function checkPageMetadata({
  html,
  route,
  routeShape,
  htmlLang,
  canonicalOrigin,
  failures,
  socialImageUrls,
}) {
  const canonicalUrl = `${canonicalOrigin}${route}`;
  const htmlTag = html.match(/<html\b[^>]*>/iu)?.[0] ?? "";
  if (getAttribute(htmlTag, "lang") !== htmlLang) {
    failures.push(`${route} has the wrong HTML language.`);
  }
  if (!/<title>[^<]+<\/title>/iu.test(html)) {
    failures.push(`${route} is missing a title.`);
  }
  const description = getSingleMetadataValue({
    tags: getMetaTags(html, "name", "description"),
    attribute: "content",
    route,
    label: "description",
    failures,
  });
  if (!description?.trim()) failures.push(`${route} has an empty description.`);

  const canonical = getSingleMetadataValue({
    tags: getLinkTags(html, "canonical"),
    attribute: "href",
    route,
    label: "canonical link",
    failures,
  });
  if (canonical !== canonicalUrl) {
    failures.push(`${route} points canonical metadata away from ${canonicalUrl}.`);
  }

  const openGraphUrl = getSingleMetadataValue({
    tags: getMetaTags(html, "property", "og:url"),
    attribute: "content",
    route,
    label: "Open Graph URL",
    failures,
  });
  if (openGraphUrl !== canonicalUrl) {
    failures.push(`${route} has the wrong Open Graph URL.`);
  }

  const robots = getSingleMetadataValue({
    tags: getMetaTags(html, "name", "robots"),
    attribute: "content",
    route,
    label: "robots metadata",
    failures,
  });
  if (robots !== "index, follow") {
    failures.push(`${route} is not explicitly indexable.`);
  }

  const actualAlternates = Object.fromEntries(
    getLinkTags(html, "alternate").map((tag) => [
      getAttribute(tag, "hrefLang"),
      decodeHtml(getAttribute(tag, "href") ?? ""),
    ]),
  );
  const expectedAlternates = getExpectedAlternates(
    routeShape,
    canonicalOrigin,
  );
  if (Object.keys(actualAlternates).length !== 4) {
    failures.push(`${route} does not expose four language alternates.`);
  }
  for (const [hrefLang, href] of Object.entries(expectedAlternates)) {
    if (actualAlternates[hrefLang] !== href) {
      failures.push(`${route} has an invalid ${hrefLang} alternate.`);
    }
  }

  for (const definition of [
    { attribute: "property", name: "og:image", label: "Open Graph" },
    { attribute: "name", name: "twitter:image", label: "Twitter" },
  ]) {
    const imageUrl = getSingleMetadataValue({
      tags: getMetaTags(html, definition.attribute, definition.name),
      attribute: "content",
      route,
      label: `${definition.label} image`,
      failures,
    });
    if (!imageUrl) continue;
    try {
      const parsed = new URL(imageUrl);
      if (parsed.origin !== canonicalOrigin) {
        failures.push(`${route} has an off-origin ${definition.label} image.`);
      } else {
        socialImageUrls.add(parsed.toString());
      }
    } catch {
      failures.push(`${route} has an invalid ${definition.label} image URL.`);
    }
  }

  checkStructuredData({
    html,
    route,
    canonicalUrl,
    htmlLang,
    failures,
  });
}

function readPngDimensions(buffer) {
  const signature = Buffer.from("89504e470d0a1a0a", "hex");
  if (
    buffer.length < 24 ||
    !buffer.subarray(0, signature.length).equals(signature)
  ) {
    return undefined;
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

export async function auditLiveSite({
  targetOrigin,
  canonicalOrigin,
  alternateOrigin,
  requireHsts = false,
  fetchImpl = fetch,
  timeoutMs = 10_000,
}) {
  const failures = [];
  const warnings = [];
  const socialImageUrls = new Set();
  let requestCount = 0;

  async function request(url, options = {}) {
    requestCount += 1;
    try {
      return await fetchImpl(url, {
        redirect: "manual",
        ...options,
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (error) {
      failures.push(
        `${new URL(url).pathname} could not be fetched: ${
          error instanceof Error ? error.message : "unknown error"
        }.`,
      );
      return undefined;
    }
  }

  const expectedRoutes = getExpectedRoutes();
  const robotsResponse = await request(`${targetOrigin}/robots.txt`);
  if (robotsResponse) {
    checkSecurityHeaders(robotsResponse, "/robots.txt", failures);
    checkCacheControl(
      robotsResponse,
      "/robots.txt",
      discoveryCacheControl,
      failures,
    );
    const robots = await robotsResponse.text();
    if (
      robotsResponse.status !== 200 ||
      !robots.includes(`Host: ${canonicalOrigin}`) ||
      !robots.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`) ||
      !robots.includes("Disallow: /api/")
    ) {
      failures.push("/robots.txt does not satisfy the production contract.");
    }
  }

  const sitemapResponse = await request(`${targetOrigin}/sitemap.xml`);
  if (sitemapResponse) {
    checkSecurityHeaders(sitemapResponse, "/sitemap.xml", failures);
    checkCacheControl(
      sitemapResponse,
      "/sitemap.xml",
      discoveryCacheControl,
      failures,
    );
    const sitemap = await sitemapResponse.text();
    const locations = new Set(
      [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/giu)].map(([, value]) =>
        decodeHtml(value),
      ),
    );
    const expectedLocations = new Set(
      expectedRoutes.map((route) => `${canonicalOrigin}${route}`),
    );
    if (
      sitemapResponse.status !== 200 ||
      locations.size !== expectedLocations.size ||
      [...locations].some((location) => !expectedLocations.has(location))
    ) {
      failures.push(
        `/sitemap.xml does not contain exactly ${expectedLocations.size} canonical routes.`,
      );
    }
  }

  for (const routeShape of routeShapes) {
    for (const { locale, htmlLang } of localeDefinitions) {
      const route = localizeRoute(routeShape, locale);
      const response = await request(`${targetOrigin}${route}`);
      if (!response) continue;
      checkSecurityHeaders(response, route, failures);
      checkCacheControl(response, route, staticPageCacheControl, failures);
      if (
        response.status !== 200 ||
        !response.headers.get("content-type")?.startsWith("text/html")
      ) {
        failures.push(`${route} did not return an HTML 200 response.`);
        continue;
      }
      const html = await response.text();
      checkPageMetadata({
        html,
        route,
        routeShape,
        htmlLang,
        canonicalOrigin,
        failures,
        socialImageUrls,
      });
      if (route === "/en") {
        checkHsts(response, requireHsts, failures, warnings);
      }
    }
  }

  if (socialImageUrls.size !== localeDefinitions.length * 2) {
    failures.push(
      `The site exposes ${socialImageUrls.size} unique social images instead of six.`,
    );
  }
  for (const imageUrl of socialImageUrls) {
    const parsed = new URL(imageUrl);
    const response = await request(
      `${targetOrigin}${parsed.pathname}${parsed.search}`,
    );
    if (!response) continue;
    checkSecurityHeaders(response, parsed.pathname, failures);
    const buffer = Buffer.from(await response.arrayBuffer());
    const dimensions = readPngDimensions(buffer);
    if (
      response.status !== 200 ||
      !response.headers.get("content-type")?.startsWith("image/png") ||
      !dimensions ||
      dimensions.width !== 1200 ||
      dimensions.height !== 630 ||
      buffer.length > 5 * 1024 * 1024
    ) {
      failures.push(`${parsed.pathname} is not a valid 1200x630 PNG under 5 MB.`);
    }
  }

  for (const redirectCase of [
    { path: "/", language: "ja", expected: "/ja" },
    { path: "/about", language: "zh-CN", expected: "/zh-cn/about" },
    {
      path: "/music",
      language: "ja",
      cookie: "heresonare-locale=en",
      expected: "/en/music",
    },
  ]) {
    const headers = { "accept-language": redirectCase.language };
    if (redirectCase.cookie) headers.cookie = redirectCase.cookie;
    const response = await request(`${targetOrigin}${redirectCase.path}`, {
      headers,
    });
    if (!response) continue;
    checkSecurityHeaders(response, redirectCase.path, failures);
    const location = response.headers.get("location");
    const pathname = location
      ? new URL(location, targetOrigin).pathname
      : undefined;
    if (
      ![307, 308].includes(response.status) ||
      pathname !== redirectCase.expected
    ) {
      failures.push(
        `${redirectCase.path} did not redirect to ${redirectCase.expected}.`,
      );
    }
  }

  for (const route of [
    "/en/domain-readiness-not-found",
    "/ja/domain-readiness-not-found/nested",
    "/zh-cn/productions/domain-readiness-not-found",
  ]) {
    const response = await request(`${targetOrigin}${route}`);
    if (!response) continue;
    checkSecurityHeaders(response, route, failures);
    checkCacheControl(response, route, notFoundCacheControl, failures);
    const html = await response.text();
    if (response.status !== 404 || !/noindex/iu.test(html)) {
      failures.push(`${route} does not provide the protected localized 404.`);
    }
  }

  const healthResponse = await request(`${targetOrigin}/api/health`);
  if (healthResponse) {
    checkSecurityHeaders(healthResponse, "/api/health", failures);
    checkCacheControl(
      healthResponse,
      "/api/health",
      noStoreCacheControl,
      failures,
    );
    let payload;
    try {
      payload = await healthResponse.json();
    } catch {
      payload = undefined;
    }
    if (
      healthResponse.status !== 200 ||
      JSON.stringify(payload) !== JSON.stringify({ status: "ok" }) ||
      healthResponse.headers.has("set-cookie")
    ) {
      failures.push("/api/health does not satisfy the minimal live contract.");
    }
  }

  if (alternateOrigin) {
    const alternatePath = "/en/about?source=domain-readiness";
    const response = await request(`${alternateOrigin}${alternatePath}`);
    if (response) {
      const location = response.headers.get("location");
      const expectedLocation = `${canonicalOrigin}${alternatePath}`;
      if (
        ![301, 308].includes(response.status) ||
        location !== expectedLocation
      ) {
        failures.push(
          `${alternateOrigin} does not preserve the path and query while redirecting to ${canonicalOrigin}.`,
        );
      }
    }
  }

  return {
    failures,
    warnings,
    summary: {
      targetOrigin,
      canonicalOrigin,
      publicRoutes: expectedRoutes.length,
      socialImages: socialImageUrls.size,
      requests: requestCount,
      alternateChecked: Boolean(alternateOrigin),
      hstsRequired: requireHsts,
    },
  };
}

async function runCli() {
  let options;
  try {
    options = parseArguments(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    console.error(`\n${getUsage()}`);
    process.exitCode = 1;
    return;
  }

  if (options.help) {
    console.log(getUsage());
    return;
  }

  console.log(
    `Auditing ${options.targetOrigin} against canonical ${options.canonicalOrigin}...`,
  );
  const result = await auditLiveSite(options);

  console.log("\nLive site readiness summary\n");
  console.table([result.summary]);
  for (const warning of result.warnings) console.warn(`Warning: ${warning}`);

  if (result.failures.length > 0) {
    console.error("\nLive site readiness check failed:\n");
    for (const failure of result.failures) console.error(`- ${failure}`);
    process.exitCode = 1;
  } else {
    console.log("All required live site checks passed.");
  }
}

const isDirectExecution =
  process.argv[1] &&
  pathToFileURL(process.argv[1]).href === import.meta.url;
if (isDirectExecution) await runCli();
