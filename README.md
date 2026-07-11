# héReSonare

The public website repository for héReSonare, an entertainment label connecting music, artists, productions, live experiences, venues, video, and merchandise.

## Technology

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4
- ESLint 9
- Client-side English, Japanese, and Simplified Chinese content selection

The language choice is managed by `LanguageContext` and persisted in browser `localStorage`; it is not URL-based or server-side localization. Navbar and Footer route labels are currently fixed English labels. The nine section routes are implemented with shared static-page foundations, and some sections intentionally contain placeholder or coming-soon content.

## Local development

The repository's local and CI baseline is Node.js 22 with npm.

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

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

- `src/app` — routes, root layout, and global styles
- `src/components` — shared page and layout components
- `src/context` — client-side language state and `localStorage` persistence
- `src/data` — fixed-English navigation labels and localized site/page content
- `src/lib` — shared metadata utilities
- `public` — static assets and brand imagery
- `docs` — development workflow and roadmap

## Contributing

Read [AGENTS.md](./AGENTS.md) and [docs/DEVELOPMENT_WORKFLOW.md](./docs/DEVELOPMENT_WORKFLOW.md) before making changes. Work on a branch created from the latest `main`; pull requests must pass the automated quality workflow.
