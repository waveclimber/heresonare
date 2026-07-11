# Development workflow

This workflow separates product decisions, task specification, implementation, independent validation, and approval. One task should produce one focused branch and one reviewable pull request.

## Roles

### Product owner

The product owner defines the business goal, approved content, priorities, constraints, and visual acceptance criteria. The product owner resolves product-level ambiguity and gives final approval when visual or content judgment is required.

### GPT-5.6

GPT-5.6 scans repository context, turns product goals into scoped task specifications, evaluates the proposed architecture, and reviews pull request diffs and CI results. It identifies scope creep, unsupported assumptions, localization gaps, accessibility risk, and missing validation before approval.

### Codex

Codex creates a branch from the latest `main`, implements the scoped change, runs required validation, reviews the complete diff, commits, pushes normally, and opens a Draft pull request. Codex addresses follow-up findings with additional focused commits. Codex must never modify or commit directly to `main`, force-push, or merge automatically.

### GitHub Actions

GitHub Actions independently validates every pull request with the repository quality workflow. It installs from the lockfile and runs linting, type checking, and the production build through `npm run check`. CI supplements but does not replace local validation or human review.

### Cursor

Cursor is optional. It may be used for local visual inspection and precise manual adjustment when a task benefits from interactive editing. It does not replace the scoped task, automated validation, pull request review, or product-owner acceptance.

## Lifecycle

```text
Product goal
→ GPT-5.6 task specification
→ one task / one branch
→ Codex implementation
→ Draft PR
→ GitHub Actions
→ GPT-5.6 review
→ Codex follow-up fixes
→ visual acceptance when applicable
→ squash merge after approval
```

Codex must never merge automatically. A repository owner performs the squash merge only after the required review, CI, and applicable visual acceptance are complete.

## Branch and scope preparation

Start with a clean working tree and update `main` without rewriting history:

```bash
git checkout main
git pull --ff-only
git checkout -b <type>/<short-description>
```

Use a focused prefix such as `feature/`, `fix/`, `refactor/`, `docs/`, or `chore/`. Before editing, read `AGENTS.md`, inspect relevant repository code, and read the relevant Next.js 16 guide in `node_modules/next/dist/docs/`.

Define explicit inclusions and exclusions. Public routes are locale-prefixed with `en`, `ja`, or `zh-cn`. Navigation labels are localized in `src/data/navigation.ts`, and localized site and page content uses EN, JP, and CN data selected from the active URL locale through `LanguageContext`. The locale preference cookie is used for legacy-route redirects, not as a competing source of active page state.

## Implementation and review

- Reuse existing shared components, data types, and content structures.
- Treat labels, metadata, accessibility text, empty states, and status text as user-facing content.
- Evaluate EN, JP, and CN impact for every user-facing change.
- Verify desktop and mobile behavior for visual or interactive work.
- Verify keyboard access, semantic HTML, focus behavior, and accessible names.
- Never add dependencies, change routes, or alter visual behavior outside the task scope.

Inspect the complete change before committing:

```bash
git status --short
git diff --check
git diff
```

Never commit secrets, credentials, `.env` files, generated build output, or unrelated local changes.

## Validation

Install exactly the versions recorded in the lockfile, then run the same quality gate used by CI:

```bash
npm ci
npm run check
git diff --check
```

For visual or interactive changes, use the locale selector to verify EN, JP, and CN content, locale-preserving navigation, and affected routes at desktop and mobile sizes. Record screenshots or preview evidence in the Draft PR.

## Draft PR and follow-up

Use an imperative commit subject, push without force, and open a Draft PR using the repository template. Document the reason, scope, validation evidence, localization impact, risks, and follow-up work. GitHub Actions must complete independently.

GPT-5.6 reviews the complete diff and CI result against the task specification. Codex applies requested corrections as new focused commits, pushes normally, and leaves the PR in Draft until review and any applicable visual acceptance are complete.
