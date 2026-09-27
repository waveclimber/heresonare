# Contact inquiry composer

## Visitor journey

- `/en/contact`, `/ja/contact`, and `/zh-cn/contact` now offer a localized inquiry composer above the existing contact paths and official social links.
- Visitors choose a topic, optionally add a name/organization and reply address, and enter a message. The only required text field is the message.
- Production details link to the matching language's contact form and preselect the current concept. Context is resolved against the validated production content repository; unknown query values are ignored.
- Previewing validates the fields and focuses the draft heading. Editing any field removes the outdated preview. Changing language or query context starts a new form with matching labels/context.
- The preview contains the recipient, localized subject, and complete body. It provides an email-app link, full-draft copy action, and an explicit plain-text download. These actions do not submit to a website backend. Visitors send the message themselves from their email application.
- Encoded email URLs longer than 1,800 characters use the copy path instead of risking truncation by a mail handler. The complete draft remains available in a selectable, read-only text field, including after clipboard denial.
- The page explains that drafts are not automatically saved. Form values are not automatically persisted, sent to an API, or included in page URLs. Downloading explicitly saves a text file through the visitor's browser.

## Draft controls update (2026-09-27)

- Every valid preview can be downloaded as `heresonare-inquiry.txt`, including long drafts whose email-app link is unavailable. The file contains the recipient, localized subject, and complete message. A local `data:text/plain;charset=utf-8` download needs neither clipboard permission nor a server request; filenames contain no visitor data.
- Exported text uses a UTF-8 BOM and consistent CRLF line endings for desktop editors. Reserved characters are encoded in the download URL and invalid Unicode surrogate values are replaced without throwing.
- Continue editing returns keyboard focus to the message field. Changing any field invalidates the preview, copy status, and download together so they cannot retain an older message.
- Reset clears visitor-entered fields, preview, validation, copy state, and character count, and restores the original topic/concept context. Resetting entered content requires the visitor's confirmation; canceling preserves it. A blank form with validation errors can be reset without a destructive confirmation. Focus returns to the first field.
- Fields now have explicit React state. Switching away from Production and back preserves the selected concept while the form is open; non-production drafts still exclude that hidden concept.
- All new action labels, confirmation text, and save guidance are aligned across EN/JP/CN. Existing wrapping action rows and mobile/desktop form layout are reused without new styles or dependencies.

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
- `check:inquiry` exercises optional fields, whitespace-only messages, invalid and overlong input, unknown/malicious context, actual EN/JP/CN copy, reserved characters, emoji, line-ending normalization, email URL round trips, and complete long-message fallback. Download checks decode the actual text payload and verify all three languages, BOM, CRLF, full 3,000-character messages, malformed Unicode, text-only markup handling, and the fixed filename.
- Site integrity checks verify all nine localized production-to-inquiry links and the three server-rendered inquiry destinations with direct email fallback.
- The contact page was added to the existing performance budget without raising any limits.
- These automated checks do not exercise a real browser, clipboard permissions, operating-system mail handlers, touch behavior, or visual layout. Those behaviors are not claimed as manually verified.
- Browser verification was attempted for the 2026-09-27 update. The browser runtime reported no available browser and discovery returned an empty list. Download dialogs, reset confirmation, focus, and responsive behavior were reviewed in source but remain unverified in a real browser.

The owner has authorized direct submission and merging in this task. The pull request records the final CI result and merge commit.
