import assert from "node:assert/strict";

import {
  assertProductionContent,
  assertSiteContent,
  assertStaticPageContent,
  publicContentContractShape,
} from "../src/content/validation.mjs";

function createSiteContent() {
  return {
    ...Object.fromEntries(
      publicContentContractShape.siteStringFields.map((field) => [
        field,
        `Public ${field}`,
      ]),
    ),
    pages: Object.fromEntries(
      publicContentContractShape.pageKeys.map((pageKey) => [
        pageKey,
        {
          tag: `Public ${pageKey} tag`,
          title: `Public ${pageKey} title`,
          description: `Public ${pageKey} description`,
        },
      ]),
    ),
  };
}

function createPageContent() {
  return {
    slug: "artists",
    hero: {
      tag: "Artists",
      title: "Public artists",
      description: "Public artist profiles.",
    },
    sections: [
      {
        id: "featured-artists",
        label: "Roster",
        title: "Featured artists",
        items: [
          {
            id: "artist-one",
            slug: "artist-one",
            title: "Artist One",
            description: "A public artist profile.",
            href: "/artists/artist-one",
            image: "/images/artists/artist-one.webp",
            features: ["Live performance"],
            specs: [{ label: "Status", value: "Published" }],
            links: [
              {
                label: "Official profile",
                href: "https://example.com/artist-one",
                external: true,
              },
            ],
          },
        ],
      },
    ],
  };
}

function expectViolation(label, mutate, expectedPattern) {
  const fixture = mutate();
  assert.throws(
    fixture.check,
    expectedPattern,
    `${label} did not fail with the expected public-content error.`,
  );
}

const siteContent = createSiteContent();
const pageContent = createPageContent();
const productionContent = structuredClone(pageContent.sections[0].items[0]);

assert.doesNotThrow(() =>
  assertSiteContent(siteContent, { language: "EN" }),
);
assert.doesNotThrow(() =>
  assertStaticPageContent(pageContent, {
    language: "EN",
    pageKey: "artists",
  }),
);
assert.doesNotThrow(() =>
  assertProductionContent(productionContent, {
    language: "EN",
    slug: "artist-one",
  }),
);

const invalidCases = [
  {
    label: "private provider field",
    mutate() {
      const value = createSiteContent();
      value.providerToken = "must-not-cross-the-boundary";
      return {
        check: () => assertSiteContent(value, { language: "EN" }),
      };
    },
    expected: /providerToken: is not a public field/u,
  },
  {
    label: "missing localized page",
    mutate() {
      const value = createSiteContent();
      delete value.pages.contact;
      return {
        check: () => assertSiteContent(value, { language: "EN" }),
      };
    },
    expected: /pages\.contact: is required/u,
  },
  {
    label: "mismatched page identity",
    mutate() {
      const value = createPageContent();
      value.slug = "music";
      return {
        check: () =>
          assertStaticPageContent(value, {
            language: "EN",
            pageKey: "artists",
          }),
      };
    },
    expected: /slug: must match the requested page key/u,
  },
  {
    label: "duplicate page item identifier",
    mutate() {
      const value = createPageContent();
      value.sections.push({
        id: "secondary-artists",
        label: "More",
        title: "More artists",
        items: [structuredClone(value.sections[0].items[0])],
      });
      return {
        check: () =>
          assertStaticPageContent(value, {
            language: "EN",
            pageKey: "artists",
          }),
      };
    },
    expected: /id: must be unique within the page/u,
  },
  {
    label: "present but undefined optional field",
    mutate() {
      const value = createPageContent();
      value.sections[0].items[0].role = undefined;
      return {
        check: () =>
          assertStaticPageContent(value, {
            language: "EN",
            pageKey: "artists",
          }),
      };
    },
    expected: /role: must be a string/u,
  },
  {
    label: "unsafe public link",
    mutate() {
      const value = createPageContent();
      value.sections[0].items[0].links[0] = {
        label: "Unsafe",
        href: "javascript:alert(1)",
        external: true,
      };
      return {
        check: () =>
          assertStaticPageContent(value, {
            language: "EN",
            pageKey: "artists",
          }),
      };
    },
    expected: /href: must use a safe internal, HTTPS, or mail link/u,
  },
  {
    label: "unsafe media traversal",
    mutate() {
      const value = createPageContent();
      value.sections[0].items[0].image = "/images/../private.png";
      return {
        check: () =>
          assertStaticPageContent(value, {
            language: "EN",
            pageKey: "artists",
          }),
      };
    },
    expected: /image: must be a normalized local image path/u,
  },
  {
    label: "mismatched production identity",
    mutate() {
      const value = structuredClone(productionContent);
      value.slug = "another-production";
      return {
        check: () =>
          assertProductionContent(value, {
            language: "EN",
            slug: "artist-one",
          }),
      };
    },
    expected: /slug: must match the requested production slug/u,
  },
];

for (const invalidCase of invalidCases) {
  expectViolation(
    invalidCase.label,
    invalidCase.mutate,
    invalidCase.expected,
  );
}

console.log(
  `Public content runtime contract passed (3 valid fixtures and ${invalidCases.length} invalid cases).`,
);
