# Website module platform

## Implemented scope

All nine existing sections have a shared typed publishing system. Existing brand/concept pages and production URLs remain intact. Each section links to its new published catalogue at `/{locale}/catalog/{section}`; entries use `/{locale}/catalog/{section}/{slug}`. No fictional business records are seeded into production.

| Module | Working capabilities |
| --- | --- |
| Artists | Localized profiles, biographies, categories, official links, related releases/videos/events |
| Music | Release descriptions, category/search, official listening links and related artists |
| Video | Video descriptions and official viewing links; third-party embeds are not enabled |
| Productions | New project records and related work; the three existing concept routes remain available |
| Tour | UTC-backed start/end dates, venue text, upcoming/past filters, official ticket links and RFC 5545 calendar downloads |
| Venues | Venue profiles, location, official links and related events |
| Store | Product information, currency/price, availability, session basket, quantities, totals and product-enquiry receipts |
| About | Published brand/company updates in three languages |
| Contact | Published contact/help articles plus online enquiry form and private inbox |
| Administration | Login/logout, overview, draft editing, review, publish/unpublish, preview, optimistic revision checks, related records, deletion, enquiry/order status, activity log and content backup download |

Public search and sitemap use only published snapshots. Saving a new draft cannot change the current published page. Review requires complete English/Japanese/Chinese titles, summaries and bodies. Publication is a separate explicit action. One administrator can perform both steps; this is not a two-person approval policy.

## Run locally

1. Install Node 22 or 24, then `npm ci`.
2. Run `npm run platform:setup` once. It creates a random local administrator password, an scrypt hash in ignored `.env.local`, and ignored `.local-platform/admin-access.txt` with the local URL and login details. Existing platform configuration is never overwritten.
3. Run `npm run dev -- --hostname 127.0.0.1`, then open `http://127.0.0.1:3000/zh-cn/manage` (also `/en/manage` and `/ja/manage`).
4. Create content, save, preview the three translations, submit for review and publish. The public catalogue updates immediately. Sitemap regeneration can take up to 60 seconds plus the triggering request.

The local adapter uses a private directory, a cross-process file lock, atomic rename and fsync. It is limited to a loopback origin and is rejected on Vercel. It is intended for local preparation, not a production database. A process crash while holding `write.lock` deliberately fails closed: stop every local app/tool process, back up the directory, confirm no writer remains, then remove only that lock and restart.

## Production configuration

Production defaults to disabled until configured. Public catalogues show an honest empty state, online forms show the existing email fallback, and the workspace explains setup. There is no default production password or remote account.

Configure these as private hosting variables, never `NEXT_PUBLIC_*`:

- `PLATFORM_STORAGE=postgres`
- `PLATFORM_ORIGIN`: the exact canonical HTTPS origin used by the browser. Alternate domains must redirect to it. Preview deployments should use their own isolated origin/database.
- `DATABASE_URL`: managed PostgreSQL connection URI. Use provider-verified TLS (`sslmode=verify-full`) and a least-privilege runtime database role. Do not disable certificate verification.
- `PLATFORM_ADMIN_EMAIL`: the owner's administrator identifier.
- `PLATFORM_ADMIN_PASSWORD_HASH`: `scrypt:<32 hex salt>:<128 hex digest>`, generated with `passwordHash` in `src/platform/security.ts`. Use a new production password; do not reuse local test credentials.

Run `npm run platform:migrate` in an authorized environment with the database configured, before enabling the site. The idempotent transaction creates schema version 1 without replacing existing data. Run migrations with a schema-owner role; the runtime role needs SELECT/UPDATE on `heresonare_platform`. The application does not perform schema DDL on requests. Bind hosting/domain using the existing domain runbook; preserve enterprise email DNS records.

The PostgreSQL adapter uses a single client per transaction and a locked versioned JSONB document. This keeps publishing, revisions, submissions, sessions and quotas atomic across app instances. It intentionally targets a small editorial site: maximum 500 content records, 2,000 enquiries and the latest 500 audit events. Split into normalized indexed tables and paginated queries before raising these limits or accepting high traffic. Each process uses a pool of at most three connections; budget the managed database connection limit across instances.

## Authentication and data handling

- Password hashing uses scrypt (N=32768, r=8, p=1). Random opaque session tokens are stored only as SHA-256 hashes in the database, expire after eight hours and use HttpOnly/SameSite=Strict cookies; HTTPS deployments use Secure. Logout deletes the server session. Changing the configured administrator identity or hash revokes existing sessions.
- Every write verifies the configured Origin and JSON content type, with a bounded streamed request body. Login is durably limited to ten attempts per 15 minutes for the administrator account. This limit intentionally does not trust forwarded IP headers; it may temporarily affect the legitimate administrator during an attack. Use a hosting access policy/MFA gateway for production administration as needed.
- Public submissions require explicit consent, validate fields, use a honeypot, durable global/email quotas and idempotency keys. Server-side catalogue prices replace any client prices. Product enquiries do not charge, reserve inventory, promise delivery or create paid orders. Totals are shown separately for each currency.
- Personal enquiry text is never included in the public search/sitemap, content export, or audit log. Sensitive responses are no-store. Admin pages are noindex. The visitor's name/email/message are not saved in browser storage; the basket stores only product IDs and quantities in sessionStorage, with an in-memory fallback.
- Enquiries remain in the private inbox until an administrator deletes them. Deletion permanently removes their personal fields from live application storage; database backups have their own retention. Configure a real organizational retention policy and backup retention before accepting public enquiries. The UI states the implemented behavior and does not invent a legal policy.
- Logs expose fixed operational error identifiers rather than SQL errors, passwords, request bodies or private messages. Monitor the platform error identifiers and hosting logs. `/api/health` remains the original minimal liveness endpoint; it is not a database readiness guarantee.

## Backups and recovery

The authenticated content export downloads all draft/published content in versioned JSON, excluding enquiries, sessions and passwords. It is an editorial export, not a full database backup. It is not automatically imported or published.

Use the managed provider's encrypted backups/PITR for the PostgreSQL table and test restores in an isolated database. Stop writers before a local backup of `.local-platform/state.json`. To recover, restore the database snapshot (or local state file) with the app stopped, rotate the administrator hash to revoke sessions, then validate public catalogues and inbox counts before reopening traffic. Schema v1 is retained by code rollback; preserve the database when rolling back source. Keep an authorized offline copy of necessary local test work before any workspace cleanup.

## Integrations and remaining business inputs

Official HTTPS links provide listening, viewing, ticket and external store entry points without embedding third-party players or inventing transactions. No automatic outbound email, payment capture, checkout webhook, stock reservation, fulfillment workflow or file upload is claimed. A real payment/fulfillment account, inventory and policies are required before adding paid checkout. A verified email sender is required before automatic receipts/notifications. Approved artist/release/event/product copy and licensed media remain necessary; the existing approved-media registry stays authoritative for the original pages.

No live database provider, mailbox delivery, merchant account, DNS change or production deployment was configured by this code change. Local setup and CI test credentials are isolated from production.

## Verification

`npm run check` includes the original site contracts and budgets plus:

- `check:platform`: all nine module lifecycles, draft/public isolation, translation and relationship validation, revision conflicts, auth/credential rotation, concurrency/rollback, persisted quotas, enquiry privacy/deletion, order prices and calendar output.
- `check:platform-http`: starts an isolated production server using a temporary local store; verifies real API origin checks/cookies, private/public pages, three-language search/details, calendar download, idempotent submission, export isolation, unpublish and session revocation.
- CI runs the same domain tests against a pinned official PostgreSQL 17 image. A local PostgreSQL test is optional via `TEST_DATABASE_URL`, and refuses any database name other than `heresonare_test`.
- Site integrity checks the original 39 routes plus 36 platform entry routes in provider-disabled mode. No platform credentials are required for the normal build.

For deterministic checks after local setup, set `PLATFORM_STORAGE=disabled` only for the build/check process. Do not commit `.env.local`, `.local-platform`, `.next`, generated passwords, database data or test enquiries.

Browser verification used explicitly labelled local-only test content and synthetic contact details. The Chinese workflow covered login, three-language product editing, save/review/publish, basket quantity changes, submission receipt, cleared basket and private order status updates. Japanese catalogue filtering/empty/reset states and English enquiry layout were inspected. Viewports at 1280, 390 and 320 pixels had no horizontal overflow. Screenshots: [desktop workspace](./screenshots/module-platform/zh-cn-admin-desktop.png) and [mobile workspace](./screenshots/module-platform/zh-cn-admin-mobile.png). Local fixtures and credentials are ignored by Git; nothing was sent to an external mailbox or payment service.

The final production preview also verified native required-field focus, Tab navigation from name to email, the live catalogue entry in the existing production page and an empty browser error/warning log. [English enquiry at 320px](./screenshots/module-platform/en-enquiry-mobile.png).

Public-page performance limits remain unchanged. Catalogue discovery links reuse the existing page navigation; redundant content props are omitted, and ASCII card IDs remain compact while a separate Unicode namespace preserves uniqueness.
