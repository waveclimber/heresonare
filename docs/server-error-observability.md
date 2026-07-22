# Server error observability

This baseline emits one safe structured event when Next.js captures an
unexpected server request error. It prepares production diagnosis before a
remote content provider is selected, without adding a monitoring SDK, network
export, credential, alert channel, or deployment dependency.

## Framework integration

`src/instrumentation.ts` implements the stable Next.js `onRequestError` hook.
The hook converts framework inputs through
`src/observability/serverErrorEvent.mjs` and writes one JSON object to standard
error. The active host remains responsible for collecting process output.

An event has this fixed shape:

```json
{
  "schemaVersion": 1,
  "event": "server.request.error",
  "severity": "error",
  "timestamp": "2026-07-23T12:34:56.789Z",
  "eventId": "b576ea39-a8f8-45ab-88d8-7f9c8ab83c4c",
  "errorDigest": "safe_digest-123",
  "runtime": "nodejs",
  "environment": "production",
  "request": {
    "method": "GET",
    "routePath": "/[locale]/[page]"
  },
  "context": {
    "routerKind": "App Router",
    "routeType": "render",
    "renderSource": "react-server-components",
    "revalidateReason": "none",
    "renderType": "dynamic"
  }
}
```

Unsupported or malformed values become `unknown` or `unavailable`; arbitrary
input is never copied into the event.

## Privacy and security boundary

The event deliberately excludes:

- error messages, names, stacks, causes, and thrown values;
- the requested URL, query string, and dynamic parameter values;
- request and response headers, cookies, authorization data, IP addresses, and
  user-agent data;
- content records, form values, provider payloads, and environment-variable
  values.

Only the framework route template is recorded. The error digest is accepted
only when it matches a short alphanumeric identifier contract. The event ID is
a random UUID generated locally for log-level identification; it is not shown
to visitors and contains no request data.

Next.js or the hosting runtime may emit separate framework diagnostics outside
this event. This schema does not redact those independent lines. Application
and provider code must therefore throw safe operational errors that never
embed credentials, payload values, private content, or personal data, and the
hosting log policy must cover framework output as well as this structured
event.

Client recovery screens continue to expose no diagnostics. When Next.js
provides a digest, operators can correlate the safe client-console marker with
the matching server event without publishing the server event itself.

## Operational decisions still required

Before production launch, repository and hosting owners must still approve:

1. which hosting log surface collects standard error;
2. retention duration, access controls, region, deletion, and incident access;
3. alert thresholds and routing for repeated failures;
4. incident owner, response expectation, and escalation path;
5. whether a monitoring provider is necessary and which fields it may receive;
6. sampling or rate limits if traffic volume makes one event per failure too
   expensive.

A future exporter must consume the same sanitized event. It must not send the
raw `error`, `request`, or `context` objects to a vendor.

## Validation

`npm run check:observability` verifies the event schema, accepted framework
fields, malicious digest handling, redaction of raw request and error data, and
the instrumentation hook's one-line JSON output. The check is part of
`npm run check`.
