# Roadmap

This ordered roadmap records direction, not fixed delivery dates. Each stage should become one or more scoped issues with owners, acceptance criteria, constraints, and validation steps before implementation.

## 1. Workflow foundation

**Objective:** Establish a safe, repeatable path from product goal to reviewed change.

**Major deliverables:** Repository guidance, project README, development workflow, issue and pull request templates, lint/type-check/build scripts, and pull request CI.

**Acceptance conditions:** Work occurs on focused branches; pull requests begin as drafts; `npm run check` runs locally and in GitHub Actions; diffs receive scope, localization, accessibility, dependency, and secret review; Codex does not merge automatically.

**Dependencies or risks:** The repository has no unit, integration, or end-to-end test suite yet, so linting, type checking, production builds, manual review, and focused validation remain the available safeguards.

## 2. Complete multilingual navigation and locale handling

**Status:** Completed in the locale-routing foundation work.

**Objective:** Make navigation and locale behavior consistent across English, Japanese, and Simplified Chinese.

**Major deliverables:** Localized navigation and related interface labels, a centralized locale model, locale-prefixed public routes, and cookie/`Accept-Language` fallback redirects for legacy routes.

**Acceptance conditions:** Navbar and Footer labels display approved EN, JP, and CN text; locale changes behave consistently across routes and reloads; accessibility labels and metadata follow the approved locale strategy; fallback behavior is documented and tested.

**Dependencies or risks:** The URL is now the active locale source, with a preference cookie used only for legacy redirects. Language alternates require an approved production domain and canonical policy, so they remain deferred with sitemaps, robots, structured data, analytics, and social-image work to Stage 5.

## 3. Render the full static content model

**Status:** Completed through the shared static-content rendering work and the
aligned English, Japanese, and Simplified Chinese content repair. Approved real
production content and media may replace placeholder records later; those
editorial replacements do not make the Stage 3 engineering incomplete.

**Objective:** Render every approved field in the existing static page-content architecture consistently.

**Major deliverables:** Complete shared renderers for supported hero, section, item, link, specification, feature, use-case, empty-state, and status content; aligned EN, JP, and CN data coverage.

**Acceptance conditions:** Every approved content field has a deliberate rendering or omission rule; all nine section routes render their available localized structures without ad hoc route-specific duplication; responsive and accessibility checks pass.

**Dependencies or risks:** Several routes still contain placeholder or coming-soon content. Editorial approval and structurally aligned EN, JP, and CN data are required before placeholders can be treated as production content.

Concept records without stable detail destinations now render as informational
cards rather than linking back to their own list pages. A data-level assertion
protects that interaction contract while approved content remains pending.

## 4. Add dynamic detail pages

**Status:** In progress. Stage 4A delivers the production-only vertical slice;
detail routes for every other content type remain deferred.

**Objective:** Support stable detail routes for entities such as artists, releases, productions, events, venues, videos, and store items when approved content exists.

**Major deliverables:** Route and slug conventions, typed detail models, shared detail layouts, not-found behavior, internal links, and localized detail content handling.

**Acceptance conditions:** Approved entities resolve to stable detail URLs; invalid slugs return the intended not-found experience; list-to-detail navigation, responsive behavior, keyboard access, metadata, and EN/JP/CN impact are validated.

**Dependencies or risks:** Depends on a complete static content model and product-approved URL strategy. Premature route conventions could create migration and SEO costs when CMS-backed content arrives.

**Stage 4A completed slice:** The approved `audio-innovation`,
`creative-platform`, and `live-experience` records now generate nine localized
production detail pages across EN, JP, and CN. Productions list cards link to
those localized routes, nested pages retain the Productions Navbar state,
localized detail metadata and back navigation are present, and missing product
media continues to use the audited branded fallback without broken requests.
Known locale and slug parameters remain statically generated. Unknown localized
page and production parameters now resolve through the branded locale-aware 404
with `noindex`, while unsupported locales continue to use the framework-global
404. No other detail route is supported yet.

## 5. Complete SEO infrastructure

**Status:** In progress. Canonical URLs, language alternates, page metadata,
sitemap, robots policy, the minimal structured-data foundation, and localized
social imagery are now in place. Final production-domain confirmation remains
open.

**Objective:** Provide technically complete, locale-aware discovery and sharing metadata.

**Major deliverables:** Canonical URL rules, sitemap, robots policy, Open Graph and social images, structured data where appropriate, detail-page metadata, and an approved multilingual SEO strategy.

**Acceptance conditions:** Every indexable route has accurate unique metadata; canonical, sitemap, robots, and social preview behavior validate in production-like builds; locale alternates are implemented only after the URL locale strategy is approved.

**Dependencies or risks:** No production domain is bound. The canonical origin
defaults to the candidate `https://heresonare.com` and remains configurable
through the server-side `SITE_URL` until the production domain is confirmed.
More specific rich-result entity types depend on approved public content and
must not be inferred from concept records.

## 6. Introduce CMS or database-backed content

**Status:** Preparation in progress. The public content Data Access Layer and
static adapter are in place; provider selection and remote data access remain
open.

**Objective:** Allow authorized editors to manage approved content without routine code deployments.

**Major deliverables:** Content-platform selection, schema mapping from existing TypeScript models, preview and publishing workflow, asset handling, locale validation, migration tooling, and access controls.

**Acceptance conditions:** Editors can preview and publish validated EN, JP, and CN content; schema validation prevents incomplete structures; the application handles unavailable content and platform failures safely; migration and rollback procedures are documented.

**Dependencies or risks:** Depends on stable content and route models. Platform cost, vendor lock-in, credentials, permissions, cache invalidation, migration fidelity, and editorial workflow require product and operational decisions.

**Current preparation:** Pages, metadata, structured data, and social cards now
consume one asynchronous server-only repository contract. The existing
TypeScript content remains the selected adapter, so this preparation adds no
database dependency, credential, network read, publishing workflow, or visual
change. A future provider must map into the public DTOs and preserve the
localized 404, route-allowlist, and full quality-gate contracts.

Every non-null repository result now also passes a provider-independent runtime
contract. Exact public fields, nested content shapes, requested identities,
unique page IDs, safe links, and normalized media paths are enforced before
content reaches a route. Negative fixtures and the complete static corpus are
part of the local and CI quality gate. Provider selection, remote access,
preview and publication workflows, credentials, and cache invalidation remain
open decisions.

Unexpected page and application-shell failures now resolve through localized
runtime boundaries with explicit user retry and homepage recovery. The public
screen does not expose raw errors or diagnostic identifiers. A future provider
must preserve the distinction between expected missing records, which use the
localized 404, and unexpected failures, which reach these boundaries. External
monitoring, alert routing, timeout budgets, and incident ownership remain open.

## 7. Harden deployment and company-repository synchronization

**Objective:** Make preview, production, rollback, monitoring, and synchronization with the company repository reliable and auditable.

**Major deliverables:** Documented deployment environments, protected release workflow, rollback procedure, monitoring and performance budgets, dependency/security maintenance, and an explicit company-repository synchronization policy.

**Acceptance conditions:** Releases are reproducible from reviewed commits; CI and required approvals protect production; rollback is tested; monitoring ownership is defined; repository synchronization direction, conflict handling, credentials, and audit expectations are documented.

**Dependencies or risks:** Requires repository-owner decisions about hosting, branch protection, company remote authority, secrets management, and incident ownership. Divergent histories or automated bidirectional synchronization could overwrite reviewed work if not carefully controlled.

**Current HTTP baseline:** Hosting-independent security headers, framework-owned
cache expectations, a minimal uncached liveness endpoint, and hardened locale
preference responses are protected by the production-server integrity gate.
HSTS, CDN configuration, external monitoring, and incident ownership remain
deferred until the domain and hosting platform are approved.

**Current CI and release-security baseline:** The quality workflow now pins
every external Action to the immutable commit behind a reviewed upstream
release, keeps the token read-only, removes persisted checkout credentials,
uses the shared `.nvmrc` Node baseline, and rejects new critical production
dependency advisories. A local contract protects those settings. The active
`main` ruleset and a hosting-independent release and rollback procedure are
documented; production approval count, hosting commands, monitoring ownership,
rollback drill, and company-mirror policy remain owner decisions.

**Current server-observability baseline:** Unexpected server request failures
now emit one fixed JSON event through the stable framework instrumentation
hook. The event contains a generated event ID, safe framework digest, route
template, request method, and bounded execution context; it excludes raw error
details, requested URLs, query values, headers, cookies, authorization data,
content, and personal identifiers. No exporter or monitoring vendor is
connected. Hosting log collection, access, retention, alert routing, sampling,
and incident ownership remain deployment decisions.

**Current cross-site QA baseline:** The supported route shapes now pass focused
desktop, tablet, and mobile overflow checks. Escape-key menu dismissal restores
focus to its trigger, the skip link and visible focus treatment are verified,
and the compiled Reduced Motion contract covers CSS and Motion-driven effects.
Representative operating-system and device checks remain part of the final
pre-launch validation.

**Current performance baseline:** Representative production routes now have an
automated HTML, JavaScript, CSS, and font asset budget in the local quality
gate. Decorative spectrum and converge-target loops pause outside the viewport,
while the established Motion identity and Reduced Motion contract remain
unchanged. Final-host field monitoring and ownership are still Stage 7 inputs.

**Current content-intake baseline:** Real content media remains opt-in. A
reviewable JSON approval list and automated repository check now protect file
existence, directory, type, size, casing, and content-reference consistency.
The prioritized copy/media intake checklist defines what the product owner must
approve before concept records or branded fallbacks are replaced.

**Current site-integrity baseline:** The local and CI quality gate now verifies
all 39 public localized URLs, internal-link closure, canonical and language
metadata, sitemap and robots output, legacy locale redirects, localized 404
behavior, and rendered local image existence against a production build.

**Current site-configuration baseline:** A validated server-only production
origin, safe environment template, Node.js baseline, and automated negative
configuration cases prepare the application for later domain binding. They do
not configure DNS, HTTPS, hosting, a database, or the company mirror.

**Current structured-data baseline:** All 39 public pages now expose one
sanitized, locale-aware JSON-LD graph. Homepages identify the organization and
multilingual website; inner pages provide WebPage identity and localized
breadcrumbs. Concept production records deliberately make no product, offer,
event, or availability claims.

**Current social-sharing baseline:** EN, JP, and CN pages now publish dedicated
1200 by 630 Open Graph and large Twitter cards. The shared design applies the
brand's pulse, ripple, orbit, and spectrum language without changing the page
interface; localized copy and alternative text are generated from the existing
content model. Runtime image validity, dimensions, type, and size are protected
by the site-integrity gate.
