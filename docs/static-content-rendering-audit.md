# Static content rendering audit

This audit covers Roadmap Stage 3 on all nine public section pages in English,
Japanese, and Simplified Chinese. The three locales share the English content
structure, so every populated field listed below is present in all three locale
variants unless noted otherwise.

## Field usage matrix

| Field | Populated in source | Rendering rule |
| --- | --- | --- |
| `subtitle` | 15 items across every section page | First-priority item label. |
| `role` | 2 artist items | Rendered after `subtitle` when its value is distinct. The current values duplicate `subtitle`, so one semantic label is shown. |
| `type` | 8 music, production, venue, video, and store items | Rendered after `role` when distinct. |
| `category` | 3 production items | Rendered after `type` when distinct. The current values duplicate `subtitle`, so one semantic label is shown. |
| `status` | 11 items across artists, music, productions, tour, venues, video, and store | Rendered in a separately labelled status badge; it is never substituted for the primary label. |
| `meta` | No current items | Supported in the metadata list when content is added. |
| `year` | 3 music and video items | Rendered as a metadata value. |
| `date` | 1 tour item | Rendered as a metadata value. |
| `location` | 2 tour and venue items | Rendered as a metadata value. Distinct metadata values are preserved in source order. |
| `image` | 2 artist items | Second media candidate after `media.card`; rendered with `next/image` only when the audited local file exists. |
| `media.card` | 3 production items | First card-media candidate. |
| `media.render` | 3 production items | Third card-media candidate when it is an audited raster asset. |
| `media.icon` | 3 production items | Audited separately and rendered as a small decorative product icon, never as the card photograph. |
| `features` | 3 production items | Rendered under a localized heading as a semantic unordered list. |
| `useCases` | 3 production items | Rendered under a localized heading as a semantic unordered list. |
| `specs` | 3 production items | Rendered under a localized heading as a definition list. Exact duplicate label/value pairs are removed; authored status-like specifications remain because they provide their own definition term. |
| `links` | 4 artist and contact items | Rendered with their localized provided labels in a semantic list. Internal destinations retain the active locale; external and `mailto:` destinations remain unchanged. |
| `href` | 13 items across every page except About | Added as the localized `View` fallback only when `links` does not already contain the same destination. No detail route is inferred from `slug`. |

Label-like values (`subtitle`, `role`, `type`, `category`), metadata values, link
destinations, and specification pairs are deduplicated within their respective
semantic groups. Matching content is not silently discarded across unrelated
groups: for example, a specification retains its authored term even when its
value resembles an item status.

`id` remains the stable render key and accessible-heading identifier. `slug`
remains structural data for the future detail-route stage and is not converted
into an unapproved route. `media.hero` is intentionally deferred because Stage
3 only defines card-media priority; the current shared page hero has no item
media slot.

## Media audit

No content-specific media file referenced by `pageContent.ts` currently exists
under `public/`. The renderer checks candidates against the audited public
asset list and therefore does not issue any request for these missing paths.
It uses the existing héReSonare white SVG logo as a decorative branded fallback.

Missing artist media:

- `/images/placeholders/artist-01.jpg`
- `/images/placeholders/artist-02.jpg`

Missing production media:

- `/images/products/audio-innovation/card.webp`
- `/images/products/audio-innovation/hero.webp`
- `/images/products/audio-innovation/render.webp`
- `/images/products/audio-innovation/icon.svg`
- `/images/products/creative-platform/card.webp`
- `/images/products/creative-platform/hero.webp`
- `/images/products/creative-platform/render.webp`
- `/images/products/creative-platform/icon.svg`
- `/images/products/live-experience/card.webp`
- `/images/products/live-experience/hero.webp`
- `/images/products/live-experience/render.webp`
- `/images/products/live-experience/icon.svg`

## Screenshot evidence

All screenshots are JPEG files captured from the local Next.js app. They cover
the requested four responsive widths and all three locales.

| Evidence | Viewport | File |
| --- | --- | --- |
| Basic artist cards | 1280 px, English | `docs/screenshots/static-content-rendering/en-artists-1280.jpg` |
| Dense production cards | 1440 px, Japanese | `docs/screenshots/static-content-rendering/ja-productions-1440.jpg` |
| Coming-soon section | 768 px, Simplified Chinese | `docs/screenshots/static-content-rendering/zh-cn-tour-768.jpg` |
| Mobile music card | 390 px, English | `docs/screenshots/static-content-rendering/en-music-390.jpg` |

Browser checks found no document-level horizontal overflow, no card-level
overflow, and no broken image elements at these widths. The JP and CN source
page copy predates this change and contains question-mark placeholders; Stage 3
preserves that existing content rather than inventing editorial replacements.
