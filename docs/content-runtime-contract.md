# Public content runtime contract

## Purpose

TypeScript protects the reviewed static adapter at development time, but a
future database or CMS response is untrusted at runtime. The public content
repository now validates every non-null result before pages, metadata,
structured data, or social cards can consume it.

This work selects no provider, adds no SDK or dependency, reads no network
data, and changes no rendered content. It makes the existing Data Access Layer
the enforcement point for a later adapter.

## Enforcement point

`src/content/repository.ts` remains the only application-facing public-content
reader. Its cached functions now validate results from the selected adapter:

- site and homepage content must satisfy the complete public shell contract;
- section-page content must match the requested page identity;
- production detail content must match the requested approved slug;
- a nullable page or detail result remains the deliberate unpublished-content
  signal used by localized not-found handling.

Validation happens before a result is returned to a route. Required shell data
fails closed: an invalid provider response throws instead of silently
publishing incomplete or unsafe content.

## Validated rules

The runtime contract checks:

- exact public fields, rejecting provider metadata, credentials, workflow
  notes, and other undeclared properties;
- required non-empty, trimmed public strings and bounded arrays;
- lowercase kebab-case page, section, item, and production identifiers;
- requested page-key and production-slug identity;
- unique section and item IDs within a page;
- nested heroes, sections, cards, specifications, features, use cases,
  coming-soon content, and actions;
- root-relative internal links, HTTPS external links, and mail links while
  rejecting script URLs, protocol-relative links, credentials in URLs, and
  ambiguous external-link flags;
- normalized files below `/images/` with approved image extensions and no
  traversal, backslash, query, or fragment syntax.

Errors identify only the public contract path and violated rule. They do not
echo the rejected provider value, which avoids copying secrets or draft copy
into build and server logs.

## Automated validation

`npm run check:content-contract` exercises valid site, page, and detail
fixtures plus negative cases for:

1. undeclared provider fields;
2. missing localized page metadata;
3. page identity mismatch;
4. duplicate item identity;
5. present-but-undefined optional fields;
6. unsafe public links;
7. media-path traversal;
8. production identity mismatch.

The check is part of `npm run check`. The production build additionally runs
the validator against the complete current EN, JP, and CN static adapter,
providing positive coverage for the actual content corpus.

## Future adapter requirements

A database or CMS adapter must map provider records into the existing public
DTOs before returning them. It must not weaken, bypass, catch-and-ignore, or
duplicate this validator. Provider-specific validation may be stricter, but
the public repository contract remains the final application boundary.

Provider selection still requires separate decisions for schema ownership,
locale uniqueness, publishing states, preview isolation, credentials,
caching, revalidation, failure behavior, migration comparison, backups, and
rollback. This runtime contract does not authorize a database connection or a
content write path.
