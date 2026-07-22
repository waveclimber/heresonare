const unavailable = "unavailable";
const unknown = "unknown";
const digestPattern = /^[a-z0-9_-]{1,128}$/iu;
const eventIdPattern =
  /^[a-f0-9]{8}-[a-f0-9]{4}-[1-8][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/iu;
const routePathPattern = /^\/[a-z0-9._@()[\]/-]{0,199}$/iu;
const timestampPattern =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/u;
const methods = new Set([
  "DELETE",
  "GET",
  "HEAD",
  "OPTIONS",
  "PATCH",
  "POST",
  "PUT",
]);
const routerKinds = new Set(["App Router", "Pages Router"]);
const routeTypes = new Set(["action", "proxy", "render", "route"]);
const renderSources = new Set([
  "react-server-components",
  "react-server-components-payload",
  "server-rendering",
]);
const revalidateReasons = new Set(["on-demand", "stale"]);
const renderTypes = new Set(["dynamic", "dynamic-resume"]);
const runtimes = new Set(["edge", "nodejs"]);
const environments = new Set(["development", "production", "test"]);

export function createServerErrorEvent(
  error,
  request,
  context,
  details,
) {
  return {
    schemaVersion: 1,
    event: "server.request.error",
    severity: "error",
    timestamp: normalizePattern(
      safeRead(details, "timestamp"),
      timestampPattern,
    ),
    eventId: normalizePattern(
      safeRead(details, "eventId"),
      eventIdPattern,
    ),
    errorDigest: readErrorDigest(error),
    runtime: normalizeEnum(safeRead(details, "runtime"), runtimes),
    environment: normalizeEnum(
      safeRead(details, "environment"),
      environments,
    ),
    request: {
      method: normalizeMethod(safeRead(request, "method")),
      routePath: normalizePattern(
        safeRead(context, "routePath"),
        routePathPattern,
      ),
    },
    context: {
      routerKind: normalizeEnum(
        safeRead(context, "routerKind"),
        routerKinds,
      ),
      routeType: normalizeEnum(
        safeRead(context, "routeType"),
        routeTypes,
      ),
      renderSource: normalizeEnum(
        safeRead(context, "renderSource"),
        renderSources,
      ),
      revalidateReason: normalizeOptionalEnum(
        safeRead(context, "revalidateReason"),
        revalidateReasons,
      ),
      renderType: normalizeEnum(
        safeRead(context, "renderType"),
        renderTypes,
      ),
    },
  };
}

function safeRead(value, key) {
  const isReadable =
    (typeof value === "object" && value !== null) ||
    typeof value === "function";
  if (!isReadable) return undefined;

  try {
    return Reflect.get(value, key);
  } catch {
    return undefined;
  }
}

function readErrorDigest(error) {
  return normalizePattern(safeRead(error, "digest"), digestPattern);
}

function normalizeMethod(value) {
  if (typeof value !== "string") return unknown;
  const method = value.toUpperCase();
  return methods.has(method) ? method : unknown;
}

function normalizePattern(value, pattern) {
  return typeof value === "string" && pattern.test(value)
    ? value
    : unavailable;
}

function normalizeEnum(value, values) {
  return typeof value === "string" && values.has(value) ? value : unknown;
}

function normalizeOptionalEnum(value, values) {
  if (value === undefined) return "none";
  return normalizeEnum(value, values);
}
