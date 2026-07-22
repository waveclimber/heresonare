# CI and release security contract

## Scope

This contract hardens the repository's review and release path before a hosting
platform or production domain is approved. It changes no page, content, motion,
route, dependency, DNS, Vercel, database, or company-mirror configuration.

The workflow still validates pull requests and pushes to `main`. It does not
deploy a build or grant production access.

## GitHub Actions supply chain

The quality workflow uses only two external actions. Both are pinned to the
full immutable commit behind a reviewed, signed upstream release:

| Action | Release | Commit |
| --- | --- | --- |
| `actions/checkout` | `v7.0.1` | `3d3c42e5aac5ba805825da76410c181273ba90b1` |
| `actions/setup-node` | `v6.4.0` | `48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e` |

The readable release comment is documentation only; GitHub executes the full
SHA. Updating either action requires a focused pull request that verifies the
official release, resolves its tag to a commit, reviews breaking changes, and
updates both the workflow and `scripts/check-ci-security.mjs`.

## Workflow security rules

The automated `check:ci-security` contract protects these rules:

- pull requests use `pull_request`, never `pull_request_target`;
- the default `GITHUB_TOKEN` has only `contents: read` permission;
- checkout credentials are not persisted into later commands;
- every external action uses an expected 40-character commit SHA;
- the job uses the explicit Ubuntu 24.04 runner baseline rather than the
  moving `ubuntu-latest` label;
- CI reads Node.js from `.nvmrc` instead of duplicating the version;
- npm caching remains lockfile-based;
- the job retains a 15-minute timeout and existing concurrency cancellation;
- production dependency audit findings at `critical` severity fail CI.

The workflow installs with `npm ci` and then runs the same complete `npm run
check` gate used locally.

## Dependency advisory policy

`npm audit --omit=dev --audit-level=critical` is an additive regression gate.
It blocks a future critical production advisory while the existing upstream
Next.js findings remain visible in CI.

The current one moderate and two high findings are not silently accepted as a
launch state. They remain on the pre-launch checklist because npm's proposed
force fix is incompatible and there is no reviewed supported upgrade yet. The
threshold must not be lowered by adding `|| true`, disabling audits, or hiding
output. Raising it to fail on high severity belongs in the dependency-remediation
pull request that first removes the known findings.

## Current `main` ruleset

A read-only GitHub API check on 2026-07-23 confirmed that the active `Protect
main` repository ruleset targets the default branch and currently:

- blocks branch deletion and non-fast-forward updates;
- requires pull requests and resolved review conversations;
- allows squash merging only and requires linear history;
- requires the strict `check` status from GitHub Actions;
- grants no bypass actor.

The required approving-review count is currently zero; code-owner review and
last-push approval are not required. No repository setting is changed by this
task. The owner must decide the production approval count and reviewer model
before binding a live domain.

## Hosting-independent release procedure

1. Start from an updated, clean `main` and create one focused branch.
2. Run `npm ci`, `npm run check`, and `git diff --check` locally.
3. Open a draft pull request and wait for the required `check` status.
4. Complete product, code, content, localization, accessibility, security, and
   visual acceptance that applies to the change.
5. Let a repository owner mark the pull request ready and squash-merge it.
6. Treat the resulting immutable `main` commit SHA as the release candidate.
7. Build from a clean checkout with the approved `SITE_URL`; never build a
   release from an uncommitted working tree.
8. Record the commit SHA, build/check result, configuration key names (never
   secret values), deployment identifier, timestamp, and operator.
9. After hosting exists, verify the canonical HTTPS origin, localized routes,
   metadata, security headers, cache behavior, social images, and `/api/health`
   before promoting the release.

## Rollback procedure

Until a hosting provider is selected, rollback is a reviewed contract rather
than an executable deployment command.

1. Identify the last known-good merged commit and the failing release commit.
2. Preserve logs and deployment evidence without copying secrets into an issue
   or pull request.
3. Use the hosting platform's immutable redeploy or rollback mechanism to serve
   the last known-good commit; never force-push or rewrite `main`.
4. If repository history also needs correction, create a focused revert pull
   request and pass the normal required check before merging it.
5. Verify `/api/health`, one route per locale, canonical metadata, security
   headers, and cache behavior after rollback.
6. Treat DNS, certificates, HSTS, database schema/data, and company-mirror
   recovery as separate rollback domains with explicitly assigned owners.
7. Document the incident, decision, affected commit, recovery commit, and
   follow-up action.

The first hosting task must replace the generic deployment step with exact
platform commands, identify who can execute them, define monitoring and alert
thresholds, and perform a non-production rollback drill before launch.

## Remaining owner decisions

- hosting provider, environments, deployment permissions, and artifact history;
- production approval count and reviewer ownership;
- monitoring, incident escalation, and rollback authority;
- dependency-remediation timing for the known upstream advisories;
- company-mirror direction, credentials, conflict handling, and audit log;
- final domain, alternate-host redirect, HTTPS, and HSTS policy.
