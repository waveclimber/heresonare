# Structured data foundation

## Scope

This task adds a minimal, locale-aware JSON-LD model to every supported public
page. It changes no visible content, route, motion behavior, dependency,
deployment configuration, or company-mirror state.

The model intentionally describes only facts already established by the
website. Placeholder productions and other concept records are not presented as
products, offers, events, people, reviews, or released creative works.

## Schema model

| Page type | Schema.org nodes | Purpose |
| --- | --- | --- |
| Localized home | `Organization`, `WebSite`, `WebPage` | Identify the brand, multilingual website, and current localized homepage. |
| Localized section | `WebPage`, `BreadcrumbList` | Describe the current page and its localized path from the homepage. |
| Production detail | `WebPage`, `BreadcrumbList` | Describe the approved detail URL without making unapproved product or availability claims. |

The stable organization and website IDs use the configured site origin. Each
`WebPage` uses the same title, description, language, and canonical URL as the
page metadata. Breadcrumb names reuse existing localized page or production
titles, and every breadcrumb URL remains within the active locale.

## Implementation and safety

- `src/lib/structuredData.ts` builds the shared graph from existing content and
  locale sources.
- `src/components/StructuredData.tsx` renders one native
  `application/ld+json` script per public page.
- The serialized payload replaces `<` with `\u003c`, following the Next.js
  guidance for preventing injected markup from terminating the script element.
- No third-party schema package or runtime dependency is required.

## Automated contract

The production-build site integrity gate verifies all 39 public pages:

- exactly one parseable JSON-LD script exists;
- the schema context and allowed node set match the route type;
- `WebPage` ID, URL, name, description, language, website reference, and
  organization reference match rendered metadata;
- the home graph contains the stable organization and multilingual website;
- inner-page breadcrumb IDs, positions, names, and locale-preserving URLs are
  complete;
- production detail pages use only page and breadcrumb schemas.

## Maintenance rule

Add a more specific entity type only when its underlying content is approved
and publicly supported. Rich-result fields must not be inferred from concept
copy. New routes must update the explicit route fixture and structured-data
expectations in the same reviewed change.

## Validation results

- `npm ci` completed from the committed lock file with no dependency changes.
- The full `npm run check` quality gate passed.
- Next.js generated all 44 expected static pages.
- All 39 public routes passed metadata, JSON-LD, localized breadcrumb, link,
  sitemap, robots, redirect, and localized 404 checks.
- Representative production asset budgets passed; the additional serialized
  markup remains within the established HTML limits.
- No browser-based visual acceptance was required because the task changes no
  rendered interface or motion behavior.
