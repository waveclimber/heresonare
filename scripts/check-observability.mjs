import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { createServerErrorEvent } from "../src/observability/serverErrorEvent.mjs";

const safeDetails = {
  timestamp: "2026-07-23T12:34:56.789Z",
  eventId: "b576ea39-a8f8-45ab-88d8-7f9c8ab83c4c",
  runtime: "nodejs",
  environment: "production",
};
const sensitiveMarker = "must-never-enter-the-log";
const error = Object.assign(new Error(sensitiveMarker), {
  digest: "safe_digest-123",
  cause: sensitiveMarker,
});
const request = {
  path: `/en/contact?token=${sensitiveMarker}`,
  method: "get",
  headers: {
    authorization: `Bearer ${sensitiveMarker}`,
    cookie: `session=${sensitiveMarker}`,
  },
};
const context = {
  routerKind: "App Router",
  routePath: "/[locale]/[page]",
  routeType: "render",
  renderSource: "react-server-components",
  revalidateReason: undefined,
  renderType: "dynamic",
};

const event = createServerErrorEvent(error, request, context, safeDetails);

assert.deepEqual(event, {
  schemaVersion: 1,
  event: "server.request.error",
  severity: "error",
  timestamp: safeDetails.timestamp,
  eventId: safeDetails.eventId,
  errorDigest: "safe_digest-123",
  runtime: "nodejs",
  environment: "production",
  request: {
    method: "GET",
    routePath: "/[locale]/[page]",
  },
  context: {
    routerKind: "App Router",
    routeType: "render",
    renderSource: "react-server-components",
    revalidateReason: "none",
    renderType: "dynamic",
  },
});

const serializedEvent = JSON.stringify(event);
assert.doesNotMatch(serializedEvent, new RegExp(sensitiveMarker, "u"));
assert.doesNotMatch(serializedEvent, /authorization|cookie|token=/iu);
assert.doesNotMatch(serializedEvent, /message|stack|cause|headers/iu);

const hostileError = {};
Object.defineProperty(hostileError, "digest", {
  get() {
    throw new Error(sensitiveMarker);
  },
});

const sanitizedEvent = createServerErrorEvent(
  hostileError,
  {
    method: `GET-${sensitiveMarker}`,
    path: `/${sensitiveMarker}`,
    headers: { authorization: sensitiveMarker },
  },
  {
    routerKind: sensitiveMarker,
    routePath: `/page?secret=${sensitiveMarker}`,
    routeType: sensitiveMarker,
    renderSource: sensitiveMarker,
    revalidateReason: sensitiveMarker,
    renderType: sensitiveMarker,
  },
  {
    timestamp: sensitiveMarker,
    eventId: sensitiveMarker,
    runtime: sensitiveMarker,
    environment: sensitiveMarker,
  },
);

assert.deepEqual(sanitizedEvent, {
  schemaVersion: 1,
  event: "server.request.error",
  severity: "error",
  timestamp: "unavailable",
  eventId: "unavailable",
  errorDigest: "unavailable",
  runtime: "unknown",
  environment: "unknown",
  request: {
    method: "unknown",
    routePath: "unavailable",
  },
  context: {
    routerKind: "unknown",
    routeType: "unknown",
    renderSource: "unknown",
    revalidateReason: "unknown",
    renderType: "unknown",
  },
});
assert.doesNotMatch(JSON.stringify(sanitizedEvent), new RegExp(sensitiveMarker, "u"));

const instrumentationSource = readFileSync(
  join(process.cwd(), "src", "instrumentation.ts"),
  "utf8",
);
assert.match(
  instrumentationSource,
  /Instrumentation\.onRequestError/u,
  "The framework error hook must retain its Next.js type contract.",
);
assert.match(
  instrumentationSource,
  /console\.error\(JSON\.stringify\(event\)\)/u,
  "Server error events must remain one-line structured JSON.",
);
assert.doesNotMatch(
  instrumentationSource,
  /(?:error|request)\.(?:message|stack|cause|path|headers)/u,
  "The instrumentation hook must not read raw errors, request paths, or headers.",
);

console.log(
  "Server observability contract passed (structured event, safe digest, framework route, hostile inputs redacted).",
);
