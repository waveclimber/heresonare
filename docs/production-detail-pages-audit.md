# Production detail pages audit

This audit covers Roadmap Stage 4A: a production-only detail-page vertical
slice for the three approved production records already present in the static
content model.

## Route contract

The supported public pattern is `/{locale}/productions/{slug}`. The independent
`src/data/productionRoutes.ts` module is the single route contract and owns:

- `productionSlugs`;
- the `ProductionSlug` type;
- the `isProductionSlug` guard; and
- `getProductionDetailPath(slug)` for list-to-detail path construction.

The route module does not import `pageContent`. `productionContent.ts` imports
the contract for localized lookup and integrity checks, `pageContent.ts` uses
the path helper instead of hardcoded detail URLs, and the dynamic page uses the
same allowlist for static generation and runtime validation. This dependency
direction avoids circular imports.

The supported slugs are:

- `audio-innovation`
- `creative-platform`
- `live-experience`

The locale layout and production slug page both export
`dynamicParams = false`. The build prerenders exactly those three slugs for each
of `en`, `ja`, and `zh-cn`, producing exactly nine production detail routes.
Every other slug and locale is rejected by the closed route tree before the
detail page evaluates.

PR #14 deliberately preserves closed static locale and slug routing. Unmatched
routes use the framework-global 404. Application-wide localized unmatched-route
handling is deferred because Next.js `globalNotFound` is experimental and
outside Stage 4A scope.

The framework-global 404 returns HTTP 404 without redirecting and includes the
Next.js-injected `<meta name="robots" content="noindex" />`. It does not render
localized unmatched-route copy in this vertical slice. The unreachable nested
Productions layout, not-found component, localized not-found component, and
unused localized not-found labels were removed.

URL locale state, cookie fallback behavior, and valid-route locale switching
remain unchanged. Switching language on a production detail page preserves
both `productions` and the active slug.

## Component and data architecture

- `src/data/productionRoutes.ts` owns route identity and construction without
  importing content.
- `src/data/productionContent.ts` maps the route contract to localized static
  records and verifies that every approved slug occurs exactly once in EN, JP,
  and CN.
- `src/app/[locale]/productions/[slug]/page.tsx` owns the nine static params,
  route validation, localized metadata, and server-side detail composition.
- `src/components/ProductionDetail.tsx` renders the approved production fields
  with the established dark, rounded, blue/teal brand system.
- The existing Productions list continues to use the Stage 3 `ContentCard`.
  Only the three production destinations changed, so its existing locale-safe
  fallback labels render as `View`, `詳細を見る`, and `查看详情`.
- Navbar descendant matching keeps Productions active on valid nested pages in
  desktop and mobile navigation.

No route-specific production copy was added. Every production title,
label-like value, status, description, feature, use case, and specification
comes from the existing localized `pageContent` records repaired in PR #13.

## Detail rendering contract

| Field | Detail behavior |
| --- | --- |
| `id` | Remains a stable content identifier; not exposed as copy. |
| `slug` | Validated by the production-only route contract. |
| `title` | The single page `h1` and localized metadata title source. |
| `description` | Introductory detail copy and localized metadata description. |
| `subtitle`, `type`, `category` | Ordered, deduplicated primary labels. |
| `role` | Supported by the shared model but not populated by productions. |
| `status` | Separately labelled localized status badge. |
| `meta`, `year`, `date`, `location` | Ordered, deduplicated metadata chips when populated; currently absent. |
| `features` | Normalized semantic list under the localized Features heading. |
| `useCases` | Separate normalized semantic list under the localized Use Cases heading. |
| `specs` | Ordered, normalized definition list under the localized Specifications heading. |
| `media.hero` | First approved detail-hero candidate. |
| `media.render` | Second hero candidate; otherwise an optional secondary visual. |
| `media.card` | Third approved hero candidate. |
| `image` | Fourth approved hero candidate. |
| `media.icon` | Optional small decorative icon after approved-asset validation. |
| `href` | Constructed list-to-detail destination; not repeated as a self-link. |
| `links` | Not populated by production records; no detail action is invented. |

The visible detail eyebrow uses centralized interface labels: `Product Details`,
`プロダクト詳細`, and `产品详情`. The semantic back-navigation landmark and
visible link use `Back to list`, `一覧へ戻る`, and `返回列表`. The landmark has a
single localized accessible label, the link retains its visible keyboard focus,
and there are no nested interactive elements.

The Stage 3 normalization helpers continue to remove blank and duplicate list
values and invalid specification rows. Features and use cases use semantic
unordered lists, specifications use a definition list, and the page has one
logical `h1` followed by `h2` section headings. Status includes visible text and
is not communicated by color alone.

## Detail media selection and safety

Shared approval predicates live in `src/data/contentMedia.ts`, rather than a
visual card component. Detail hero selection is exactly:

1. `media.hero`
2. `media.render`
3. `media.card`
4. `image`
5. branded fallback

Every candidate must be both listed in the approved-content manifest and use an
approved raster extension before it can reach `next/image`. An approved
`media.render` is shown in the secondary render slot only when its path differs
from the selected hero path. Therefore a render selected as the hero is never
rendered twice; when another approved asset becomes the hero, a distinct render
may still appear below the content.

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

The approved-content manifest therefore remains empty. The existing white
héReSonare logo renders as an intentional decorative fallback with empty alt
text. No missing production path is requested, and no image, icon, render, or
product claim was fabricated.

## Production HTTP validation

All checks used the built application through `next start`. No invalid route
redirected.

| Route | Expected and observed | `noindex` |
| --- | --- | --- |
| `/en/productions/audio-innovation` | 200 | No |
| `/ja/productions/creative-platform` | 200 | No |
| `/zh-cn/productions/live-experience` | 200 | No |
| `/en/productions/unknown` | 404 | Yes |
| `/ja/artists/artist-01` | 404 | Yes |
| `/zh-cn/music/resonance-01` | 404 | Yes |
| `/en/about/story` | 404 | Yes |
| `/en/contact/artists` | 404 | Yes |
| `/fr/productions/audio-innovation` | 404 | Yes |

The complete local HTTP matrix returned 200 for all 30 existing
locale-prefixed public routes and all nine approved production detail routes.
The build output lists exactly nine prerendered production details.

## Responsive and browser validation

Browser validation covered 390, 768, 1280, and 1440 pixel widths. It verified:

- the detail hero and branded fallback;
- long Japanese and Chinese labels, descriptions, features, use cases, and
  specification values;
- semantic localized back navigation and visible detail eyebrow;
- parent Productions Navbar state on valid details;
- the Productions index and all three localized detail destinations;
- framework-global invalid-production state and `noindex` metadata;
- language switching while preserving `creative-platform`;
- no document-level horizontal overflow or clipped visible content;
- no broken images or missing product-media requests; and
- no browser console warnings or errors.

The Productions hero intentionally clips its decorative glow with
`overflow-hidden`, and screen-reader-only link headings exceed their one-pixel
visual boxes by design. Neither creates document-level overflow or clips visible
content.

## Screenshot evidence

Every evidence file contains JPEG binary data and uses a matching `.jpg`
extension.

| Evidence | Viewport | File |
| --- | --- | --- |
| English Audio Innovation detail | 1280 × 900 | `docs/screenshots/production-detail-pages/en-audio-innovation-1280.jpg` |
| Japanese Creative Platform detail | 1280 × 900 | `docs/screenshots/production-detail-pages/ja-creative-platform-1280.jpg` |
| Chinese Live Experience detail | 1280 × 900 | `docs/screenshots/production-detail-pages/zh-cn-live-experience-1280.jpg` |
| English Audio Innovation mobile detail | 390 × 844 | `docs/screenshots/production-detail-pages/en-audio-innovation-390.jpg` |
| Japanese Creative Platform mobile detail | 390 × 844 | `docs/screenshots/production-detail-pages/ja-creative-platform-390.jpg` |
| Chinese Live Experience tablet detail | 768 × 1024 | `docs/screenshots/production-detail-pages/zh-cn-live-experience-768.jpg` |
| English Productions index | 1280 × 900 | `docs/screenshots/production-detail-pages/en-productions-index-1280.jpg` |
| Framework-global invalid production 404 | 1280 × 900 | `docs/screenshots/production-detail-pages/en-production-unknown-1280.jpg` |

## Deferred work and risks

Stage 4 remains incomplete. Detail routes for artists, releases, events,
venues, videos, store items, and future entity types are intentionally deferred.
Application-wide localized unmatched-route handling is also deferred. CMS and
database integration remain Stage 6. Canonicals, language alternates, sitemap,
robots policy, structured data, and new social images remain Stage 5.

The product-owner terminology review recorded in
`docs/jp-cn-content-repair-audit.md` still applies. Approved production imagery
is also still required before the branded fallback can be replaced.
