const pageKeys = [
  "artists",
  "music",
  "productions",
  "tour",
  "venues",
  "video",
  "store",
  "about",
  "contact",
];

const siteStringFields = [
  "heroEyebrow",
  "heroBusinessAreas",
  "heroTitle",
  "heroSubtitle",
  "heroDescription",
  "discover",
  "contactButton",
  "latestReleaseLabel",
  "latestReleaseTitle",
  "latestReleaseMeta",
  "latestReleaseText",
  "productsTitle",
  "product1Title",
  "product1Text",
  "product2Title",
  "product2Text",
  "product3Title",
  "product3Text",
  "featuredLabel",
  "featuredTitle",
  "featuredCategoryLabel",
  "featuredDiscoverLabel",
  "featuredArtistsTitle",
  "featuredArtistsText",
  "featuredMusicTitle",
  "featuredMusicText",
  "featuredProductionsTitle",
  "featuredProductionsText",
  "aboutTag",
  "aboutTitle",
  "aboutText1",
  "aboutText2",
  "aboutCardLabel",
  "aboutStoryTitle",
  "aboutStoryText",
  "aboutMissionTitle",
  "aboutMissionText",
  "aboutVisionTitle",
  "aboutVisionText",
  "contactTag",
  "contactTitle",
  "contactText",
  "contactEmailLabel",
  "contactCardLabel",
  "contactArtistsTitle",
  "contactArtistsText",
  "contactPartnersTitle",
  "contactPartnersText",
  "contactVenuesTitle",
  "contactVenuesText",
  "socialChannelsLabel",
  "instagramLabel",
  "xiaohongshuLabel",
  "douyinLabel",
  "footerSlogan",
  "footerCopyright",
];

const sitePageFields = ["tag", "title", "description"];
const pageHeroFields = ["tag", "title", "description"];
const sectionRequiredFields = ["id", "label", "title"];
const sectionOptionalFields = [
  "description",
  "items",
  "comingSoon",
];
const itemRequiredFields = ["id", "slug", "title", "description"];
const itemOptionalStringFields = [
  "subtitle",
  "role",
  "type",
  "category",
  "status",
  "href",
  "image",
  "meta",
  "year",
  "date",
  "location",
];
const itemOptionalFields = [
  ...itemOptionalStringFields,
  "media",
  "features",
  "useCases",
  "specs",
  "links",
];
const mediaFields = ["card", "hero", "render", "icon"];
const identifierPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const assetPattern = /^\/images\/(?!.*(?:^|\/)\.\.(?:\/|$))[^\\?#]+\.(?:avif|jpe?g|png|svg|webp)$/iu;
const maximumStringLength = 10_000;
const maximumArrayLength = 100;

export const publicContentContractShape = Object.freeze({
  pageKeys: Object.freeze([...pageKeys]),
  siteStringFields: Object.freeze([...siteStringFields]),
});

export function assertSiteContent(value, context) {
  const path = `${context.language}.site`;
  const content = assertRecord(value, path);
  assertExactKeys(content, siteStringFields, ["pages"], path);

  for (const field of siteStringFields) {
    assertPublicString(content[field], `${path}.${field}`);
  }

  const pages = assertRecord(content.pages, `${path}.pages`);
  assertExactKeys(pages, pageKeys, [], `${path}.pages`);

  for (const pageKey of pageKeys) {
    const page = assertRecord(pages[pageKey], `${path}.pages.${pageKey}`);
    assertExactKeys(page, sitePageFields, [], `${path}.pages.${pageKey}`);
    for (const field of sitePageFields) {
      assertPublicString(page[field], `${path}.pages.${pageKey}.${field}`);
    }
  }
}

export function assertStaticPageContent(value, context) {
  const path = `${context.language}.pages.${context.pageKey}`;
  const page = assertRecord(value, path);
  assertExactKeys(page, ["slug", "hero", "sections"], [], path);
  assertIdentifier(page.slug, `${path}.slug`);

  if (page.slug !== context.pageKey) {
    fail(`${path}.slug`, "must match the requested page key");
  }

  const hero = assertRecord(page.hero, `${path}.hero`);
  assertExactKeys(hero, pageHeroFields, [], `${path}.hero`);
  for (const field of pageHeroFields) {
    assertPublicString(hero[field], `${path}.hero.${field}`);
  }

  const sections = assertArray(page.sections, `${path}.sections`);
  const sectionIds = new Set();
  const itemIds = new Set();

  for (const [sectionIndex, sectionValue] of sections.entries()) {
    const sectionPath = `${path}.sections[${sectionIndex}]`;
    const section = assertRecord(sectionValue, sectionPath);
    assertExactKeys(
      section,
      sectionRequiredFields,
      sectionOptionalFields,
      sectionPath,
    );
    assertIdentifier(section.id, `${sectionPath}.id`);
    assertUnique(section.id, sectionIds, `${sectionPath}.id`);
    assertPublicString(section.label, `${sectionPath}.label`);
    assertPublicString(section.title, `${sectionPath}.title`);

    if ("description" in section) {
      assertPublicString(section.description, `${sectionPath}.description`);
    }
    if ("items" in section) {
      const items = assertArray(section.items, `${sectionPath}.items`);
      for (const [itemIndex, itemValue] of items.entries()) {
        const itemPath = `${sectionPath}.items[${itemIndex}]`;
        const item = assertPageContentItem(itemValue, itemPath);
        assertUnique(item.id, itemIds, `${itemPath}.id`);
      }
    }
    if ("comingSoon" in section) {
      assertComingSoon(section.comingSoon, `${sectionPath}.comingSoon`);
    }
  }
}

export function assertProductionContent(value, context) {
  const path = `${context.language}.productions.${context.slug}`;
  const production = assertPageContentItem(value, path);

  if (production.slug !== context.slug) {
    fail(`${path}.slug`, "must match the requested production slug");
  }
}

function assertPageContentItem(value, path) {
  const item = assertRecord(value, path);
  assertExactKeys(item, itemRequiredFields, itemOptionalFields, path);
  assertIdentifier(item.id, `${path}.id`);
  assertIdentifier(item.slug, `${path}.slug`);
  assertPublicString(item.title, `${path}.title`);
  assertPublicString(item.description, `${path}.description`);

  for (const field of itemOptionalStringFields) {
    if (!(field in item)) continue;
    assertPublicString(item[field], `${path}.${field}`);
  }

  if ("href" in item) assertSafeHref(item.href, `${path}.href`);
  if ("image" in item) assertAssetPath(item.image, `${path}.image`);

  if ("media" in item) {
    const media = assertRecord(item.media, `${path}.media`);
    assertExactKeys(media, [], mediaFields, `${path}.media`);
    for (const field of mediaFields) {
      if (field in media) {
        assertAssetPath(media[field], `${path}.media.${field}`);
      }
    }
  }

  for (const field of ["features", "useCases"]) {
    if (field in item) {
      assertStringArray(item[field], `${path}.${field}`);
    }
  }

  if ("specs" in item) {
    const specs = assertArray(item.specs, `${path}.specs`);
    for (const [index, specValue] of specs.entries()) {
      const specPath = `${path}.specs[${index}]`;
      const spec = assertRecord(specValue, specPath);
      assertExactKeys(spec, ["label", "value"], [], specPath);
      assertPublicString(spec.label, `${specPath}.label`);
      assertPublicString(spec.value, `${specPath}.value`);
    }
  }

  if ("links" in item) {
    const links = assertArray(item.links, `${path}.links`);
    for (const [index, link] of links.entries()) {
      assertPageLink(link, `${path}.links[${index}]`);
    }
  }

  return item;
}

function assertComingSoon(value, path) {
  const comingSoon = assertRecord(value, path);
  assertExactKeys(
    comingSoon,
    ["label", "title", "description"],
    ["cta"],
    path,
  );
  for (const field of ["label", "title", "description"]) {
    assertPublicString(comingSoon[field], `${path}.${field}`);
  }
  if ("cta" in comingSoon) assertPageLink(comingSoon.cta, `${path}.cta`);
}

function assertPageLink(value, path) {
  const link = assertRecord(value, path);
  assertExactKeys(link, ["label", "href"], ["external"], path);
  assertPublicString(link.label, `${path}.label`);
  assertSafeHref(link.href, `${path}.href`);

  if ("external" in link && typeof link.external !== "boolean") {
    fail(`${path}.external`, "must be a boolean");
  }

  const isExternal = isExternalHref(link.href);
  if (isExternal !== (link.external === true)) {
    fail(`${path}.external`, "must identify external and mail links explicitly");
  }
}

function assertRecord(value, path) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    fail(path, "must be an object");
  }
  return value;
}

function assertArray(value, path) {
  if (!Array.isArray(value)) fail(path, "must be an array");
  if (value.length > maximumArrayLength) {
    fail(path, `must contain at most ${maximumArrayLength} entries`);
  }
  return value;
}

function assertExactKeys(value, requiredKeys, optionalKeys, path) {
  const allowedKeys = new Set([...requiredKeys, ...optionalKeys]);
  for (const key of requiredKeys) {
    if (!Object.hasOwn(value, key)) fail(`${path}.${key}`, "is required");
  }
  for (const key of Object.keys(value)) {
    if (!allowedKeys.has(key)) fail(`${path}.${key}`, "is not a public field");
  }
}

function assertPublicString(value, path) {
  if (typeof value !== "string") fail(path, "must be a string");
  if (value.length === 0 || value !== value.trim()) {
    fail(path, "must be non-empty and trimmed");
  }
  if (value.length > maximumStringLength || value.includes("\0")) {
    fail(path, "exceeds the safe public-text contract");
  }
}

function assertIdentifier(value, path) {
  assertPublicString(value, path);
  if (!identifierPattern.test(value)) {
    fail(path, "must be a lowercase kebab-case identifier");
  }
}

function assertUnique(value, values, path) {
  if (values.has(value)) fail(path, "must be unique within the page");
  values.add(value);
}

function assertStringArray(value, path) {
  const values = assertArray(value, path);
  for (const [index, entry] of values.entries()) {
    assertPublicString(entry, `${path}[${index}]`);
  }
}

function assertAssetPath(value, path) {
  assertPublicString(value, path);
  if (!assetPattern.test(value) || value.split("/").includes("..")) {
    fail(path, "must be a normalized local image path");
  }
}

function assertSafeHref(value, path) {
  assertPublicString(value, path);
  if (/^\/(?!\/)[^\\\s\0]*$/u.test(value)) return;

  if (value.startsWith("mailto:")) {
    if (/^mailto:[^\s@]+@[^\s@]+$/u.test(value)) return;
    fail(path, "contains an invalid mail link");
  }

  try {
    const url = new URL(value);
    if (url.protocol === "https:" && !url.username && !url.password) return;
  } catch {
    // Fall through to the public error below.
  }

  fail(path, "must use a safe internal, HTTPS, or mail link");
}

function isExternalHref(value) {
  return value.startsWith("https:") || value.startsWith("mailto:");
}

function fail(path, message) {
  throw new TypeError(`Public content contract violation at ${path}: ${message}.`);
}
