# Production domain binding runbook

## Scope

This runbook prepares `heresonare.com` for a reviewed production binding from
the company GitHub mirror to Vercel. It does not change Alibaba Cloud DNS,
configure the Vercel project, enable HSTS, connect a database, or push either
repository.

The public release authority remains the reviewed `main` branch in
`waveclimber/heresonare`. The `heReSonare/heresonare` repository is the
downstream deployment mirror connected to Vercel; it must not become a second
independent development authority.

## Confirmed release topology

```text
feature branch
  -> reviewed pull request in waveclimber/heresonare
  -> protected personal main
  -> one-way exact-SHA sync
  -> protected heReSonare/heresonare main
  -> Vercel production deployment
  -> heresonare.com
```

The controls for this topology are:

- development branches and pull requests live in the personal repository;
- only reviewed personal `main` commits move to the company repository;
- synchronization is one-way from personal `main` to company `main`;
- the two `main` references must resolve to the same commit SHA after sync;
- stop rather than overwrite if the company repository has an independent
  commit;
- Vercel connects only to `heReSonare/heresonare` and tracks its `main` as the
  Production Branch;
- direct code changes and pull requests in the company mirror are prohibited;
- a release is not complete until personal CI, company CI, the Vercel
  deployment, and the live readiness gate all pass.

Because Vercel does not see feature branches that exist only in the personal
repository, this topology does not provide automatic Vercel previews for
personal pull requests. Local production validation remains the default. If an
online pre-production environment becomes necessary, introduce one explicitly
reviewed `staging` mirror branch or a controlled Vercel preview deployment;
do not turn the mirror into bidirectional synchronization.

## Confirmed domain state

The product owner confirmed `heresonare.com` as the production domain. It
matches the application's validated default origin and therefore requires no
canonical migration.

The following public DNS state was observed on 2026-07-23. It is an inventory,
not a desired-state configuration. Export the current Alibaba Cloud DNS zone
again immediately before any change.

| Surface | Observed state | Binding rule |
| --- | --- | --- |
| Authoritative DNS | `dns17.hichina.com`, `dns18.hichina.com` | Manage web records in the active Alibaba Cloud DNS zone |
| Apex web record | No public A or AAAA answer | Add only the exact record supplied by Vercel |
| `www` web record | No public CNAME | Add only after the canonical redirect target is approved |
| Mail exchangers | `mx1.qiye.aliyun.com`, `mx2.qiye.aliyun.com`, `mx3.qiye.aliyun.com` | Preserve without modification |
| Root TXT | `v=spf1 include:spf.qiye.aliyun.com -all` | Preserve without modification |
| DMARC | No `_dmarc.heresonare.com` TXT answer observed | Review separately with the Alibaba enterprise-mail owner |

Never replace the entire DNS zone with a hosting-provider template. Website
binding should add or update only the approved web and verification records.
Mail, ownership-verification, and unrelated service records are separate
rollback domains.

## Decisions required before DNS changes

Record these decisions in the release issue or pull request:

1. Vercel project owner, deployment permissions, and production-promotion
   policy.
2. Canonical host. The current application and recommended policy use the apex
   `https://heresonare.com`.
3. Alternate-host policy. The recommended `https://www.heresonare.com` behavior
   is one permanent redirect to the apex while preserving path and query.
4. Production deployer, mirror operator, DNS operator, monitoring owner,
   incident owner, and rollback owner.
5. Exact reviewed commit SHA and the last known-good Vercel deployment.
6. Vercel log access, retention, uptime threshold, and alert destination.
7. Acceptance of Vercel's non-mainland-China hosting path and the resulting
   mainland-China connectivity and latency risk.

Do not invent A, AAAA, ALIAS, ANAME, or CNAME targets. Add the apex and `www`
domains to the Vercel project first, then copy the record type, name, and value
shown by Vercel into Alibaba Cloud DNS.

## Prepare the release candidate

1. Start from a clean checkout of the reviewed personal-repository `main`.
2. Use Node.js 22 and install the lockfile exactly with `npm ci`.
3. Set the production environment key:

   ```text
   SITE_URL=https://heresonare.com
   ```

4. Do not add `NEXT_PUBLIC_SITE_URL` to a new environment.
5. Do not add database credentials until a provider and access model are
   approved.
6. Run `npm run check`.
7. Confirm that personal `main` passed its required GitHub check.
8. Confirm that company `main` has no independent commit, then synchronize the
   exact personal `main` SHA without force-pushing.
9. Wait for the company GitHub check and Vercel production deployment to pass.
10. Use the generated Vercel deployment hostname as the unbound validation
    target.
11. Confirm that Vercel runs the full Next.js server behavior. A static export
   is not compatible with the current locale proxy and dynamic health endpoint.
12. Configure collection of standard error output so the existing structured
   server-error events are retained and access-controlled.
13. Configure external uptime monitoring against `/api/health`.
14. Perform one Vercel rollback to the last known-good deployment before
    changing DNS.

## Run the live readiness gate

The live gate makes no DNS changes and sends only fixed GET requests to public
site routes. It does not follow links to social platforms or submit contact
data.

Against the unbound Vercel deployment hostname whose metadata was built for the
production origin:

```bash
npm run check:live -- --target https://project-deployment.vercel.app --canonical https://heresonare.com
```

After apex and `www` are bound:

```bash
npm run check:live -- --target https://heresonare.com --alternate https://www.heresonare.com
```

The gate checks:

- all 39 public EN, JA, and ZH-CN routes;
- canonical and Open Graph URLs;
- four language alternates per route;
- JSON-LD WebPage identity;
- robots and sitemap contents;
- six localized social-image endpoints, PNG signatures, dimensions, and size;
- production security headers and cache contracts;
- legacy locale redirects;
- representative localized 404 responses;
- the minimal uncached `/api/health` response;
- alternate-host redirect preservation for path and query.

HSTS is initially reported as a warning. After HTTPS has been stable and the
apex, `www`, and every required subdomain are confirmed safe, rerun with:

```bash
npm run check:live -- --target https://heresonare.com --alternate https://www.heresonare.com --require-hsts
```

`--require-hsts` requires at least a one-year `max-age`. It does not require
`includeSubDomains` or preload; those remain separate higher-risk decisions.

For local development of the audit itself, HTTP is accepted only for an
explicit localhost target:

```bash
npm run check:live -- --target http://127.0.0.1:3100 --canonical https://heresonare.com --allow-http-local
```

## DNS cutover

1. Export the complete Alibaba Cloud DNS zone and retain the dated export.
2. Capture the existing apex, `www`, MX, TXT, CAA, and verification records.
3. Confirm that the Vercel deployment and rollback drill passed.
4. Add `heresonare.com` and `www.heresonare.com` to the Vercel project.
5. Keep Alibaba Cloud authoritative nameservers; do not transfer nameservers
   to Vercel.
6. Add the Vercel-provided ownership-verification record, if required.
7. Add the exact apex record shown by the Vercel project.
8. Add the exact `www` record shown by Vercel and configure `www` to redirect
   permanently to the apex.
9. Do not alter the Alibaba enterprise-mail MX or SPF records.
10. Wait for Vercel to issue and validate certificates for both
   hosts.
11. Verify the certificate chain and expiry in a normal browser.
12. Run the live readiness gate without `--require-hsts`.
13. Verify desktop and mobile rendering for one representative route in every
    locale.
14. Record the DNS change, operator, timestamp, commit, Vercel deployment,
    certificate state, check output, and rollback target.

DNS propagation is not an application error. During propagation, compare
answers from multiple networks and resolvers before changing application code.

## Rollback

If the bound host fails:

1. Preserve hosting, application, certificate, and DNS evidence.
2. Use Vercel's deployment rollback first when the DNS target itself remains
   healthy.
3. If the host or certificate is unavailable, restore only the previous web
   records from the exported zone.
4. Do not touch MX, SPF, mail-verification, or unrelated service records.
5. Never rewrite Git history or force-push `main`.
6. Verify the restored target, `/api/health`, one route per locale, and the
   contact mailbox.
7. Document the incident and the next reviewed correction.

DNS and certificate rollback must be proven before HSTS is enabled. Once a
browser has stored HSTS, DNS rollback to an HTTP-only target is not a viable
recovery path.

## Post-binding work

After the live gate passes:

- observe HTTPS and redirect behavior before enabling HSTS;
- submit the canonical sitemap to the chosen search-console services;
- measure field Core Web Vitals on the final host;
- measure availability and latency from mainland China; Vercel provides no
  mainland-China infrastructure or availability guarantee;
- review CSP before adding analytics, embeds, CMS preview, or payment scripts;
- review DMARC and DKIM with the enterprise-mail owner;
- rerun the dependency audit and track the supported Next.js remediation;
- keep the company repository synchronized only after reviewed personal
  `main` merges.
