# Localized social cards

## Scope

This task adds dedicated social-sharing images without changing rendered page
content, interaction, routes, dependencies, Vercel configuration, or the
company mirror. Every supported page inherits the image for its active locale.

## Visual direction

The card is an original extension of the established héReSonare motion system:

- **Pulse:** a luminous signal source gives the composition its focal point.
- **Ripple:** concentric rings carry that signal into the surrounding space.
- **Orbit:** restrained colored points suggest creative ideas in motion.
- **Spectrum:** a restrained signal band crosses the full lower frame, joining
  the sound motif to the composition instead of behaving like a separate
  equalizer widget.

The official brand mark, dark stage, blue/teal light, pink accent, and safe
outer frame keep the image recognizable when cropped or viewed at small size.
The result is static because social platforms render preview images rather than
the website's interactive motion.

## Content and localization

- EN, JP, and CN cards reuse the existing homepage eyebrow, subtitle, and
  business-area line; this task introduces no unapproved marketing copy.
- Open Graph and Twitter publish the same localized alternative text.
- Japanese and Simplified Chinese use small Noto Sans subsets containing only
  the approved card characters. The font files and SIL Open Font License are
  stored with the source, so image generation makes no runtime font request.

## Technical contract

- Open Graph route: `/{locale}/opengraph-image/brand-share`
- Twitter route: `/{locale}/twitter-image/brand-share`
- Output: PNG, 1200 by 630 pixels, no larger than 5 MB
- Twitter card type: `summary_large_image`
- One localized image per channel and locale, shared by all pages in that
  locale

The implementation uses Next.js generated-image routes and the existing
content/locale models. It adds no package or runtime service.

## Acceptance

- All six image endpoints return HTTP 200 with valid PNG signatures and exact
  declared dimensions in a production server.
- All 39 public pages expose the matching locale image, non-empty localized
  alternative text, and correct type and dimension metadata.
- EN, JP, and CN previews keep copy inside the safe frame, render all glyphs,
  preserve the logo and spectrum, and remain legible at thumbnail size.
- Reduced Motion is unaffected because the social images are static.
