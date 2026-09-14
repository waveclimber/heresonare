# Site search

## Visitor behavior

- Every public page has one search button in the navigation, visible on desktop and mobile. Ctrl+K or Command+K also opens search.
- Search uses the current language and links only to that language's public destinations. Its index includes the homepage, nine section pages, and three production details per locale.
- Empty queries offer six pages to explore. Nonempty queries match across page names, headings, descriptions, section content, and public concept details. All query terms must match; title matches rank first and ties preserve source order.
- Matching handles case, accents, punctuation, and full-width input. A concept's own page ranks above its catalog when its name is searched. Development status remains visible on production results.
- Loading, no-results, clear-search, failure, and retry states are localized in EN/JP/CN. Failed or timed-out requests can be retried without losing the query.
- Search text is held in memory and never placed in URLs, browser storage, or API requests. The browser fetches the public index only when search opens.

## Architecture and interaction

- `/api/search?locale=...` builds the index through the existing validated content repository and returns only public display text and destinations. The index is cacheable for five minutes and carries `X-Robots-Tag: noindex`. Missing, unsupported, or duplicate locale parameters receive a non-cacheable 400 response.
- Client-side index validation rejects malformed entries, duplicate destinations, external URLs, cross-locale URLs, traversal, query strings, and fragments. Input and index sizes are bounded.
- The native dialog provides modal semantics and keyboard focus containment. Opening focuses the search field; Escape and the close button close the dialog before unmounting so its prior focus can be restored. Navigating to a result closes search. Modified link clicks retain normal browser behavior.
- Results are ordinary links reached with Tab and activated with Enter. Result counts and request status use a polite live region. Results scroll within the viewport; the search field and close control remain outside that scroll area.
- Open requests are canceled on unmount and time out after ten seconds. Background scrolling is restored on cleanup. Search state resets when the route changes.
- Navigation utility strings were extracted into CSS to keep server-rendered HTML within the existing performance budget. Below the small-screen breakpoint, the brand uses an 18px wordmark and an 8px logo gap to make room for the search control. Existing larger-screen typography is retained.
- Search, menu, and language buttons share the same border/hover treatment and a minimum 44px target. Desktop link styles are shared through the navigation container rather than repeated on every link.

## Validation

- Clean `npm ci`: zero known vulnerabilities, no dependency changes.
- `npm run check`: lint, types, all repository contracts, inquiry regression checks, new search checks, production build, 39 public routes, and unchanged performance budgets.
- Search checks cover title ranking, multi-term matching, accents, full-width English/Japanese input, Chinese text, whitespace, punctuation, stable ties, query limits, and malformed/untrusted index entries.
- Production HTTP checks validate all three locale indexes against all 39 generated destinations and their real page headings; each page is searchable by its title. They also verify production status, music concepts inside parent pages, cache headers, and invalid locale responses.
- Static page checks verify exactly one localized search button per public page.
- These checks do not execute a real browser or constitute manual visual, touch, focus, or screen-reader acceptance. Those behaviors have been reviewed in source but are not claimed as manually verified.

The owner authorized direct submission and merging for this task. The pull request records the final GitHub CI result and merge commit.
