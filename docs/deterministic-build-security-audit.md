# Deterministic build and dependency security audit

## Scope

This task removes the production build's dependency on downloading Google
Fonts and applies the latest stable Next.js 16.2 patch available on
2026-07-23. It does not change routes, content, motion behavior, hosting, the
company mirror, or database integration.

## Deterministic font loading

- Geist Sans and Geist Mono are now loaded through `next/font/local`.
- The two variable WOFF2 files are vendored under `src/assets/fonts/geist`.
- The Latin variable subsets come from the official Google Fonts CSS API;
  their upstream family is Vercel's Geist repository.
- The SIL Open Font License, source URLs, upstream repository, package source
  for the license, and SHA-256 checksums are stored beside the font files.
- Production builds no longer contact `fonts.googleapis.com`.

The existing `--font-geist-sans` and `--font-geist-mono` CSS variables are
unchanged, so the visual font contract remains stable.

## Dependency updates

- `next`: `16.2.7` to `16.2.11`
- `eslint-config-next`: `16.2.7` to `16.2.11`
- `js-yaml`: `4.2.0` to `4.3.0` through a compatible lockfile update
- `brace-expansion`: vulnerable lockfile copies updated to `1.1.16` and
  `5.0.7`

No force fix, major downgrade, or dependency override is used.

## Upstream advisories still open

The latest stable Next.js package still declares `sharp@^0.34.5` and bundles
`postcss@8.4.31`. As a result, `npm audit --omit=dev` still reports:

- high: `sharp <0.35.0` through Next.js
- moderate: `postcss <8.5.10` through Next.js

npm's automated force fix proposes downgrading the application to Next.js
9.3.3, which is incompatible with this repository and must not be applied.
Overriding Sharp outside Next.js's declared compatibility range is also
deferred until Next.js publishes a supported stable update or an isolated
cross-platform image-optimization validation proves the override safe.

The current site does not accept user-uploaded images or user-authored CSS,
which limits exposure, but the remaining advisories stay on the pre-launch
security checklist.

## Validation contract

- `npm ci`
- `npm run check` without external font-network access
- `git diff --check`
- `npm audit --omit=dev`
- desktop and mobile comparison of representative EN, JA, and ZH-CN routes

## Validation results

| Check | Result |
| --- | --- |
| Clean install | Passed with the updated lockfile |
| Offline quality gate | Passed without Google Fonts access |
| Production build | Passed; 44 static pages generated |
| Site integrity | Passed; 39 public localized routes |
| Font payload | 51.3 KB on all three performance samples |
| EN desktop | Font loaded; no horizontal overflow |
| JA and ZH-CN mobile | Font fallback loaded; no horizontal overflow |
| Browser console | No warnings or errors |
| Full dependency audit | Three upstream findings: two high, one moderate |
