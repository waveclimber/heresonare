# Contact inquiry composer

## Visitor journey

- `/en/contact`, `/ja/contact`, and `/zh-cn/contact` now offer a localized inquiry composer above the existing contact paths and official social links.
- Visitors choose a topic, optionally add a name/organization and reply address, and enter a message. The only required text field is the message.
- Production details link to the matching language's contact form and preselect the current concept. Context is resolved against the validated production content repository; unknown query values are ignored.
- Previewing validates the fields and focuses the draft heading. Editing any field removes the outdated preview. Changing language or query context starts a new form with matching labels/context.
- The preview contains the recipient, localized subject, and complete body. It provides an email-app link and a separate full-draft copy action. These actions do not submit to a website backend. Visitors send the message themselves from their email application.
- Encoded email URLs longer than 1,800 characters use the copy path instead of risking truncation by a mail handler. The complete draft remains available in a selectable, read-only text field, including after clipboard denial.
- The page explains that drafts are not automatically saved. No form values are written to storage, sent to an API, or included in page URLs.

## Implementation and accessibility

- Existing routes, page metadata, and content-repository boundaries remain intact. Production options come from `getPageContent`; the browser receives only their slugs and localized titles.
- The form is inside a local Suspense boundary because URL query context is read on the client. Its section heading and direct email link are rendered on the server and remain available without JavaScript.
- Native labeled inputs, select controls, textareas, and buttons preserve keyboard behavior. Validation errors describe the relevant field, the first invalid field receives focus, and clipboard results use a live status region.
- Layout uses one column below the existing large-screen breakpoint and two columns above it. Form controls use 16px text, full available width, and a minimum 48px height. The preview stays in normal flow on smaller screens.
- Clipboard completion is ignored after an edit or unmount so an old copy request cannot report success for a newer draft.
- Existing email-copy buttons now keep their accessible name consistent with their visible copied state.
- No dependencies were added or upgraded in this round.

## Validation

- Clean dependency installation reported zero known vulnerabilities.
- `npm run check` covers lint, types, repository contracts, production build, 39 public routes, and existing metadata, health, locale, and performance gates.
- `check:inquiry` exercises optional fields, whitespace-only messages, invalid and overlong input, unknown/malicious context, actual EN/JP/CN copy, reserved characters, emoji, line-ending normalization, email URL round trips, and complete long-message fallback.
- Site integrity checks verify all nine localized production-to-inquiry links and the three server-rendered inquiry destinations with direct email fallback.
- The contact page was added to the existing performance budget without raising any limits.
- These automated checks do not exercise a real browser, clipboard permissions, operating-system mail handlers, touch behavior, or visual layout. Those behaviors are not claimed as manually verified.

The owner has authorized direct submission and merging in this task. The pull request records the final CI result and merge commit.
