# Content and media intake foundation

## Current state

The public site currently uses approved brand logos and concept content. No
artist, release, production, tour, venue, video, or store media is approved for
publication. The application therefore keeps its audited logo or code-native
signal fallbacks.

Fourteen future media paths already exist in the content model: two artist
portrait placeholders and twelve production card, hero, render, and icon
slots. None of those files exists under `public/`, and the approved content
media list is intentionally empty.

This task does not treat concept records as approved facts and does not create
synthetic brand assets. It establishes the contract for supplying, reviewing,
and activating real inputs later.

## Intake priority

| Priority | Area | Required product-owner inputs | Required media |
| --- | --- | --- | --- |
| P0 | Productions | Approve the three product names, descriptions, statuses, features, use cases, and specifications in EN; approve JA and ZH-CN localization | Card, hero, render, and icon for each of the three public detail pages |
| P0 | Homepage | Replace the latest-release placeholder with an approved title, metadata, description, destination, and launch state | Approved release or campaign artwork when a real release exists |
| P0 | Sharing | Approve the canonical domain and localized sharing copy | One 1200 x 630 social image or an approved locale-specific set |
| P1 | Artists | Real artist identity, role, biography, profile destination, publication consent, and localized copy | Licensed portrait for every published artist |
| P1 | Music | Real release title, credits, release state, date, identifiers, destinations, and localized copy | Cover artwork for every published release |
| P1 | Video | Final title, description, provider, playback destination, rights, and localized copy | Poster or thumbnail for every published video |
| P2 | Tour | Confirmed event title, date/time zone, city, venue, ticket state, and destination | Approved event poster when required |
| P2 | Venues | Real venue identity, location, description, availability, and destination | Licensed venue photography |
| P2 | Store | Commerce platform, region policy, price/currency, inventory state, fulfilment, returns, and localized copy | Product gallery with consistent crops |
| P2 | Contact and social | Instagram, Xiaohongshu, and Douyin public profile links are approved; ownership, response expectations, and privacy handling remain open | Platform artwork only when rights and brand usage are approved |

About-page copy should receive explicit brand-owner approval with the P0 copy
review even though it does not currently need content imagery.

## File contract

Store approved local media under the matching controlled directory:

```text
public/images/artists/<slug>/...
public/images/music/<slug>/...
public/images/products/<slug>/...
public/images/tour/<slug>/...
public/images/venues/<slug>/...
public/images/video/<slug>/...
public/images/store/<slug>/...
```

Use lowercase kebab-case names. Raster media may use AVIF, WebP, JPEG, or PNG;
icons may use SVG, PNG, or WebP. Keep raster files at or below 700 KB and icons
at or below 100 KB. Deliver sRGB exports without embedded secrets, private
metadata, watermarks, or unapproved text.

Recommended masters and crops:

| Slot | Recommended export | Use |
| --- | --- | --- |
| Card | 1600 x 1000, 8:5 | Lists and shared content cards |
| Production hero | 1920 x 1320, approximately 16:11 | Production detail hero |
| Render | 1920 x 1080, 16:9 | Wide detail support image |
| Artist portrait | 1600 x 2000, 4:5 | Artist card and future profile |
| Release/store cover | 1600 x 1600, 1:1 | Music and product catalogs |
| Tour poster | 1600 x 2000, 4:5 | Event promotion |
| Social share | 1200 x 630 | Open Graph and social previews |
| Icon | SVG preferred or 256 x 256 raster | Small decorative product mark |

Keep important subjects away from crop edges. Editorial images need an
approved alt-text decision in EN, JA, and ZH-CN; decorative icons retain empty
alt text. Asset rights, model releases, territorial restrictions, expiry, and
source ownership must be recorded outside the repository before approval.

## Approval workflow

1. Approve the English factual content and stable route destination.
2. Approve JA and ZH-CN translations with the same field structure.
3. Export media to the required crop, color space, and size.
4. Place files under the controlled `public/images/<area>/` directory.
5. Reference the exact public path from `src/data/pageContent.ts`.
6. Add only reviewed paths to `src/data/approvedContentMedia.json`.
7. Run `npm run check:content` and the full `npm run check` gate.
8. Review desktop/mobile crops, alt text, Reduced Motion behavior, and all three
   locales before merging.

The checker permits missing, unapproved future references because the current
fallback is intentional. It fails when an approved file is missing, oversized,
unsupported, outside the controlled directories, not referenced by content, or
has path-casing drift. It also fails when a controlled content file exists but
has not been added to the approval list.

## Validation results

| Check | Result |
| --- | --- |
| Approved content media | 0; intentionally unchanged |
| Pending source references | 14; audited fallbacks remain active |
| Controlled content files under `public/` | 0 |
| EN, JA, and ZH-CN generated samples | Localized pages retained; no pending path rendered as an image source |
| ESLint and TypeScript | Passed |
| Production build | Passed; 44 static pages generated |
| Existing performance budget | Passed with no measurable route-payload change |

No visual or interactive behavior changed, so this foundation does not require
a new subjective motion review. The next media-integration task will require
desktop/mobile crop and localized alt-text acceptance for every supplied asset.
