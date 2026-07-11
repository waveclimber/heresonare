# Development workflow

## 1. Prepare a branch

Start from a clean working tree and the latest `main`:

```bash
git checkout main
git pull --ff-only
git checkout -b <type>/<short-description>
```

Use a conventional prefix such as `feature/`, `fix/`, `refactor/`, `docs/`, or `chore/`. Never make project changes directly on `main`.

## 2. Understand the change

- Read `AGENTS.md` and the relevant Next.js 16 guide in `node_modules/next/dist/docs/`.
- Identify affected routes, shared components, localized content, and metadata.
- Preserve EN, JP, and CN content structure when localized site or page data changes. Navigation labels in `src/data/navigation.ts` are currently fixed English text.
- Do not add dependencies, change routes, or alter visual behavior outside the task scope.

## 3. Implement and review

Keep commits small and focused. Before committing, inspect both the changed file list and the complete diff:

```bash
git status --short
git diff --check
git diff
```

Never commit `.env` files, credentials, build output, or unrelated local changes.

## 4. Validate

Install exactly the versions recorded in the lockfile, then run the same quality gate as CI:

```bash
npm ci
npm run check
```

For visual or interactive changes, also use the client-side language selector to verify affected routes locally with EN, JP, and CN content and include screenshots in the pull request. The current language choice is persisted in `localStorage`, not encoded in the URL.

## 5. Commit and open a pull request

Write an imperative commit subject that describes the outcome. Push without force and open a pull request using the repository template. Document the scope, validation results, risks, and follow-up work. At least one reviewer should approve the change before it is merged to `main`.

## Continuous integration

The `Quality` workflow runs on every pull request and on pushes to `main`. It uses Node.js 22, installs with `npm ci`, and runs linting, type checking, and a production build. New commits cancel older in-progress runs for the same branch.
