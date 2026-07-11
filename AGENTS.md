<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# héReSonare repository guide

## Scope

- This repository contains the public héReSonare website.
- Preserve the established visual language, page content, and routes unless a task explicitly asks to change them.
- Keep changes focused. Do not add or upgrade dependencies without explicit approval.

## Architecture

- Next.js 16 App Router source lives in `src/app`.
- Shared UI components live in `src/components`.
- Client-side language selection is managed by `src/context/LanguageContext.tsx` and persisted in `localStorage`; locales are not URL-based or server-selected.
- Localized site and page copy lives in `src/data`. Keep EN, JP, and CN content entries structurally aligned.
- Route definitions and the Navbar/Footer labels live in `src/data/navigation.ts`; those labels are currently fixed English text, not localized content.
- The nine section routes use shared static-page foundations, and some content remains placeholder or coming-soon material.
- Static assets live in `public`.

## Implementation rules

- Treat navigation labels, CTA labels, accessibility labels, metadata, empty states, and status text as user-facing content.
- Evaluate the EN, JP, and CN impact of every user-facing change, even when the visible text initially appears language-neutral.
- Reuse existing shared components, data types, and content architecture before creating alternative implementations.
- Check desktop and mobile responsive behavior for every visual or interactive change.
- Check keyboard access, semantic HTML, focus behavior, and accessible names for every interactive change.

## Working agreement

- Never modify or commit directly to `main`; create a purpose-specific branch from the latest `main`.
- Before editing, inspect `git status` and stop if unrelated changes could be overwritten.
- Never commit secrets, credentials, `.env` files, or generated build output.
- Never force-push.
- Never merge automatically; leave merge approval and execution to the repository owners.
- Prefer small, reviewable commits and document material behavior changes.

## Validation

Run the full local quality gate before handing off a change:

```bash
npm ci
npm run check
```

Always run `npm run check` before declaring completion. For documentation-only work, still run the checks when project configuration or workflow files change.

## Codex review checklist

Before committing, pushing, or declaring completion, review the complete diff for:

- scope creep or unrelated changes;
- accidental route, layout, styling, or visual changes;
- hardcoded user-facing text that bypasses the content architecture;
- EN, JP, or CN localization omissions;
- keyboard, semantic HTML, focus, accessible-name, or other accessibility regressions;
- dependency or lockfile changes that were not explicitly approved;
- secrets, credentials, environment values, or other sensitive data exposure;
- missing automated or manual validation evidence.
