# Editorial publishing extension

This pass adds images, cover descriptions, home selections and section highlights, heading/list/bold formatting with preview, copying, revision history, draft-only content imports, unsaved-edit guards and batch enquiry status updates. See [owner-launch-checklist.md](./owner-launch-checklist.md) for the business inputs still required.

## Migration and storage

Re-run the idempotent migration when upgrading: it adds `heresonare_media` without changing document version 1 or replacing existing content. The runtime role needs SELECT/INSERT/DELETE on that media table and SELECT/UPDATE on `heresonare_platform`. Image bytes are separate from the JSON document. Media changes and document metadata share one PostgreSQL transaction.

Local image files are fsynced before the atomic document commit. A crash may leave an inaccessible orphan file; metadata and published-reference checks prevent serving it. With all writers stopped, back up both `state.json` and `media/` together. Inspect unreferenced media files before removing any crash leftovers. Local storage remains prohibited on Vercel.

Limits: 500 content records, 2,000 enquiries, a 32 MiB JSON document, 500 recent audit events, 200 images of at most 512 KiB each. This remains a small editorial platform. Use indexed tables and a suitable media delivery service before expanding capacity or traffic.

`npm run platform:doctor` checks configuration, content/media access, image presence and capacity without changing records or revealing credentials or message bodies. It does not prove deployment, email delivery or provider backup readiness.

## Images and access

Uploads require an administrator session, matching Origin, explicit rights confirmation and a durable 30/hour quota. Only single-frame JPEG/PNG/WebP inputs up to 2 MiB and 20 megapixels are decoded. Sharp 0.35.5 normalizes images to WebP, removes metadata, limits dimensions to 1600 × 1600 and rejects output over 512 KiB. Original images are not retained. See the official [input limits](https://sharp.pixelplumbing.com/api-constructor/) and [output metadata behavior](https://sharp.pixelplumbing.com/api-output/).

Unpublished images require an admin session. Anonymous access is allowed only while a published snapshot uses the image. Responses are no-store with `Vary: Cookie`; unpublishing removes future anonymous access. Copies already downloaded by visitors cannot be revoked. Draft/published/history references prevent deleting an in-use image. Publication requires all three alt descriptions. External image fetching, SVG, HTML, documents and animations are unsupported. This library does not change the original static approved-media registry.

## Editing and publication

Formatting supports headings (`##`/`###`), unordered lists (`- `) and bold (`**text**`). React escapes text; HTML is never interpreted. A formatting toolbar and preview are included. Copying opens an unsaved new draft and requires a different URL slug. Unsaved changes trigger an in-workspace confirmation, a guard for same-site navigation links and a browser unload warning.

The home page shows up to six selected published entries; section pages show their latest three. Both retain static generation with 60-second revalidation. Publication/unpublication explicitly invalidates localized home/section URLs and sitemap. Locale layout allows on-demand regeneration and still validates supported locales. Unknown section/concept URLs are internally rewritten to the existing dynamic localized 404 route, retaining no-store and noindex rather than inheriting a static cache lifetime. Database errors omit optional highlights, emit a fixed diagnostic identifier and leave the brand page available.

## History, imports and full backups

Each item retains up to five earlier drafts, bounded by the latest 100 versions across the site. Restore creates a new draft revision without changing the public snapshot. Review and publication are still separate actions.

Content export contains draft/published records and retained history, excluding image bytes, enquiries, sessions, quotas and credentials. It is not a full operational backup. For full recovery, back up both PostgreSQL tables together using the provider's encrypted backups/PITR and test restoration in isolation.

The workspace inspects exported JSON (up to 80 MiB / 500 records) before importing selected current drafts. Existing records are unselected by default. Each selected item is validated and committed individually; a failure stops the sequence and the completed count remains visible. Imports preserve record IDs, require the current revision, leave public snapshots/inquiries unchanged and never restore published status. Missing images are identified before import and removed from restored drafts. Reupload/reselect them before publishing. Related records may be restored in any order, but dependencies must be published before dependent records pass review. History from the file is not imported.

Inbox batches update up to 50 selected statuses atomically. Any stale or missing item rejects the entire batch.

## Verification

Domain checks run the image/privacy/history/import/batch lifecycle against local storage and the real PostgreSQL CI service. The HTTP suite verifies authentication, Origin checks, private/public image transitions, escaped formatted text, homepage/section updates, and recovery isolation using a production server. Existing site, language, error-response and performance checks remain required. Performance budgets run immediately after build, before the publishing HTTP tests regenerate ISR files; this measures the deterministic pristine build rather than test-mutated cache artifacts. All numeric limits remain unchanged.

No production provider, mailbox, payments, live DNS or paid services are configured by this change. Generated UI fixtures and local credentials stay ignored by Git.

Local browser acceptance covered image upload with explicit rights, backup preview/import, cover selection with all three descriptions, save/review/publish, homepage discovery, history restoration preserving the published cover, copying to a new empty URL slug, and unsaved navigation guards. Escape returned focus to the original navigation link. Chinese published content and Japanese image management had no horizontal overflow at 320 pixels; the English recovery view was checked at the same width. The final browser console contained no warnings/errors. [Desktop history](./screenshots/editorial-platform/zh-cn-history-desktop.png), [mobile published content](./screenshots/editorial-platform/zh-cn-published-mobile.png), [Japanese mobile media library](./screenshots/editorial-platform/ja-media-mobile.png). The solid-color cover and all shown records are explicitly labelled local test fixtures.
