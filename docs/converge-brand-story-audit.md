# Converge brand story audit

## Scope

This phase adds a semantic closing movement to the homepage without changing
content, routes, localization, dependencies, approved media, or the existing
fifteen-bar release spectrum. The work builds on the shared resonance motion
system and stays limited to About, Contact, and Footer.

## Motion behavior

| Area | Meaning | Behavior |
| --- | --- | --- |
| About story cards | One idea develops into a brand direction | A low-intensity vertical trace links Story, Mission, and Vision, branching into each card in its brand color. |
| Contact paths | Different voices form one relationship | Three desktop paths travel from Artists, Partners, and Venues toward the email action. The email action uses two restrained breathing rings as the convergence target. |
| Footer | The page resolves to one identity | Pink, neutral, and blue paths meet at the brand name, then continue as a dotted trace toward the contact address. |

The paths are intentionally thinner and dimmer than pointer-follow lights.
They clarify narrative structure without implying that decorative traces are
interactive controls.

## Responsive behavior

- About keeps its connecting rail on mobile because the cards remain a clear
  vertical sequence.
- Contact hides the cross-column paths below the desktop breakpoint; the email
  target remains visible without lines crossing stacked content.
- Footer scales the convergence geometry with its container.
- All SVG layers are clipped by their owning section, ignore pointer input, and
  are hidden from the accessibility tree.

## Accessibility and performance

- Reduced Motion renders every path in a static, low-opacity state and stops
  the target-ring animation.
- Scroll progress is carried by Motion values and transforms directly; no React
  state is updated during scrolling.
- The decorative SVGs add no focus targets or announcements.
- Existing keyboard focus, links, headings, and localized text are unchanged.

## Validation

- ESLint: passed.
- TypeScript: passed.
- Production build: passed; 42 static pages generated.
- Desktop EN About, Contact, and Footer visual checks: passed.
- Mobile JA About and Contact visual checks: passed.
- Mobile ZH-CN Footer visual check: passed.
- Contact desktop path endpoint alignment: passed after coordinate adjustment.
- Horizontal overflow checks: passed at desktop and mobile widths.
