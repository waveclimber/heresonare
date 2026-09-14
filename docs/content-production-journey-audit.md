# Public content and production journeys

## Findings and changes

This follow-up starts from merged main commit `69497baf4755a21e0c9a1c8380c6f77fd5568496`.

Eight section introductions still described static records, database schemas, or future implementation. They now address visitors in English, Japanese, and Simplified Chinese. Artist profiles are explicitly examples of creative direction; release dates, tour information, venue locations, and merchandise availability are clearly unconfirmed. Concept identities, development states, and approved descriptions of the actual production concepts remain intact. No artist, event, price, ticket, or commercial availability is invented.

Tour and store availability notices now precede concept cards. The store notice gains a locale-preserving contact action using the existing shared coming-soon renderer and localized content contract.

The nine localized production detail pages now provide native links to their features, use cases, and specifications. Each destination accepts keyboard focus and uses the existing fixed-header offset and Reduced Motion behavior. Navigation and card shells are omitted when their source lists are empty, so missing content cannot create a dead section link or blank feature panel.

A closing inquiry panel offers an email action with a URI-encoded subject containing the localized inquiry label and current concept name. It also reuses the existing clipboard/manual-copy fallback. Clicking the email action opens a mail client; this application does not send email or claim that a message has been delivered.

## Validation

- `npm ci`: passed against the unchanged lockfile; audit reports 0 vulnerabilities.
- `npm run check`: passed on Windows / Node.js 24.18.0 / npm 11.16.0, including lint, types, content and security contracts, production build, all 39 public routes, metadata, six social images, 404s, redirects, health, locale API and existing asset budgets.
- The production integrity gate now checks unique focusable fragment destinations across all routes, the three production section links and localized concept-specific mail subjects on all nine detail pages, and availability-first ordering plus localized contact actions on all six tour/store pages.
- `git diff --check`: passed.
- The updated local preview at `http://127.0.0.1:3000/zh-cn/productions/audio-innovation` returned HTTP 200.
- Representative detail-page output remains within the original budget: 8.6 KB compressed HTML, 223.3 KB compressed JavaScript, 10.7 KB compressed CSS, and 51.3 KB fonts. No budget is relaxed.

Browser interaction and screenshot validation remain pending. No browser approval was received during this follow-up, so the earlier clipboard, mobile navigation, resize, keyboard, and visual acceptance checklist is not claimed as completed. Review the new section links, inquiry panel, and status-first tour/store layout across the three languages at desktop and mobile sizes when performing that acceptance.

## Scope and delivery

No dependency, route, content-provider, image asset, DNS, hosting, analytics, checkout, or company-mirror configuration changes are included. Existing unapproved media continues to use the established fallback.

The owner previously authorized direct submission and merge with later log review, and asked to continue improving the site. This follow-up uses that same workflow: create a focused PR, wait for GitHub quality checks, then squash-merge the checked commit. CI and final merge evidence are recorded in the PR and commit history. No separate deployment is performed.
