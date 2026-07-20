# Resonance motion identity audit

## Scope

Task 4A keeps the existing homepage spectrum loop as the Hero's sole release
visual and extends a tiered resonance interaction system across the site. Hero
controls receive the strongest pointer-responsive light, interactive cards use
a wider soft glow and small lift, information panels receive light without a
click-like lift, and navigation/text links use a restrained Pulse treatment.
A localized scroll-linked resonance band connects the Hero and Featured
sections.

The implementation adapts general interaction principles rather than copying
the composition, source, assets, or styles of any reference example. It adds
no dependency and does not change content, routes, SEO, Vercel configuration,
or the company mirror.

## Motion behavior

| Area | Brand motion | Behavior |
| --- | --- | --- |
| Latest Release visual | Sound source | The original fifteen-bar spectrum remains the musical signal and sole release visual. |
| Hero controls | Response | A spring-backed light follows fine-pointer movement inside each button and fades when the pointer leaves. |
| Hero controls | Pulse | Buttons lift on hover and compress on press; keyboard focus places the same light at the control center. |
| Hero / Featured boundary | Scroll resonance | Two localized text bands move in opposite directions as the section crosses the viewport, with a small velocity-linked skew. |
| Content cards | Ripple | A broad, low-opacity light follows the pointer; linked cards also lift slightly to communicate interactivity. |
| Information panels | Ambient resonance | About, Contact, and production detail panels respond with light only, preserving their non-interactive meaning. |
| Navigation and text links | Pulse | A short gradient underline and low-intensity glow replace the larger surface effect. |
| Inner-page headings | Converge | Tags, titles, descriptions, and section rules enter as one restrained staggered sequence. |

Motion intensity follows interaction importance, so the stronger Hero response
does not compete with reading and navigation elsewhere on the site.

## Progressive enhancement and accessibility

- The ticker and all pointer-light layers are decorative and excluded from the
  accessibility tree. Existing content provides the meaningful information.
- The ticker duplicates existing localized strings; hiding it prevents repeated
  announcements from screen readers.
- Reduced Motion removes pointer-light travel, hover transforms, staggered
  transforms, the spectrum loop, and scroll-linked ticker transforms.
- Touch input never activates pointer-follow movement or hover lifts.
- No React state is updated on scroll or pointer movement. Motion values drive
  transform changes directly.
- Animated properties are limited to transform and opacity.
- The existing buttons, links, headings, routes, and focus behavior are
  unchanged.

## Responsive and locale validation

A JavaScript-enabled production preview covers the EN homepage and an inner
content page at desktop width, plus a localized homepage at mobile width. The
original fifteen-bar spectrum remains intact, the ticker stays clipped to its
own section, and every checked route must report equal document client and
scroll widths before delivery.

The ticker uses the existing `heroEyebrow` and `heroBusinessAreas` strings, so
EN, JA, and ZH-CN remain aligned without new translation keys.

## Validation

- ESLint: passed.
- TypeScript: passed.
- Production build: passed; 42 static pages generated.
- Desktop EN homepage, content page, and page ending: passed.
- Mobile JA homepage and content page: passed.
- Horizontal overflow checks: passed at desktop and mobile widths.
- `git diff --check`: passed.
- Real fine-pointer feel and operating-system Reduced Motion remain final
  product-owner checks because they require subjective input or OS preference
  switching.
