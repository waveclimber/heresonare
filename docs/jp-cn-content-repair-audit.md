# Japanese and Simplified Chinese content repair audit

## Scope

This repair covers the Japanese (`JP`) and Simplified Chinese (`CN`) localized
content for all nine static pages: Artists, Music, Productions, Tour, Venues,
Video, Store, About, and Contact.

The English content in `src/data/pageContent.ts` was used as the semantic source
of truth. The repair is editorial only; it does not add product claims, business
facts, dates, partners, services, artists, releases, venues, prices, or
capabilities.

## Fields repaired

The repair includes every populated localized user-facing field in the nine page
models:

- hero tags, titles, and descriptions;
- section labels, titles, and descriptions;
- item titles, roles, subtitles, types, categories, statuses, and descriptions;
- item years, dates, and locations;
- feature and use-case lists;
- specification labels and values;
- link labels; and
- coming-soon labels, titles, descriptions, and CTA labels.

## Page summary

| Page | Japanese and Chinese content repaired |
| --- | --- |
| Artists | Hero, roster section, artist titles, roles, statuses, descriptions, and profile labels |
| Music | Hero, catalog section, release types, statuses, descriptions, and years |
| Productions | Hero, catalog section, product categories, types, statuses, descriptions, features, use cases, and specifications |
| Tour | Hero, live section, coming-soon content, CTA, placeholder event, status, date, and location |
| Venues | Hero, venue section, venue type, status, description, and location |
| Video | Hero, video section, work type, status, description, and year |
| Store | Hero, store section, coming-soon content, placeholder item type, status, and description |
| About | Hero, identity section, brand-pillar titles, subtitles, and descriptions |
| Contact | Hero, inquiry section, contact-path titles, subtitles, descriptions, and email labels |

## Translation glossary

| English | Japanese | Simplified Chinese |
| --- | --- | --- |
| Artist / Artists | アーティスト | 艺人 |
| Music | 音楽 | 音乐 |
| Productions | プロダクション | 制作 |
| Tour | ツアー | 巡演 |
| Venues | 会場 | 场地 |
| Video | ビデオ | 视频 |
| Store | ストア | 商店 |
| Contact | お問い合わせ | 联系我们 |
| Vocal Artist | ボーカルアーティスト | 声乐艺人 |
| Producer / Composer | プロデューサー／作曲家 | 制作人／作曲家 |
| Single | シングル | 单曲 |
| Concept | コンセプト | 概念阶段 |
| In development | 開発中 | 开发中 |
| Coming soon | 近日公開 | 即将公开 |
| Research | 研究段階 | 研究阶段 |
| Features | 特徴 | 特点 |
| Use cases | 活用例 | 应用场景 |
| Specifications | 仕様 | 规格 |
| Format | 形式 | 形式 |
| Stage | 段階 | 阶段 |

Approved proper names remain unchanged: `héReSonare`, `Resonance 01`,
`Blue Signal`, `Audio Innovation`, `Creative Platform`, `Live Experience`,
`Resonance Room`, and `Signal Film`.

## Structural parity

The localized object topology remains aligned with the English source. All nine
pages, sections, items, feature lists, use-case lists, specification arrays, link
arrays, and their authored order are preserved. The existing localization
helpers continue to enforce section counts, item counts, list lengths,
specification lengths, and link-label lengths.

No English source value, page key, object identifier, slug, URL, external flag,
media path, email address, route, or localization helper mapping was changed.

## Integrity check

`src/data/pageContent.ts` now performs a small dependency-free recursive check at
module evaluation time for the Japanese and Chinese localized source objects. It
visits nested heroes, sections, items, arrays, specifications, links, and
coming-soon content. A string containing two or more consecutive ASCII question
marks fails with an error that includes the language and complete content path.

The check deliberately permits a single ASCII question mark and does not match
Japanese or Chinese full-width punctuation.

## Verification evidence

The production build generated all 30 locale-prefixed public routes. All nine
Japanese routes and all nine Simplified Chinese routes were inspected at 390,
768, 1280, and 1440 pixel widths, for 72 route/viewport combinations in total.
The settled layouts showed no document-level horizontal overflow, clipped
visible text, repeated question-mark placeholders, console warnings or errors,
locale-breaking internal links, or altered `mailto:` links. Page titles and meta
descriptions reflected the repaired localized hero content.

Screenshot evidence is stored in `docs/screenshots/jp-cn-content-repair/`:

- `ja-artists-390.jpg`
- `ja-artists-1280.jpg`
- `ja-productions-1280.jpg`
- `ja-contact-1280.jpg`
- `zh-cn-music-390.jpg`
- `zh-cn-music-1280.jpg`
- `zh-cn-productions-1280.jpg`
- `zh-cn-about-1280.jpg`

## Product-owner wording review

The translations are faithful to the placeholder English source and introduce
no new claims. Product-owner review is recommended for the product-language
choices `適応型レゾナンスレイヤー` / `自适应共鸣层` and
`会場とブランドのアクティベーション` / `场地与品牌活动`, because final
brand terminology may prefer different wording when the underlying products are
defined. The placeholder labels `基盤アイテム` and `基础商品` should also be
revisited when approved store content exists.
