import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { createServer } from "node:net";
import { join } from "node:path";

const projectRoot = process.cwd();
const buildDirectory = join(projectRoot, ".next");
const publicDirectory = join(projectRoot, "public");
const siteOrigin = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://heresonare.com",
).origin;
const localeDefinitions = [
  { locale: "en", htmlLang: "en", hrefLang: "en" },
  { locale: "ja", htmlLang: "ja", hrefLang: "ja" },
  { locale: "zh-cn", htmlLang: "zh-CN", hrefLang: "zh-CN" },
];
const routeShapes = [
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
const expectedRoutes = routeShapes.flatMap((shape) =>
  localeDefinitions.map(({ locale }) => localizeRoute(shape, locale)),
);
const expectedRouteSet = new Set(expectedRoutes);
const failures = [];

function localizeRoute(shape, locale) {
  return shape === "/" ? `/${locale}` : `/${locale}${shape}`;
}

function getHtmlPath(route) {
  return join(
    buildDirectory,
    "server/app",
    `${route.slice(1)}.html`,
  );
}

function getAttribute(tag, name) {
  return tag.match(new RegExp(`${name}="([^"]*)"`, "u"))?.[1];
}

function decodeHtmlAttribute(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'");
}

function getTags(html, expression) {
  return [...html.matchAll(expression)].map(([tag]) => tag);
}

function checkStructuredData({
  html,
  route,
  routeShape,
  locale,
  htmlLang,
  canonicalUrl,
  title,
  description,
}) {
  const scripts = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gu,
    ),
  ];
  record(
    scripts.length === 1,
    `${route} has ${scripts.length} JSON-LD scripts instead of one.`,
  );
  if (scripts.length !== 1) return;

  let structuredData;
  try {
    structuredData = JSON.parse(scripts[0][1]);
  } catch {
    failures.push(`${route} has invalid JSON-LD.`);
    return;
  }

  record(
    structuredData?.["@context"] === "https://schema.org",
    `${route} has the wrong JSON-LD context.`,
  );
  const graph = Array.isArray(structuredData?.["@graph"])
    ? structuredData["@graph"]
    : [];
  record(graph.length > 0, `${route} has no JSON-LD graph.`);

  const expectedTypes =
    routeShape === "/"
      ? ["Organization", "WebSite", "WebPage"]
      : ["WebPage", "BreadcrumbList"];
  const actualTypes = graph.map((node) => node?.["@type"]);
  record(
    actualTypes.length === expectedTypes.length &&
      expectedTypes.every((type) => actualTypes.includes(type)),
    `${route} has an unexpected JSON-LD type set.`,
  );

  const webPage = graph.find((node) => node?.["@type"] === "WebPage");
  record(Boolean(webPage), `${route} is missing WebPage structured data.`);
  if (webPage) {
    record(
      webPage["@id"] === `${canonicalUrl}#webpage`,
      `${route} has the wrong WebPage ID.`,
    );
    record(
      webPage.url === canonicalUrl,
      `${route} has the wrong WebPage URL.`,
    );
    record(
      webPage.name === decodeHtmlAttribute(title ?? ""),
      `${route} has a WebPage name that differs from its title.`,
    );
    record(
      webPage.description === decodeHtmlAttribute(description ?? ""),
      `${route} has a WebPage description that differs from its metadata.`,
    );
    record(
      webPage.inLanguage === htmlLang,
      `${route} has the wrong structured-data language.`,
    );
    record(
      webPage.isPartOf?.["@id"] === `${siteOrigin}/#website`,
      `${route} has the wrong WebSite reference.`,
    );
    record(
      webPage.about?.["@id"] === `${siteOrigin}/#organization`,
      `${route} has the wrong Organization reference.`,
    );
    if (routeShape !== "/") {
      record(
        webPage.breadcrumb?.["@id"] === `${canonicalUrl}#breadcrumb`,
        `${route} has the wrong breadcrumb reference.`,
      );
    }
  }

  if (routeShape === "/") {
    const organization = graph.find(
      (node) => node?.["@type"] === "Organization",
    );
    const website = graph.find((node) => node?.["@type"] === "WebSite");
    record(
      organization?.["@id"] === `${siteOrigin}/#organization` &&
        organization?.name === "h\u00e9ReSonare" &&
        organization?.url === `${siteOrigin}/` &&
        organization?.logo === `${siteOrigin}/icon.png`,
      `${route} has invalid Organization structured data.`,
    );
    record(
      website?.["@id"] === `${siteOrigin}/#website` &&
        website?.url === `${siteOrigin}/` &&
        website?.name === "h\u00e9ReSonare" &&
        Array.isArray(website?.inLanguage) &&
        website.inLanguage.length === localeDefinitions.length &&
        localeDefinitions.every(({ htmlLang: language }) =>
          website.inLanguage.includes(language),
        ) &&
        website?.publisher?.["@id"] === `${siteOrigin}/#organization`,
      `${route} has invalid WebSite structured data.`,
    );
    return;
  }

  const breadcrumb = graph.find(
    (node) => node?.["@type"] === "BreadcrumbList",
  );
  const routeParts = routeShape.split("/").filter(Boolean);
  const breadcrumbShapes =
    routeParts[0] === "productions" && routeParts.length === 2
      ? ["/", "/productions", routeShape]
      : ["/", routeShape];
  const breadcrumbItems = Array.isArray(breadcrumb?.itemListElement)
    ? breadcrumb.itemListElement
    : [];

  record(
    breadcrumb?.["@id"] === `${canonicalUrl}#breadcrumb`,
    `${route} has the wrong BreadcrumbList ID.`,
  );
  record(
    breadcrumbItems.length === breadcrumbShapes.length,
    `${route} has an incomplete breadcrumb trail.`,
  );
  for (const [index, shape] of breadcrumbShapes.entries()) {
    const item = breadcrumbItems[index];
    const expectedItemUrl = `${siteOrigin}${localizeRoute(shape, locale)}`;
    record(
      item?.["@type"] === "ListItem" &&
        item?.position === index + 1 &&
        typeof item?.name === "string" &&
        item.name.trim().length > 0 &&
        item?.item === expectedItemUrl,
      `${route} has an invalid breadcrumb at position ${index + 1}.`,
    );
  }

  const currentName = decodeHtmlAttribute(title ?? "").replace(
    / \| h\u00e9ReSonare$/u,
    "",
  );
  record(
    breadcrumbItems.at(-1)?.name === currentName,
    `${route} has a breadcrumb name that differs from its page title.`,
  );
}

function record(condition, message) {
  if (!condition) failures.push(message);
}

function getPublicImagePath(source) {
  const decodedSource = decodeHtmlAttribute(source);

  if (decodedSource.startsWith("/_next/image?")) {
    const optimizedUrl = new URL(decodedSource, "https://local.test");
    const originalUrl = optimizedUrl.searchParams.get("url");
    return originalUrl?.startsWith("/") ? originalUrl : undefined;
  }

  if (decodedSource.startsWith("/") && !decodedSource.startsWith("/_next/")) {
    return decodedSource.split(/[?#]/u)[0];
  }

  return undefined;
}

function checkStaticPages() {
  const discoveredInternalRoutes = new Set();

  for (const routeShape of routeShapes) {
    const expectedAlternates = Object.fromEntries([
      ...localeDefinitions.map(({ locale, hrefLang }) => [
        hrefLang,
        `${siteOrigin}${localizeRoute(routeShape, locale)}`,
      ]),
      ["x-default", `${siteOrigin}${localizeRoute(routeShape, "en")}`],
    ]);

    for (const { locale, htmlLang } of localeDefinitions) {
      const route = localizeRoute(routeShape, locale);
      const htmlPath = getHtmlPath(route);

      if (!existsSync(htmlPath)) {
        failures.push(`Missing generated HTML: ${route}`);
        continue;
      }

      const html = readFileSync(htmlPath, "utf8");
      const canonicalUrl = `${siteOrigin}${route}`;
      const htmlTag = html.match(/<html\b[^>]*>/u)?.[0] ?? "";
      const canonicalTags = getTags(
        html,
        /<link rel="canonical"[^>]*>/gu,
      );
      const alternateTags = getTags(
        html,
        /<link rel="alternate"[^>]*>/gu,
      );
      const openGraphTags = getTags(
        html,
        /<meta property="og:url"[^>]*>/gu,
      );
      const robotsTags = getTags(
        html,
        /<meta name="robots"[^>]*>/gu,
      );
      const title = html.match(/<title>([^<]+)<\/title>/u)?.[1];
      const descriptionTag = html.match(
        /<meta name="description"[^>]*>/u,
      )?.[0];
      const description = getAttribute(descriptionTag ?? "", "content");

      record(
        getAttribute(htmlTag, "lang") === htmlLang,
        `${route} has the wrong html lang.`,
      );
      record(Boolean(title?.trim()), `${route} is missing a title.`);
      record(
        Boolean(description?.trim()),
        `${route} is missing a description.`,
      );
      record(
        canonicalTags.length === 1 &&
          getAttribute(canonicalTags[0], "href") === canonicalUrl,
        `${route} has an invalid canonical URL.`,
      );
      record(
        openGraphTags.length === 1 &&
          getAttribute(openGraphTags[0], "content") === canonicalUrl,
        `${route} has an invalid Open Graph URL.`,
      );
      record(
        robotsTags.length === 1 &&
          getAttribute(robotsTags[0], "content") === "index, follow",
        `${route} is not explicitly indexable.`,
      );
      record(
        /<main\b[^>]*\bid="main-content"/u.test(html),
        `${route} is missing the main-content landmark.`,
      );

      const actualAlternates = Object.fromEntries(
        alternateTags.map((tag) => [
          getAttribute(tag, "hrefLang"),
          getAttribute(tag, "href"),
        ]),
      );
      record(
        Object.keys(actualAlternates).length === 4,
        `${route} does not have four language alternates.`,
      );
      for (const [hrefLang, href] of Object.entries(expectedAlternates)) {
        record(
          actualAlternates[hrefLang] === href,
          `${route} has an invalid ${hrefLang} alternate.`,
        );
      }

      checkStructuredData({
        html,
        route,
        routeShape,
        locale,
        htmlLang,
        canonicalUrl,
        title,
        description,
      });

      const anchorTags = getTags(html, /<a\b[^>]*\bhref="[^"]+"[^>]*>/gu);
      for (const tag of anchorTags) {
        const href = decodeHtmlAttribute(getAttribute(tag, "href") ?? "");
        if (!href.startsWith("/") || href.startsWith("//")) continue;

        const pathname = href.split(/[?#]/u)[0];
        if (pathname.startsWith("/_next/") || pathname.startsWith("/api/")) {
          continue;
        }

        discoveredInternalRoutes.add(pathname);
        record(
          expectedRouteSet.has(pathname),
          `${route} links to an unsupported internal route: ${pathname}`,
        );
        record(
          pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
          `${route} has a cross-locale internal link: ${pathname}`,
        );
      }

      const imageTags = getTags(html, /<img\b[^>]*>/gu);
      for (const tag of imageTags) {
        const source = getAttribute(tag, "src");
        const publicPath = source ? getPublicImagePath(source) : undefined;
        if (!publicPath) continue;

        record(
          existsSync(join(publicDirectory, publicPath.slice(1))),
          `${route} renders a missing local image: ${publicPath}`,
        );
      }
    }
  }

  for (const route of expectedRoutes) {
    record(
      discoveredInternalRoutes.has(route),
      `No rendered internal link reaches ${route}.`,
    );
  }

  return discoveredInternalRoutes.size;
}

function checkSitemapAndRobots() {
  const sitemapPath = join(buildDirectory, "server/app/sitemap.xml.body");
  const robotsPath = join(buildDirectory, "server/app/robots.txt.body");

  record(existsSync(sitemapPath), "Missing generated sitemap.xml.");
  record(existsSync(robotsPath), "Missing generated robots.txt.");
  if (!existsSync(sitemapPath) || !existsSync(robotsPath)) return;

  const sitemap = readFileSync(sitemapPath, "utf8");
  const robots = readFileSync(robotsPath, "utf8");
  const sitemapUrls = [
    ...sitemap.matchAll(/<loc>([^<]+)<\/loc>/gu),
  ].map(([, url]) => url);

  record(
    sitemapUrls.length === expectedRoutes.length,
    `Sitemap has ${sitemapUrls.length} URLs instead of ${expectedRoutes.length}.`,
  );
  record(
    new Set(sitemapUrls).size === sitemapUrls.length,
    "Sitemap contains duplicate URLs.",
  );
  for (const route of expectedRoutes) {
    record(
      sitemapUrls.includes(`${siteOrigin}${route}`),
      `Sitemap is missing ${route}.`,
    );
  }

  const urlBlocks = getTags(sitemap, /<url>[\s\S]*?<\/url>/gu);
  for (const block of urlBlocks) {
    const location = block.match(/<loc>([^<]+)<\/loc>/u)?.[1] ?? "unknown";
    const alternateTags = getTags(block, /<xhtml:link\b[^>]*>/gu);
    record(
      alternateTags.length === localeDefinitions.length,
      `${location} has incomplete sitemap alternates.`,
    );
    for (const { hrefLang } of localeDefinitions) {
      record(
        alternateTags.some(
          (tag) => getAttribute(tag, "hreflang") === hrefLang,
        ),
        `${location} is missing the ${hrefLang} sitemap alternate.`,
      );
    }
  }

  record(/User-Agent: \*/u.test(robots), "robots.txt has no wildcard rule.");
  record(/Allow: \/(?:\r?\n|$)/u.test(robots), "robots.txt does not allow public pages.");
  record(/Disallow: \/api\//u.test(robots), "robots.txt does not block /api/.");
  record(
    robots.includes(`Host: ${siteOrigin}`),
    "robots.txt has the wrong host.",
  );
  record(
    robots.includes(`Sitemap: ${siteOrigin}/sitemap.xml`),
    "robots.txt has the wrong sitemap URL.",
  );
}

async function getAvailablePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      server.close((error) => (error ? reject(error) : resolve(port)));
    });
  });
}

async function waitForServer(origin, child, serverOutput) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (child.exitCode !== null) {
      throw new Error(
        `Production server exited early.\n${serverOutput.join("")}`,
      );
    }

    try {
      const response = await fetch(`${origin}/robots.txt`, {
        signal: AbortSignal.timeout(1000),
      });
      if (response.ok) return;
    } catch {
      // The production server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  throw new Error(`Timed out waiting for the production server at ${origin}.`);
}

async function stopServer(child) {
  if (child.exitCode !== null) return;

  child.kill();
  await Promise.race([
    new Promise((resolve) => child.once("exit", resolve)),
    new Promise((resolve) => setTimeout(resolve, 2000)),
  ]);
  if (child.exitCode === null) child.kill("SIGKILL");
}

async function checkRuntimeRoutes() {
  const port = await getAvailablePort();
  const runtimeOrigin = `http://127.0.0.1:${port}`;
  const nextCli = join(projectRoot, "node_modules/next/dist/bin/next");
  const serverOutput = [];
  const child = spawn(
    process.execPath,
    [nextCli, "start", "--hostname", "127.0.0.1", "--port", String(port)],
    {
      cwd: projectRoot,
      env: { ...process.env, NODE_ENV: "production" },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  child.stdout.on("data", (chunk) => serverOutput.push(chunk.toString()));
  child.stderr.on("data", (chunk) => serverOutput.push(chunk.toString()));

  try {
    await waitForServer(runtimeOrigin, child, serverOutput);

    const publicResults = await Promise.all(
      expectedRoutes.map(async (route) => ({
        route,
        status: (await fetch(`${runtimeOrigin}${route}`)).status,
      })),
    );
    for (const { route, status } of publicResults) {
      record(status === 200, `${route} returned HTTP ${status}.`);
    }

    const redirectCases = [
      { path: "/", acceptLanguage: "ja", expected: "/ja" },
      { path: "/about", acceptLanguage: "zh-CN", expected: "/zh-cn/about" },
      {
        path: "/music",
        acceptLanguage: "ja",
        cookie: "heresonare-locale=en",
        expected: "/en/music",
      },
    ];
    for (const redirectCase of redirectCases) {
      const headers = { "accept-language": redirectCase.acceptLanguage };
      if (redirectCase.cookie) headers.cookie = redirectCase.cookie;
      const response = await fetch(`${runtimeOrigin}${redirectCase.path}`, {
        headers,
        redirect: "manual",
      });
      const location = response.headers.get("location");
      const pathname = location
        ? new URL(location, runtimeOrigin).pathname
        : undefined;

      record(
        [307, 308].includes(response.status) &&
          pathname === redirectCase.expected,
        `${redirectCase.path} did not redirect to ${redirectCase.expected}.`,
      );
    }

    const notFoundCases = [
      { route: "/en/not-a-real-page", htmlLang: "en", locale: "en" },
      {
        route: "/ja/not-a-real-page/nested",
        htmlLang: "ja",
        locale: "ja",
      },
      {
        route: "/zh-cn/productions/not-a-real-production",
        htmlLang: "zh-CN",
        locale: "zh-cn",
      },
    ];
    for (const notFoundCase of notFoundCases) {
      const response = await fetch(`${runtimeOrigin}${notFoundCase.route}`);
      const html = await response.text();
      record(
        response.status === 404,
        `${notFoundCase.route} returned HTTP ${response.status}.`,
      );
      record(
        html.includes(`\\"lang\\":\\"${notFoundCase.htmlLang}\\"`),
        `${notFoundCase.route} lost its HTML language in the RSC payload.`,
      );
      record(
        /<meta name="robots" content="noindex/u.test(html),
        `${notFoundCase.route} is missing noindex.`,
      );
      record(
        html.includes(`\\"locale\\":\\"${notFoundCase.locale}\\"`),
        `${notFoundCase.route} lost its locale context in the RSC payload.`,
      );
    }

    const unsupportedResponse = await fetch(`${runtimeOrigin}/fr`);
    record(
      unsupportedResponse.status === 404,
      `/fr returned HTTP ${unsupportedResponse.status}.`,
    );

    const robotsResponse = await fetch(`${runtimeOrigin}/robots.txt`);
    const sitemapResponse = await fetch(`${runtimeOrigin}/sitemap.xml`);
    record(robotsResponse.status === 200, "Runtime robots.txt is unavailable.");
    record(sitemapResponse.status === 200, "Runtime sitemap.xml is unavailable.");
  } finally {
    await stopServer(child);
  }
}

if (!existsSync(join(buildDirectory, "BUILD_ID"))) {
  throw new Error("Missing production build. Run `npm run build` first.");
}

const internalLinkCount = checkStaticPages();
checkSitemapAndRobots();
await checkRuntimeRoutes();

console.log("\nSite integrity summary\n");
console.table([
  {
    "Public routes": expectedRoutes.length,
    "Internal destinations": internalLinkCount,
    "Structured-data pages": expectedRoutes.length,
    "Localized 404 cases": 3,
    "Legacy redirects": 3,
  },
]);

if (failures.length > 0) {
  console.error("Site integrity check failed:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("All site integrity checks passed.");
}
