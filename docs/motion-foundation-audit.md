# Motion foundation audit

## Scope and architecture

- The shared `SiteShell` client boundary owns the site-wide Motion provider.
  The locale layout stays a Server Component and continues to pass its rendered
  page tree through `children`.
- `LazyMotion` runs in strict mode and loads the `domAnimation` feature bundle
  through a dynamic import. Motion primitives import the lightweight `m`
  components from `motion/react-m`; application code does not import the full
  `motion` component.
- `MotionConfig` uses `reducedMotion="user"`. Motion therefore disables
  transform and layout animation for users who request reduced motion while
  allowing opacity state changes to remain.
- Central tokens cover duration, easing, stagger timing, distance, and opacity.
  `Reveal`, `StaggerGroup`, and `StaggerItem` consume those tokens and support a
  constrained set of semantic HTML elements, `className`, and `children`.
- No page or shared content component consumes the new primitives in this
  change. Existing route content and visual behavior are unchanged.

## Progressive enhancement and server rendering

`Reveal` and `StaggerGroup` render the visible variant on the server and during
the first hydration render. After hydration, Motion can prepare content outside
the viewport and reveal it without a React scroll-listener state loop.

A temporary build-only audit route rendered the default primitives for all
three locales. Its generated HTML contained the expected semantic elements and
content with `opacity:1;transform:none`; it contained no `opacity:0`,
`visibility:hidden`, or `display:none` state. The temporary route was removed
before final validation.

## Dependency impact

The only direct dependency added is the exact stable release `motion@12.42.2`,
whose peer range supports the repository's React 19 versions. Its required new
lockfile packages are:

- `motion@12.42.2`
- `framer-motion@12.42.2` (an internal dependency of the published `motion`
  package; it is neither a direct dependency nor an application import)
- `motion-dom@12.42.2`
- `motion-utils@12.39.0`

The already-installed `tslib@2.8.1` satisfies Motion's remaining transitive
requirement. No other dependency was added or upgraded.

## Client bundle baseline

Measurements use production Turbopack output from `next build` at main commit
`5fb281e`. Raw and gzip byte counts sum the unique JavaScript files listed for
the `/[locale]` homepage in its client-reference manifest. The "initial route"
figure also includes the build manifest's framework/runtime and polyfill files.
These are local compiled-asset measurements, not CDN transfer measurements.

| Measurement | Main baseline | Motion foundation | Difference |
| --- | ---: | ---: | ---: |
| Route client entries (raw) | 114,900 B | 149,715 B | +34,815 B |
| Route client entries (gzip) | 32,975 B | 44,975 B | +12,000 B |
| Initial route total (raw) | 684,120 B | 718,935 B | +34,815 B |
| Initial route total (gzip) | 204,754 B | 216,746 B | +11,992 B |

The asynchronous `domAnimation` feature bundle is a separate 42,177 B raw /
15,693 B gzip chunk and is not part of the synchronous route entry. The shared
provider still adds its lightweight runtime to every locale page, and the
feature chunk is requested after hydration. Page-level primitive imports may
add further route-specific code when animations are introduced later.

## Validation baseline

- Production builds before and after the change generated 42 static pages with
  the same locale, static-page, and production-detail route families.
- The final quality gate is `npm run check` (lint, TypeScript, production build).
- Dependency review is limited to the four required new lockfile packages listed
  above.
