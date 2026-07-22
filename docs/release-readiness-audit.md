# Release readiness audit

## Scope

This pass hardens the current concept-content release without changing the
approved motion identity, adding dependencies, configuring Vercel, or touching
the company mirror. It covers the public EN, JA, and ZH-CN routes in the
`waveclimber` repository.

No production domain is bound yet. The production origin defaults to the
candidate `https://heresonare.com` and can be replaced with the server-side
`SITE_URL` when testing or when the final canonical domain is confirmed.
`NEXT_PUBLIC_SITE_URL` remains supported only as a temporary legacy input.

## Implemented

### Search and sharing metadata

- Added a shared production-origin helper and locale-aware absolute URLs.
- Added a canonical URL to every indexable route.
- Added `hreflang` alternates for `en`, `ja`, `zh-CN`, and `x-default`.
- Added page-specific Open Graph URLs and explicit index/follow directives.
- Added `/robots.txt` with the API excluded from crawling.
- Added `/sitemap.xml` for 39 public URLs: 13 route shapes in three locales.
- Added locale alternates to each sitemap entry.

An approved 1200 x 630 social sharing image is still a brand-content input.
Until it exists, pages retain text metadata and the current summary card rather
than publishing an improvised campaign asset.

### Navigation and accessibility

- Added a localized skip link as the first keyboard-focusable control.
- Added a stable `main-content` target to all page foundations.
- Removed redundant keyboard stops from pointer-responsive card wrappers; the
  contained links remain the single interactive target.
- Added Escape-key closing and mutually exclusive states for the mobile and
  language menus.
- Corrected the logo's accessible name so image and visible text are not read
  twice.
- Added a consistent, visible brand-colored focus indicator.
- Kept the existing Motion `reducedMotion="user"` behavior and CSS fallback.
- Applied the loaded Geist variable font instead of the previous Arial body
  fallback.

### Error handling

- Added a localized, branded 404 experience for EN, JA, and ZH-CN.
- Added an unmatched localized-route fallback, including nested paths.
- Kept known routes statically generated while allowing unknown page and
  production parameters to reach the branded 404 safely at runtime.
- Confirmed error pages return HTTP 404 and include `noindex`.

## Validation results

| Check | Result |
| --- | --- |
| ESLint | Passed |
| TypeScript | Passed |
| Production build | Passed; 44 static pages generated |
| Sitemap routes | 39 checked, 0 failures |
| Discovered internal links | 42 checked, 0 failures |
| Unknown localized routes | HTTP 404, branded locale content, `noindex` |
| Mobile JA homepage | No horizontal overflow |
| Mobile menu | Opens correctly and closes with Escape |
| Keyboard order | Skip link first; no redundant motion-wrapper stops |
| Canonical and alternates | Verified on home and production-detail samples |
| Robots and sitemap endpoints | HTTP 200 with production-origin URLs |

The browser pass covered desktop and mobile production previews. Subjective
motion feel and operating-system Reduced Motion remain product-owner checks,
because they depend on real pointer feel and the user's OS accessibility
setting rather than static validation alone.

## Initial payload observation

Measurements use the unique assets referenced by production HTML and gzip the
local build files. They are a repeatable build comparison, not a substitute for
real-user monitoring.

| Route | HTML gzip | JS gzip | CSS gzip | Fonts |
| --- | ---: | ---: | ---: | ---: |
| `/en` | 8.5 KB | 240.7 KB | 10.6 KB | 52.4 KB |
| `/en/productions` | 8.5 KB | 249.4 KB | 10.6 KB | 52.4 KB |
| `/en/productions/audio-innovation` | 7.3 KB | 238.7 KB | 10.6 KB | 52.4 KB |

No new dependency or media payload was added in this pass. Before a public
launch, set a real-user performance budget and monitor Core Web Vitals on the
final hosting environment.

## Open release inputs

1. Bind and confirm the canonical production origin in a separate operational
   task. If it is not `https://heresonare.com`, set `SITE_URL` before building.
2. Approve a dedicated multilingual social sharing image when brand artwork is
   ready.
3. Resolve the dependency advisory through an approved Next.js upgrade path.
   `npm audit --omit=dev` currently reports two moderate findings caused by
   Next.js's bundled PostCSS `<8.5.10` (GHSA-qx2v-qp2m-jg93). The automated
   suggestion is an unsafe downgrade to Next.js 9.3.3, so no dependency was
   changed in this task.
4. Define hosting monitoring, rollback ownership, and the company-mirror sync
   policy as a separate operational task.
