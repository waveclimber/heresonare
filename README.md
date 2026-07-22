# héReSonare

The public website repository for héReSonare, an entertainment label connecting music, artists, productions, live experiences, venues, video, and merchandise.

## Technology

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4
- ESLint 9
- Locale-prefixed English, Japanese, and Simplified Chinese routing

The active locale comes from the URL (`/en`, `/ja`, or `/zh-cn`) and is exposed to client components by `LanguageContext`. A preference cookie and the browser `Accept-Language` header select the redirect locale for legacy unprefixed routes. Navbar and Footer labels are localized, while the nine section routes continue to use shared static-page foundations and some sections intentionally contain placeholder or coming-soon content.

## Local development

The repository's local and CI baseline is Node.js 22 with npm.

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Site configuration

No production domain is bound yet. `https://heresonare.com` is the current
canonical candidate for production-like validation, not a live-domain status.
Use the server-only `SITE_URL` variable when testing another HTTPS origin. The
tracked `.env.example` is safe to copy for local setup; real environment files
remain ignored and must never contain committed credentials.

Node.js 22 is the project baseline selected by `.nvmrc`; Node.js 22 through 24
are supported. See [docs/site-configuration-contract.md](./docs/site-configuration-contract.md)
for validation rules and the later domain-binding checklist.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

Run the complete quality gate with:

```bash
npm run check
```

## Project structure

- `src/app` — locale-prefixed routes, layouts, route handlers, and global styles
- `src/components` — shared page and layout components
- `src/config` — validated server-side application configuration
- `src/context` — URL-derived client language context
- `src/data` — localized navigation, interface, site, and page content
- `src/i18n` — central locale configuration and path helpers
- `src/lib` — shared locale-aware metadata utilities
- `public` — static assets and brand imagery
- `docs` — development workflow and roadmap

## Contributing

Read [AGENTS.md](./AGENTS.md) and [docs/DEVELOPMENT_WORKFLOW.md](./docs/DEVELOPMENT_WORKFLOW.md) before making changes. Work on a branch created from the latest `main`; pull requests must pass the automated quality workflow.
