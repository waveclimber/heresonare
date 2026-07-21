# Homepage Motion pilot audit

## Scope and effect matrix

The pilot consumes the shared Motion provider, tokens, and primitives only on
the localized homepage. It adds no dependency and does not add parallax or
scroll-linked state.

| Homepage area | Effect | Timing and distance |
| --- | --- | --- |
| Hero copy | Eyebrow, business areas, title, subtitle, description, and CTA group enter as one hierarchy | 560 ms per layer, 60 ms stagger, 12 px upward reveal, enter easing without spring or bounce |
| Latest Release | The existing card reveals independently from the copy hierarchy | 560 ms, 12 px upward reveal |
| Featured Products | Existing section heading block uses `Reveal`; the three existing links use `StaggerGroup` and `StaggerItem` wrappers | 360 ms, 24 px reveal, 100 ms card stagger |
| About | Existing copy block uses `Reveal`; the three existing cards use a shared stagger group | 360 ms, 12 px copy reveal, 24 px card reveal, 100 ms card stagger |
| Contact | Existing copy and CTA block uses `Reveal`; contact cards and social-status row use a shared stagger group | 360 ms, 12 px copy reveal, 24 px card reveal, 100 ms stagger |

Motion variants animate only `transform` and `opacity`. Neutral outer wrappers
keep Motion transforms separate from the existing card and CTA hover
transforms, so existing hover, focus, and link behavior remains intact. The
decorative glow layers are unchanged; the optional parallax was omitted to
avoid additional client logic, SSR risk, and bundle cost.

## Progressive enhancement and Reduced Motion

- `Reveal` and `StaggerGroup` continue to render their visible variant on the
  server and on the first hydration render. Production HTML for `/en`, `/ja`,
  and `/zh-cn` includes the Hero, Featured, About, and Contact content with
  `opacity:1;transform:none`; it contains no `opacity:0`,
  `visibility:hidden`, or `display:none` animation state.
- The shared `MotionConfig reducedMotion="user"` disables transform animation
  when the user requests reduced motion. Opacity transitions may remain.
- The existing spectrum CSS keeps its `prefers-reduced-motion: reduce` rule and
  stops the spectrum loop in that mode.
- No scroll listener, render-loop state, layout animation, perpetual Motion
  animation, or first-paint blocking work was added. Hero smooth scrolling
  retains its existing reduced-motion `auto` fallback.

## Responsive and accessibility review

Server-rendered browser checks covered all three locale homepages at 390, 768,
and 1280 px. Each route kept four full-width homepage sections with no
horizontal overflow. The EN, JA, and ZH-CN localized Hero and section content
was present at every size, and the desktop/mobile navigation breakpoint
remained unchanged.

The heading levels, native Hero buttons, Featured `Link` elements, mail link,
and external social links retain their accessible names and approved targets.
Motion wrappers are neutral `div` elements around cards, and direct motion
elements preserve the original `h1`, `h2`, `h3`, and `p` semantics. Static
keyboard review confirms the interactive controls remain native buttons or
links and therefore retain Tab, Enter, and Space behavior.

A JavaScript-enabled production preview exercised live hydration and Motion
playback at desktop and mobile sizes. Hero content reached its visible state,
the Contact reveal moved from its initial 12 px offset to `transform:none`
after entering the viewport, and the Hero Contact control retained keyboard
activation. EN, JA, and ZH-CN rendered without horizontal overflow or browser
console warnings/errors. Reduced-motion media emulation was unavailable, so a
final operating-system preference check remains a manual follow-up.

## Client bundle comparison

Both sides were clean production builds with Node 24 gzip output. Measurements
sum the unique JavaScript chunks in the `/[locale]` homepage client-reference
manifest; the initial-route total also includes framework/runtime and polyfill
files. The isolated baseline was rebuilt from `bdad0c8` with the same installed
dependencies.

| Measurement | `bdad0c8` baseline | Homepage Motion pilot | Difference |
| --- | ---: | ---: | ---: |
| Route client entries (raw) | 149,715 B | 165,197 B | +15,482 B |
| Route client entries (gzip) | 45,210 B | 51,302 B | +6,092 B |
| Initial route total (raw) | 718,935 B | 734,417 B | +15,482 B |
| Initial route total (gzip) | 217,123 B | 223,215 B | +6,092 B |

The synchronous gzip increase is below the approximately 8 KB pilot target.
The existing asynchronous `domAnimation` feature loading architecture is
unchanged.

## Validation

- `npm run check`: passed (lint, TypeScript, production build).
- Production output: 42 static pages, with the same locale, shared static-page,
  production-detail, and API route families as `bdad0c8`.
- `git diff --check`: passed.
- Dependency review: no `package.json` or lockfile change.
- Content and route review: no localized content data, route, CTA target,
  Navbar, static page, production detail, SEO, Vercel, or company-mirror
  change.
