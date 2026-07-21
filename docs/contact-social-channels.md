# Contact social channels

## Scope

This task replaces the Contact area's placeholder social statuses with three
public profile links approved by the repository owner. It updates both the
homepage Contact section and the localized `/contact` pages without changing
routes, dependencies, Vercel configuration, or the company mirror.

## Approved destinations

| Platform | Configured URL |
| --- | --- |
| Instagram | `https://www.instagram.com/heresonare?igsh=MTEzZzU2M2MydmhlbA==` |
| Xiaohongshu | `https://xhslink.com/m/mUmNZgni6O` |
| Douyin | `https://v.douyin.com/8hmJo5Ukq7o/` |

The URLs are stored once in `src/data/socialLinks.ts`. Xiaohongshu and Douyin
use platform-managed short links supplied by the owner; the application does
not expand, rewrite, or make claims about their eventual redirect targets.

## Localization and accessibility

- EN displays Instagram, Xiaohongshu, and Douyin.
- JP displays Instagram, 小紅書, and Douyin（抖音）.
- CN displays Instagram, 小红书, and 抖音.
- Each contact surface has a localized group label.
- Every profile opens in a new tab with `noopener noreferrer` and a localized
  screen-reader announcement that a new tab will open.
- The homepage pills retain the established pointer-light interaction and use
  blue, pink, and teal accents without adding platform-owned icons.

## Validation contract

The production site-integrity gate checks all six localized contact surfaces:
three homepages and three `/contact` pages. Each must contain exactly one link
to every approved destination, the expected localized label and new-tab text,
and the required external-link safety attributes.
