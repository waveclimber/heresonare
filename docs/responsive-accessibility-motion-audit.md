# Responsive, accessibility, and motion audit

## Scope

This pass validates the current public site across responsive layouts, keyboard
navigation, and the Reduced Motion contract. It changes no routes, visible
content, dependencies, media, SEO configuration, or hosting configuration.

The route matrix covers the homepage, all nine section routes, and all three
supported Productions detail routes. English was checked across desktop,
tablet, and mobile breakpoints, with focused Japanese and Simplified Chinese
mobile checks for the homepage, Productions list and detail pages, and Contact.

## Findings and fixes

### Escape-key focus restoration

The desktop language menu and mobile navigation both closed on Escape, but
focus returned to the document body when Escape was pressed from a control
inside the disappearing menu. Keyboard users therefore lost their position.

Both menus now return focus to their trigger button after Escape. The existing
expanded state, localized accessible names, mutual exclusion, and pointer
behavior remain unchanged.

### Reduced Motion CSS coverage

Motion components already use `MotionConfig reducedMotion="user"` and
`useReducedMotion` to remove pointer tracking, scroll transforms, path drawing,
scanning light, and continuous decorative motion. The CSS fallback covered the
major branded effects, but did not cover every utility transition or the
desktop/mobile menu entrance animations.

The Reduced Motion media query now makes all CSS animations and transitions
effectively immediate, removes delay, and forces automatic scrolling. Existing
component-specific static states remain in place for the spectrum, Converge
rings, pointer treatments, and Productions signal frames. Normal motion mode is
unchanged.

## Validation

| Check | Result |
| --- | --- |
| Desktop route matrix at 1440 px | 13 route shapes; no horizontal overflow; one `main` and one `h1` per route |
| Desktop navigation breakpoint at 1280 px | Full navigation fits without overlap or overflow |
| Tablet route matrix at 768 px | 13 route shapes; no horizontal overflow; mobile navigation active |
| Mobile route matrix at 390 px | 13 route shapes; no horizontal overflow; one `main` and one `h1` per route |
| Japanese and Simplified Chinese mobile samples | Correct document language and localized menu labels; no overflow or unnamed controls |
| Mobile menu | Opens and closes correctly; Escape from an inner link restores focus to the trigger |
| Desktop language menu | Escape from an inner option restores focus to the language trigger |
| Skip link | Becomes visible on focus and moves focus to `main-content` |
| Focus indicator | 2 px brand-yellow outline with 4 px offset on keyboard focus |
| Normal motion mode | Spectrum and navigation transitions retain their existing durations |
| Compiled Reduced Motion CSS | Global animation, transition, delay, and scroll overrides are present |
| Browser console | No warnings or errors during the validation pass |

The browser environment reported its normal operating-system motion setting,
so the Reduced Motion result combines source inspection with verification of
the compiled media-query output. A final pre-launch device pass should still
toggle the operating-system preference on representative macOS, Windows, iOS,
and Android devices.
