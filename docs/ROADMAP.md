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

**Dependencies or risks:** The URL is now the active locale source, with a preference cookie used only for legacy redirects. Locale-aware canonical policy, sitemaps, robots, structured data, analytics, and social-image work remain intentionally deferred to Stage 5.

## 3. Render the full static content model

**Objective:** Render every approved field in the existing static page-content architecture consistently.

**Major deliverables:** Complete shared renderers for supported hero, section, item, link, specification, feature, use-case, empty-state, and status content; aligned EN, JP, and CN data coverage.

**Acceptance conditions:** Every approved content field has a deliberate rendering or omission rule; all nine section routes render their available localized structures without ad hoc route-specific duplication; responsive and accessibility checks pass.

**Dependencies or risks:** Several routes still contain placeholder or coming-soon content. Editorial approval and structurally aligned EN, JP, and CN data are required before placeholders can be treated as production content.

## 4. Add dynamic detail pages

**Objective:** Support stable detail routes for entities such as artists, releases, productions, events, venues, videos, and store items when approved content exists.

**Major deliverables:** Route and slug conventions, typed detail models, shared detail layouts, not-found behavior, internal links, and localized detail content handling.

**Acceptance conditions:** Approved entities resolve to stable detail URLs; invalid slugs return the intended not-found experience; list-to-detail navigation, responsive behavior, keyboard access, metadata, and EN/JP/CN impact are validated.

**Dependencies or risks:** Depends on a complete static content model and product-approved URL strategy. Premature route conventions could create migration and SEO costs when CMS-backed content arrives.

## 5. Complete SEO infrastructure

**Objective:** Provide technically complete, locale-aware discovery and sharing metadata.

**Major deliverables:** Canonical URL rules, sitemap, robots policy, Open Graph and social images, structured data where appropriate, detail-page metadata, and an approved multilingual SEO strategy.

**Acceptance conditions:** Every indexable route has accurate unique metadata; canonical, sitemap, robots, and social preview behavior validate in production-like builds; locale alternates are implemented only after the URL locale strategy is approved.

**Dependencies or risks:** Locale-prefixed routing and language alternates are established, but complete multilingual SEO still depends on approved canonical rules, detail-page URLs, production domains, and final social metadata content.

## 6. Introduce CMS or database-backed content

**Objective:** Allow authorized editors to manage approved content without routine code deployments.

**Major deliverables:** Content-platform selection, schema mapping from existing TypeScript models, preview and publishing workflow, asset handling, locale validation, migration tooling, and access controls.

**Acceptance conditions:** Editors can preview and publish validated EN, JP, and CN content; schema validation prevents incomplete structures; the application handles unavailable content and platform failures safely; migration and rollback procedures are documented.

**Dependencies or risks:** Depends on stable content and route models. Platform cost, vendor lock-in, credentials, permissions, cache invalidation, migration fidelity, and editorial workflow require product and operational decisions.

## 7. Harden deployment and company-repository synchronization

**Objective:** Make preview, production, rollback, monitoring, and synchronization with the company repository reliable and auditable.

**Major deliverables:** Documented deployment environments, protected release workflow, rollback procedure, monitoring and performance budgets, dependency/security maintenance, and an explicit company-repository synchronization policy.

**Acceptance conditions:** Releases are reproducible from reviewed commits; CI and required approvals protect production; rollback is tested; monitoring ownership is defined; repository synchronization direction, conflict handling, credentials, and audit expectations are documented.

**Dependencies or risks:** Requires repository-owner decisions about hosting, branch protection, company remote authority, secrets management, and incident ownership. Divergent histories or automated bidirectional synchronization could overwrite reviewed work if not carefully controlled.
