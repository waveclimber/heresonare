# Site configuration contract

## Current status

`https://heresonare.com` is the confirmed production origin and is used by
production-like builds. The domain is registered and its DNS is managed in
Alibaba Cloud, but no production web record is bound yet. This status is not
evidence that HTTPS, hosting, or redirects have been configured.

This contract prepares the application for a later domain-binding task. It
does not configure Vercel, change DNS, connect a database, or synchronize the
company mirror.

## Production origin

Use the server-side `SITE_URL` environment variable to override the candidate
origin:

```bash
SITE_URL=https://preview.example.com npm run check
```

The application accepts only an absolute HTTP or HTTPS origin. Credentials,
paths, query strings, and fragments are rejected. Production builds require
HTTPS. Local development may use an HTTP localhost origin.

`NEXT_PUBLIC_SITE_URL` remains temporarily supported for backward
compatibility. New environments must use `SITE_URL` because the value is only
needed by server-rendered metadata, sitemap, robots, and validation code. If
both variables are present, they must resolve to the same origin.

The tracked `.env.example` contains no secret. Real `.env` files remain
ignored and must not be committed. Database credentials must not be added
until the provider, schema, access model, and secret owner are approved.

## Runtime baseline

- `.nvmrc` selects Node.js 22 for local and CI parity.
- `package.json` supports maintained Node.js versions from 22 through 24.
- `npm ci` installs the exact dependency graph recorded in the lockfile.
- `npm run check:config` validates the active shell configuration and exercises
  the accepted and rejected origin cases.
- `npm run check` runs configuration validation before the production build
  and generated-site integrity checks.

## Domain-binding checklist

Complete these steps in a separate reviewed operational task. Preserve the
existing Alibaba enterprise-mail MX and SPF records, and follow
[`domain-binding-runbook.md`](./domain-binding-runbook.md) for the current DNS
inventory, live audit command, evidence, and rollback rules.

1. Confirm the public canonical host, including whether the apex or `www` host
   is primary.
2. Confirm domain ownership, DNS authority, hosting target, and rollback owner.
3. Configure DNS and HTTPS in the approved hosting environment.
4. Set `SITE_URL` to the exact canonical HTTPS origin and rebuild from a
   reviewed commit.
5. Run the full quality gate and verify canonical links, language alternates,
   sitemap, robots, JSON-LD, social-image URLs, security headers, and cache
   behavior against the bound host.
6. Verify all EN, JA, and ZH-CN routes over HTTPS on desktop and mobile.
7. Redirect the alternate host to the canonical host without changing locale
   paths or query strings.
8. Record monitoring, rollback, and company-mirror synchronization ownership.
9. Enable HSTS only after HTTPS and required subdomains are verified; evaluate
   `includeSubDomains` and preload as separate irreversible-risk decisions.

Domain binding is complete only after the production host serves the reviewed
build over HTTPS and the metadata checks resolve to that same host.
