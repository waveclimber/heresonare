# Website feature readiness — 2026-09-29

This pass prepares the public brand-site visitor journey. It does not claim that an unpublished catalog, checkout, ticketing system, CMS, or production deployment exists.

## Available visitor features

| Journey | Current behavior |
| --- | --- |
| Explore | 39 localized public routes, nine section catalogs, three production concepts, localized navigation and recovery screens |
| Find | Site search in EN/JP/CN, including nested catalog content and visitor-question answers; search text stays in browser memory |
| Navigate a page | Native section links, focusable destinations, and contact/help shortcuts on all section pages |
| Start a collaboration | Each of the eight non-contact catalogs links to an inquiry with the relevant topic; production details retain their specific concept |
| Prepare a message | Topic-specific guidance, optional name/reply email, validation, complete preview, manual email sending, copy and text download |
| Edit or clear | Editing invalidates the old draft; concept selection survives topic changes; inline reset confirmation defaults focus to keeping the draft, supports Escape, and restores the original topic after confirmation |
| Get help | Five localized native FAQ disclosures explain sending, useful inquiry details, webmail/long messages, availability, and draft retention; footer access on all public pages |
| Discover/share | Canonical URLs, language alternates, sitemap, robots, structured data, and localized social cards remain covered by the existing gate |

## Reliability changes

- The inquiry form renders only after hydration. A browser with unavailable scripts retains the server-rendered direct email link instead of exposing a native GET form that could put typed fields into the URL.
- Desktop navigation no longer displays the mobile toggle. Its explicit breakpoint rule avoids an unlayered shared control style overriding `xl:hidden`.
- Browser-native reset confirmation was replaced with an inline confirmation. This retains the discard safeguard without blocking the page or depending on the host browser's JavaScript-dialog support. Cancel preserves all fields; subsequent editing dismisses a pending confirmation.
- Reused card, media, and inquiry styles reduce repeated markup. Only the current page's journey labels cross the client boundary; FAQ data stays in its server-rendered section and public search index.
- Unapproved media paths are removed from catalog client props while the existing fallback rendering signal is retained. The editorial media registry and repository content remain unchanged.
- Tailwind scans the application and component directories explicitly, preventing documentation or test text from generating unrelated utilities. All JSX class sources are under those directories; new UI outside them must be registered. See [Tailwind source detection](https://tailwindcss.com/docs/detecting-classes-in-source-files).
- No dependencies, public route shapes, performance limits, hosting configuration, or DNS records changed.

## Validation evidence

- Clean `npm ci`: zero known vulnerabilities at installation time.
- Full `npm run check`: lint, types, content/security/configuration contracts, build, all 39 routes, metadata, social images, locale/recovery/health checks, inquiry/search regressions, and original performance limits.
- The production integrity gate additionally checks contextual inquiry destinations for all 24 localized catalog pages, section-link closure, five native FAQ disclosures in each contact page, help access on every public page, and discovery of webmail answers through each localized search index.
- In-app browser: Chinese desktop consultation validation, concept retention across topic switches, preview, a 3,000-character message with full-text fallback, and focus restoration when continuing to edit.
- A real browser download produced `heresonare-inquiry.txt`. The downloaded UTF-8 file was checked for BOM, selected concept, full synthetic Chinese/English message, and emoji. The browser's download-event waiter timed out despite the completed file; evidence comes from the resulting file, not that event.
- Inline reset: keep/cancel retains synthetic text; confirming clears it, restores the originally preselected artist topic, and focuses that topic. Default focus goes to Keep editing.
- Native FAQ links focus the section; keyboard Enter expands a disclosure. Search finds the Chinese webmail answer; a real Escape key closes the search dialog and the close button restores focus to its trigger.
- The artist catalog's CTA opens the matching inquiry topic. Mobile language changes from CN to JP to EN preserve its query and fragment. English and Japanese mobile layouts and Chinese desktop layout were inspected, with no horizontal overflow at 320 and 390 pixels. Desktop navigation was checked at 1280 pixels. Browser console inspection reported no warnings or errors in the final preview.
- Screenshots: [English help at 320px](./screenshots/visitor-journey/en-help-320.png), [Chinese help at 1280px](./screenshots/visitor-journey/zh-cn-help-1280.png).

Operating-system mail delivery, screen-reader speech, physical touch devices, and external social account availability are not claimed as tested. No test email was sent.

## Remaining launch inputs

1. **Approved public content:** artist identities, releases and playable media, confirmed events/venues, products/prices, and approved photography. The current concept notices and branded fallbacks remain accurate.
2. **Commerce, if required:** a chosen ticket/commerce service, inventory, merchant/payment account, fulfillment and cancellation policies, and real purchase URLs. There are no pretend purchase controls.
3. **Direct website submissions, if required:** an authorized delivery/storage service, destination ownership, spam controls, and data handling/retention decisions. Current inquiries are prepared locally and sent by the visitor's email app.
4. **Content administration, if required:** a chosen CMS, editor access and publishing workflow. The validated server repository is ready for an adapter; no admin login or remote provider is configured.
5. **Production operations:** approved company-mirror/hosting access, domain binding, live-site acceptance, monitoring and rollback ownership. On 2026-09-29 this machine could not resolve usable address data for `https://heresonare.com/api/health`; this does not identify the authoritative DNS cause, and live readiness is not established. Follow `domain-binding-runbook.md` and preserve enterprise-mail records.

The owner has authorized direct PR submission and merging. Merge and CI evidence are recorded in the pull request; merging source is not evidence of a production deployment.
