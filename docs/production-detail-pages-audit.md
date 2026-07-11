# Production detail pages audit

This audit covers Roadmap Stage 4A: a production-only detail-page vertical
slice for the three approved production records already present in the static
content model.

## Route contract

The supported route pattern is `/{locale}/productions/{slug}`. The build
prerenders exactly these three slugs for each of `en`, `ja`, and `zh-cn`:

- `audio-innovation`
- `creative-platform`
- `live-experience`

This produces exactly nine production detail pages. `productionSlugs` is the
single allowlist used by static generation, runtime validation, and the
localized content integrity check. Unknown production slugs return the
localized Productions not-found experience with a locale-preserving link back
to the list. Detail paths for artists, music, tour, venues, video, store, about,
and contact remain unsupported and return 404.

The locale layout continues to prerender only the three supported locales. It
allows runtime locale parameters so a valid locale can reach a nested localized
not-found boundary; the existing `isLocale` guard still rejects every unsupported
locale. URL locale state, cookie fallback behavior, and locale switching remain
unchanged. Switching language on a production detail page preserves both
`productions` and the active slug.

## Component and data architecture

- `src/data/productionContent.ts` owns the supported slug type, allowlist,
  localized lookup, and dependency-free EN/JP/CN integrity check.
- `src/app/[locale]/productions/[slug]/page.tsx` owns static params, runtime
  route validation, localized metadata, and server-side detail composition.
- `src/components/ProductionDetail.tsx` renders the approved production fields
  with the established dark, rounded, blue/teal brand system.
- `src/components/ProductionNotFound.tsx` renders the localized not-found copy
  and back navigation supplied by centralized interface content.
- The existing Productions list continues to use the Stage 3 `ContentCard`.
  Only the three production item destinations changed, so its existing
  locale-safe fallback labels render as `View`, `詳細を見る`, and `查看详情`.
- Navbar route matching treats descendants of a section route as active, so
  Productions remains current on nested production pages on desktop and mobile.

No route-specific production copy was added. Every title, label-like field,
status, description, feature, use case, and specification comes from the
existing localized `pageContent` records repaired in PR #13.

## Detail rendering contract

| Field | Detail behavior |
| --- | --- |
| `id` | Remains a stable content identifier; not exposed as copy. |
| `slug` | Validated against the production-only route allowlist. |
| `title` | The single page `h1` and localized metadata title source. |
| `description` | Introductory detail copy and localized metadata description. |
| `subtitle`, `type`, `category` | Ordered, deduplicated primary labels. |
| `role` | Supported by the shared model but not populated by productions. |
| `status` | Separately labelled localized status badge. |
| `meta`, `year`, `date`, `location` | Ordered, deduplicated metadata chips when populated; currently absent. |
| `features` | Normalized semantic list under the localized Features heading. |
| `useCases` | Separate normalized semantic list under the localized Use Cases heading. |
| `specs` | Ordered, normalized definition list under the localized Specifications heading. |
| `media.hero` | First detail-hero candidate after approved-asset validation. |
| `media.card`, `image`, `media.render` | Ordered hero fallbacks; `media.render` also supports a separate approved render slot. |
| `media.icon` | Optional small decorative icon after approved-asset validation. |
| `href` | List-to-detail destination; not repeated as a self-link on the detail page. |
| `links` | Not populated by production records; no detail action is invented. |

The Stage 3 normalization helpers continue to remove blank and duplicate list
values and invalid specification rows. Features and use cases use semantic
unordered lists, specifications use a definition list, and the page has one
logical `h1` followed by `h2` section headings. The status includes visible text
and is not communicated by color alone. Back links and not-found links have
visible focus styles and no nested interactive elements.

## Media safety

All twelve content-specific production media references remain absent from
`public/`:

- `/images/products/audio-innovation/card.webp`
- `/images/products/audio-innovation/hero.webp`
- `/images/products/audio-innovation/render.webp`
- `/images/products/audio-innovation/icon.svg`
- `/images/products/creative-platform/card.webp`
- `/images/products/creative-platform/hero.webp`
- `/images/products/creative-platform/render.webp`
- `/images/products/creative-platform/icon.svg`
- `/images/products/live-experience/card.webp`
- `/images/products/live-experience/hero.webp`
- `/images/products/live-experience/render.webp`
- `/images/products/live-experience/icon.svg`

The approved-content manifest therefore remains empty. The detail renderer
reuses the Stage 3 approved-media predicate and never passes these missing paths
to `next/image`. It renders the existing white héReSonare logo as an intentional
decorative fallback with empty alt text. No new image, icon, or product render
was fabricated.

## Validation evidence

The production build generates the existing 30 locale-prefixed public routes
and exactly nine production detail routes. A local HTTP matrix returned 200 for
all 39 routes. Representative unsupported Artist and Music detail routes and an
unknown Production slug returned 404.

Browser verification covered:

- EN, JP, and CN localized production copy and metadata;
- localized list-to-detail and back navigation;
- language switching while preserving the nested slug;
- active Productions Navbar state on nested routes;
- localized unknown-production behavior;
- semantic heading, list, definition-list, article, and navigation structure;
- missing-media fallback without broken images or missing-asset requests;
- no document-level horizontal overflow at 390, 768, and 1280 pixels; and
- no browser console warnings or errors.

Screenshot files contain JPEG binary data and use matching `.jpg` extensions:

| Evidence | Viewport | File |
| --- | --- | --- |
| English Audio Innovation detail | 1280 × 900 | `docs/screenshots/production-detail-pages/en-audio-innovation-1280.jpg` |
| Japanese Creative Platform detail | 390 × 844 | `docs/screenshots/production-detail-pages/ja-creative-platform-390.jpg` |
| Chinese Live Experience detail | 768 × 1024 | `docs/screenshots/production-detail-pages/zh-cn-live-experience-768.jpg` |

## Deferred work and risks

Stage 4 remains incomplete. Detail routes for artists, releases, events,
venues, videos, store items, and any future entity types are intentionally
deferred. CMS/database integration remains Stage 6. Canonicals, language
alternates, sitemap, robots, structured data, and new social images remain
Stage 5.

The product-owner terminology review recorded in
`docs/jp-cn-content-repair-audit.md` still applies. Approved production imagery
is also still required before the fallback can be replaced.
