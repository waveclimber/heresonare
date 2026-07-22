# Public content repository boundary

## Current status

The website still uses the reviewed TypeScript records under `src/data`. No
database, CMS, provider SDK, credential, connection string, write path, or
runtime environment variable has been added.

This boundary makes a later data-source change reviewable without coupling
database queries to page components. It follows the Next.js server-side Data
Access Layer guidance while keeping the current static build deterministic.

## Architecture

Public routes, metadata, structured data, and social-card generation read
content through `src/content/repository.ts`. That server-only module exposes
cached asynchronous functions backed by `staticContentRepository` today. Every
non-null adapter result passes the provider-independent runtime contract before
it reaches an application consumer.

The public contract supports three reads:

- localized site and homepage content;
- localized section-page content;
- localized production-detail content.

The static adapter is the only application runtime module allowed to import
the site and page content records directly. Client components receive public,
serializable content through props and cannot import the server repository.
Navigation identities, locale definitions, interface controls, and route
allowlists remain code-owned rather than database-owned.

## Failure and publication rules

- Site-shell and homepage copy is required. An adapter failure must fail the
  build or request instead of silently publishing an incomplete shell.
- A supported page without published content resolves to the localized 404.
- A supported production slug without published detail content resolves to the
  localized 404.
- Unknown locales, page keys, and slugs are rejected before repository access.
- Repository results are public DTOs only. Future adapters must not return
  credentials, internal workflow notes, author records, or provider payloads.
- Runtime validation rejects unknown public fields, incomplete nested shapes,
  unsafe links or media paths, duplicate page identities, and requested-route
  identity mismatches. Errors never echo rejected content values.
- Reads have no mutation side effects. Drafting and publishing require a
  separately reviewed authorization and write-path design.

`npm run check:content-boundary` protects the server-only modules, prevents
client imports of the repository, and blocks direct static-content imports
from application pages, components, and libraries.
`npm run check:content-contract` exercises valid and invalid provider-shaped payloads;
the production build validates the complete current static corpus. See
`docs/content-runtime-contract.md` for the exact rules and failure behavior.

## Database or CMS adapter checklist

Complete these decisions before replacing the static adapter:

1. Approve the provider, region, pricing, ownership, backup, and exit policy.
2. Map provider records into the existing public content DTOs without leaking
   provider-specific types into components or bypassing runtime validation.
3. Define stable IDs, locale uniqueness, slugs, draft/published states, media
   references, and required-field validation.
4. Keep route allowlists code-owned until URL migration and redirect policy is
   approved explicitly.
5. Define caching, revalidation, preview isolation, failure fallback, and
   rollback behavior before enabling remote reads.
6. Store credentials only in the hosting secret store and access them only
   inside the server-only adapter.
7. Run migration comparisons across EN, JA, and ZH-CN and require byte-level or
   approved editorial differences for rendered public content.
8. Run the full site-integrity gate before switching the selected adapter.

The first database task should add one provider adapter behind the existing
contract. It should not rewrite components or introduce a parallel client-side
fetching path.
