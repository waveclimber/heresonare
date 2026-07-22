# Runtime error recovery

This baseline keeps unexpected rendering failures usable and safe before a
remote CMS or database is selected. It does not add a data provider,
credential, network request, monitoring vendor, or deployment dependency.

## User experience

- `src/app/[locale]/error.tsx` handles failures inside a localized route while
  the language layout remains available.
- `src/app/global-error.tsx` is the final fallback when the localized layout or
  another application-shell layer cannot render.
- Both screens use the existing brand glow language, retain visible focus
  treatment, and offer a framework retry plus a localized homepage route.
- English, Japanese, and Simplified Chinese recovery copy is stored with the
  other interface labels in `src/data/interfaceContent.ts`.
- The global fallback reads the locale from the current URL when the regular
  language context is unavailable.

The branded 404 remains separate. A 404 represents a known missing route or
record; the runtime boundary represents an unexpected failure while rendering
a route that should be available.

## Information safety

The public screen never renders an error message, stack, cause, or digest.
Client diagnostics log only the framework digest when one is available. A
future monitoring integration may use that digest to correlate the user-safe
screen with server-side logs, but it must not send content records,
credentials, or personal data by default.

## Future provider requirements

A CMS or database adapter should continue to return `null` for an expected
missing record so the localized 404 can render. Unexpected provider failures,
timeouts, malformed responses, and contract violations should throw so the
runtime boundary can contain them.

Provider retries must be bounded and should live in the server-side repository
layer. The screen's retry action is a user-controlled fresh render, not an
automatic retry loop. Before production launch, owners still need to decide
monitoring, alert routing, incident ownership, and acceptable provider timeout
and retry budgets.

## Validation

`npm run check:error-recovery` protects the required Client Component
boundaries, full-document global fallback, retry controls, localized content
shape, and rule against rendering raw diagnostics. `npm run check` includes
that contract as well as linting, type checking, the production build, and the
existing site-integrity checks.
