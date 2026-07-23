# Production HTTP and security contract

## Current status

This contract is hosting-provider independent. No production domain is bound,
no CDN or reverse proxy is configured, and no Vercel, DNS, database, monitoring
vendor, or company-mirror setting is changed by this work.

The application now declares and automatically verifies its expected security,
caching, liveness, and locale-preference responses against `next start`.

## Security response headers

All application and public-file responses receive:

- a Content Security Policy restricted to same-origin application resources,
  with objects and framing disabled;
- `Permissions-Policy` disabling unused sensitive browser capabilities;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- `X-Content-Type-Options: nosniff`;
- `X-Frame-Options: DENY` as a legacy complement to CSP;
- `X-Permitted-Cross-Domain-Policies: none`.

The CSP retains `'unsafe-inline'` for scripts and styles because the current
statically generated Next.js output includes framework bootstrap scripts and
inline styling. A per-request nonce would force dynamic rendering, remove the
current static CDN-cache behavior, and increase server cost. Experimental SRI
is not enabled. Development alone permits `'unsafe-eval'` for React diagnostics;
the production contract rejects it.

`Strict-Transport-Security` is deliberately deferred. It must be enabled only
after the canonical domain, HTTPS certificate, redirects, and required
subdomains have been verified, because browsers persist HSTS decisions.

## Cache ownership

The application does not override framework-managed cache headers for pages,
RSC payloads, generated metadata, or hashed assets.

| Surface | Expected policy |
| --- | --- |
| Statically generated localized pages | `s-maxage=31536000` |
| `robots.txt` and `sitemap.xml` | Revalidate on each browser request |
| Files under `public` | `public, max-age=0` unless separately versioned |
| Hashed Next.js assets | Framework-managed immutable caching |
| Localized 404 responses | Private and no-store |
| `GET /api/health` | `no-store` |
| `POST /api/locale` | `no-store` |

A future CDN must preserve the Next.js `Vary` behavior, forward the `rsc` and
prefetch request headers, and keep the `_rsc` query parameter in its cache key.
It must not replace application `Cache-Control` values with a single global
policy.

## Liveness endpoint

`GET /api/health` returns only:

```json
{"status":"ok"}
```

It confirms that the web process can answer a dynamic request. It exposes no
build identifier, environment name, timestamp, hostname, credential, database
state, or dependency detail. It is not a database readiness check. A future
remote-content adapter must define a separate private readiness strategy rather
than expanding this public response with sensitive diagnostics.

## Locale preference endpoint

`POST /api/locale` accepts JSON only, rejects malformed or unsupported input,
and never caches responses. Its preference Cookie is scoped to `/`, uses
`SameSite=Lax` and `HttpOnly`, and adds `Secure` in production. The Cookie is
used only by the legacy unprefixed-route redirect and does not authorize access.

## Domain and hosting acceptance

After a domain and hosting platform are approved:

1. Verify every security header over the canonical HTTPS origin and its 404,
   discovery, image, health, and locale responses.
2. Confirm the CDN preserves RSC request variation and application cache
   headers during client navigation and prefetching.
3. Verify the alternate hostname redirects before response caching and keeps
   the locale path and query string.
4. Enable HSTS only after the apex, `www`, and any required subdomains are
   confirmed HTTPS-safe; decide `includeSubDomains` and preload separately.
5. Revisit CSP sources before adding analytics, embedded media, a CMS preview,
   payment, or any third-party script. Do not add wildcard origins silently.
6. Configure uptime monitoring against `/api/health` and define alert,
   escalation, rollback, and incident ownership.
7. Run the complete local gate and a production-origin header audit before
   declaring the domain-binding task complete.

The hosting-independent live audit is available through `npm run check:live`.
See [`domain-binding-runbook.md`](./domain-binding-runbook.md) for preview,
canonical-host, alternate-host, HSTS, DNS preservation, and rollback usage.
