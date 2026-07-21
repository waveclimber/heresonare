# Concept content interaction contract

## Scope

This pass makes concept and coming-soon cards honest about their current
availability. It changes no routes, visible copy, media, motion primitives,
dependencies, SEO policy, Vercel configuration, or company-mirror state.

## Action contract

- `PageContentItem.href` is reserved for a stable destination that differs
  from the containing list route.
- `PageContentItem.links` is reserved for explicit supplementary or external
  actions.
- An item without either field is informational. Its status remains visible,
  but it does not render a link or receive the interactive lift treatment.
- A data assertion rejects future item actions that point back to their own
  list route.

## Changed behavior

Eight misleading list-card actions were removed:

- two Artists profile actions that returned to `/artists`;
- two Music view actions that returned to `/music`;
- one action each on the Tour, Venues, Video, and Store concept records that
  returned to their own list route.

The three Productions cards retain their localized detail destinations. The
two Contact cards retain their email actions, and the Tour coming-soon block
retains its localized Contact CTA.

EN, JP, and CN remain structurally aligned. The Japanese and Chinese Artist
profile labels were removed together with the unavailable English actions, so
no orphaned localization data remains.

## Validation

- ESLint: passed.
- TypeScript: passed.
- Production build: passed; 44 pages generated.
- Desktop EN: Artists, Music, Tour, Venues, Video, and Store cards expose no
  unavailable links or interactive lift state.
- Desktop EN: all three Productions detail links and both Contact email actions
  remain present.
- Mobile JA and ZH-CN: the same interaction contract remains aligned, with no
  document-level horizontal overflow.
- Tour's localized Contact CTA remains available outside the informational
  event card.
- Browser console: no warnings or errors.
