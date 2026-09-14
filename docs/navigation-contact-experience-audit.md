# Navigation and contact experience

## Scope and findings

The September 15, 2026 repository review identified three visitor-facing gaps:

- The mobile navigation used an unbounded, single-column overlay. Its nine links and three language choices could extend below short viewports.
- Homepage discovery/contact buttons only called `scrollIntoView`, so they did not provide shareable fragment links, browser history entries, or a keyboard-focus destination. Language changes also discarded the query string and fragment.
- Email actions depended on an installed mail client. There was no clipboard alternative or failure guidance. Contact-page introductory copy described implementation details instead of addressing visitors.

The existing content repository, routes, brand artwork, concept records, social destinations, and production deployment topology are preserved. Fourteen existing media references still await approved assets and continue using their established fallback.

## Changes

- Mobile navigation now uses two columns, a dynamic viewport height limit, scrolling, safe-area padding, and touch-sized controls. Desktop navigation uses 14px default labels and a teal active state on the more opaque header.
- Navigation and language disclosures close on outside pointer/focus movement and responsive breakpoint changes. Escape restores the trigger focus. Path-keyed navigation resets disclosure state during navigation, including back/forward transitions. Selecting the current language restores trigger focus without adding a duplicate route.
- Language selection retains both query and fragment while keeping the existing locale-preference API behavior.
- Homepage calls to action are native fragment links. Their named section targets accept focus, and root scroll padding accounts for the fixed header. Smooth scrolling respects Reduced Motion; the Next.js root attribute preserves instant route-transition scroll restoration.
- A shared email-copy control appears on the homepage, email contact cards, and footer. It reports success only after the clipboard write resolves. Unsupported or denied clipboard access exposes localized guidance and a selectable read-only address. No message is sent and no form backend is added.
- New labels, status/failure text, navigation landmark names, and contact introductions are aligned across EN, JP, and CN.

## Approved dependency maintenance

The owner explicitly approved security upgrades during this task. Next.js and `eslint-config-next` move from 16.2.11 to 16.3.5. Compatible lockfile security fixes include Sharp, PostCSS, Nanoid, browser data, Tailwind's existing dependency family, and affected development dependencies. React and Motion remain at their existing declared versions; no new direct dependency is added.

The original audit reported 9 affected packages, including critical Next.js advisories [GHSA-p293-qw3h-jr36](https://github.com/advisories/GHSA-p293-qw3h-jr36) and [GHSA-2xp9-vwfh-vxw4](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4). The final clean `npm ci` audit reports **0 vulnerabilities**. This records the package audit result, not a penetration-test claim.

## Validation evidence

Local environment: Windows, Node.js 24.18.0, npm 11.16.0. The repository CI independently uses its existing Node.js 22 baseline on Ubuntu.

- `npm ci` passed using the updated lockfile.
- `npm run check` passed: lint, types, security/configuration/content/error/observability contracts, production build, all 39 public pages, internal-link closure, six social images, localized 404s, redirects, health, locale API, and existing asset budgets.
- The production integrity check additionally asserts localized navigation and email-copy accessible names across all 39 routes, and native focusable homepage fragment destinations in all three locales.
- `git diff --check` passed.
- The local preview at `http://127.0.0.1:3000/zh-cn` returned HTTP 200 after the upgrade.

Browser interaction and screenshot testing have **not** been performed in this task. The automated checks above do not establish visual acceptance or exercise clipboard permissions. Before merging, inspect EN/JP/CN at desktop, tablet, 320/390px mobile, short landscape, and 200% text enlargement. Exercise menu scrolling, Tab/Shift+Tab, Escape, outside dismissal, resize, history navigation, language selection with query/fragment, both homepage anchors, and clipboard success/denial/unavailability. Confirm Reduced Motion in the browser.

## Release boundary

This work is delivered as a Draft PR. The owner reviews and merges through the existing personal-to-company-to-Vercel workflow. No production deployment, DNS update, company-repository synchronization, new content claim, or CMS integration is performed.
