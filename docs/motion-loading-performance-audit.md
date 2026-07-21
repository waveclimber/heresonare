# Motion and loading performance audit

## Scope

This pass preserves the approved héReSonare motion identity and visual design.
It audits representative production builds, pauses decorative loops while they
are outside the viewport, and adds a repeatable asset budget. It does not add
dependencies, configure Vercel, sync the company mirror, or change routes and
localized content.

## Findings

The existing Motion foundation is already appropriately split: `LazyMotion`
loads `domAnimation` asynchronously, application components use the strict
`motion/react-m` entry point, and Reduced Motion is handled globally. Replacing
that foundation would trade away interaction quality for little practical
benefit.

The actionable runtime cost was offscreen CSS animation. Before this pass, the
homepage mounted 19 infinite CSS animations and every other sampled route
mounted two footer-ring animations even while the footer was outside the
viewport. Persistent `will-change` hints accompanied those loops.

The spectrum and converge target rings now run only while their containing
visual is near the viewport. Their static form remains rendered at all times,
so content and layout do not jump. Reduced Motion continues to disable the
loops entirely.

## Asset budget

`npm run check:performance` measures unique production assets referenced by
three representative generated HTML files. The full `npm run check` gate runs
it after `next build`.

| Resource | Budget per sampled route |
| --- | ---: |
| HTML (gzip) | 10 KB |
| JavaScript (gzip) | 260 KB |
| CSS (gzip) | 12 KB |
| Fonts | 56 KB |

The samples cover the homepage, the productions index, and a production detail
page. These limits leave a small allowance above the current build while still
failing a material payload regression. They are build-comparison budgets, not
a substitute for real-user Core Web Vitals on the final hosting environment.

## Validation results

| Check | Result |
| --- | --- |
| Full local gate | Passed; 44 static pages generated |
| Homepage payload | 8.3 KB HTML, 235.4 KB JS, 10.4 KB CSS, 51.2 KB fonts |
| Productions payload | 8.3 KB HTML, 244.2 KB JS, 10.4 KB CSS, 51.2 KB fonts |
| Production-detail payload | 7.1 KB HTML, 233.5 KB JS, 10.4 KB CSS, 51.2 KB fonts |
| Desktop homepage at top | 15 visible spectrum loops running; 4 offscreen rings paused |
| Desktop homepage at bottom | 15 offscreen spectrum loops paused |
| Footer visibility cycle | Rings run at the footer and pause again after returning to the top |
| Mobile EN, JA, and ZH-CN samples | No horizontal overflow; offscreen loops paused |
| Browser console | No errors |

Production assets increased by less than 0.5 KB gzip on the homepage compared
with the pre-change build. That small observer cost replaces persistent
offscreen animation and layer hints without removing any approved effect.

## Acceptance criteria

- The homepage spectrum animates when visible and pauses after scrolling away.
- Converge target rings animate near the viewport and pause offscreen.
- Reduced Motion keeps decorative loops and transitions suppressed.
- EN, JA, and ZH-CN page structure, copy, routes, and visual hierarchy remain
  unchanged.
- Representative routes stay within the asset budget after a production build.
- Lint, TypeScript, production build, and the performance budget pass together.
