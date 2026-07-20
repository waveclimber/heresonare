# Media discovery audit

## Repository inventory

The repository currently contains brand logo assets only. No artist,
production, release, venue, or video raster media exists under `public/`, and
`approvedContentMediaPaths` is empty. Content records reference future files,
but those paths are intentionally rejected by the existing media allowlist.

| Area | Content readiness | Media readiness | Decision |
| --- | --- | --- | --- |
| Productions | Three structured records and three localized detail routes | Future paths exist; files are absent and unapproved | First motion pilot using honest code-native signal frames |
| Artists | Two development records | Placeholder paths do not exist | Keep current fallback until real profiles and approved portraits exist |
| Music | Two concept records | No cover media | Defer cover/release interactions |
| Video | One development record | No thumbnail or video media | Defer playback interactions |
| Tour / Store / Venues | Placeholder or concept content | No approved media | Defer media-specific motion |

## Productions pilot

The pilot replaces the repeated logo fallback in Productions with three
code-native signal compositions:

- Audio Innovation uses layered resonance waves and a blue/teal spectrum.
- Creative Platform uses routed paths and a pink/blue signal system.
- Live Experience uses responsive wave arcs and a teal/yellow spectrum.

The list cards and production detail heroes use the same frame component. The
visuals describe a direction rather than pretending to be product photography.
When an allowlisted raster file becomes available, the component renders it
with a clipped entrance, restrained hover scale, and scanning-light overlay.

## Interaction and accessibility

- Signal paths draw when their frame enters the viewport.
- Pointer hover or keyboard focus moves one scanning-light pass and expands the
  spectrum bars; no animation runs continuously.
- Reduced Motion renders paths immediately, removes the scanning pass, and
  removes bar transitions.
- Code-native signal surfaces are decorative and excluded from the
  accessibility tree. Approved images retain meaningful alt text.
- The implementation changes no content, routes, dependencies, or media
  allowlist entries.

## Validation

- ESLint: passed.
- TypeScript: passed.
- Production build: passed; 42 static pages generated.
- Desktop EN Productions list and Audio Innovation detail: passed.
- Mobile JA Productions list: passed.
- Mobile ZH-CN Creative Platform detail: passed.
- Repeated logo fallback count on pilot routes: zero.
- Horizontal overflow checks: passed at desktop and mobile widths.
