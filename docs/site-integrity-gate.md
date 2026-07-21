# Automated site integrity gate

## Scope

This task turns the existing release-readiness spot checks into a repeatable
production-build gate. It changes no page content, routes, metadata policy,
page visual design, motion behavior, dependencies, Vercel configuration, or
company mirror state.

`npm run check:site` runs after `next build`. It inspects generated HTML and
metadata outputs, starts the production server on an available local port,
checks runtime responses, and always stops the temporary server afterward.

## Protected contracts

### Public routes and localization

- All 39 public URLs exist: 13 route shapes across EN, JA, and ZH-CN.
- Generated pages use `en`, `ja`, or `zh-CN` as the matching HTML language.
- Every page has a title, description, `main-content` landmark, canonical URL,
  Open Graph URL, and explicit `index, follow` policy.
- Every page has exact `en`, `ja`, `zh-CN`, and `x-default` alternates.

### Navigation and local assets

- Every rendered root-relative link resolves to a supported public route.
- Internal links preserve the active locale.
- Every public route is reachable from at least one rendered internal link.
- Local image sources rendered into HTML resolve to files under `public/`.
- The homepage Contact section and standalone Contact page in every locale each
  expose exactly one approved Instagram, Xiaohongshu, and Douyin link.
- Contact social links retain localized labels and new-tab announcements plus
  `noopener noreferrer` protection.

### Discovery endpoints

- `sitemap.xml` contains exactly 39 unique canonical URLs.
- Every sitemap entry has EN, JA, and ZH-CN alternates.
- `robots.txt` allows public pages, blocks `/api/`, and uses the configured
  production host and sitemap URL.
- Both endpoints return HTTP 200 from the production server.

### Structured data

- Every public page contains exactly one parseable JSON-LD graph.
- `WebPage` identity, URL, copy, and language match the rendered metadata.
- Localized homepages contain the stable `Organization` and multilingual
  `WebSite` entities.
- Inner pages contain complete locale-preserving `BreadcrumbList` trails.
- Concept production detail pages are not mislabeled as products, offers, or
  other unapproved entity types.

### Social sharing images

- Every public page exposes exactly one locale-matching Open Graph image and
  one locale-matching Twitter image.
- Both channels publish a localized, non-empty, matching alternative text and
  use the large Twitter card format.
- Metadata declares PNG output at exactly 1200 by 630 pixels.
- The production server must return all six locale/channel endpoints as valid
  PNG files at the declared dimensions and no larger than 5 MB.

### Redirects and errors

- Legacy unprefixed routes redirect using `Accept-Language`.
- A valid locale preference cookie overrides the language header.
- Representative EN, JA, and ZH-CN unknown routes return HTTP 404, include
  `noindex`, and retain their HTML language and locale context in the streamed
  React Server Component payload used by the localized not-found experience.
- An unsupported locale returns HTTP 404.

## Maintenance rule

The route fixture is intentionally explicit. Adding, removing, or renaming a
public route must update the site code and this gate in the same reviewed
change. This makes route and SEO surface changes visible instead of allowing a
generated snapshot to approve itself automatically.

The check uses only Node.js and the installed Next.js package. It adds no test
framework or runtime dependency. Browser interaction and subjective visual or
motion acceptance remain separate when a task changes the interface or a
generated social asset.

## Validation results

The full local quality gate passed against the production build:

- Next.js generated 44 static pages.
- All 39 public localized routes returned HTTP 200.
- All 39 internal destinations formed a closed, locale-preserving route set.
- Metadata and language alternates passed for all 39 public pages.
- Structured data and localized breadcrumbs passed for all 39 public pages.
- Three localized Open Graph and three localized Twitter image endpoints
  returned valid 1200 by 630 PNG files.
- Six localized Contact surfaces exposed all three approved social profiles
  with localized accessible text and safe external-link behavior.
- Generated and runtime sitemap and robots checks passed.
- Three representative locale redirects and three localized 404 responses
  passed.
- Existing performance budgets passed without threshold changes.

No browser-based visual acceptance was required because this task changes no
rendered interface, content, or motion behavior.
