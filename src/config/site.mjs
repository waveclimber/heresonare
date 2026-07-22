export const defaultSiteOrigin = "https://heresonare.com";

const supportedProtocols = new Set(["http:", "https:"]);

function readEnvironmentValue(environment, name) {
  const value = environment[name];
  if (value === undefined) return undefined;

  const trimmedValue = value.trim();
  if (!trimmedValue) {
    throw new Error(`${name} cannot be empty.`);
  }

  return trimmedValue;
}

export function parseSiteUrl(value, nodeEnvironment = "production") {
  let url;

  try {
    url = new URL(value);
  } catch {
    throw new Error("SITE_URL must be an absolute URL.");
  }

  if (!supportedProtocols.has(url.protocol)) {
    throw new Error("SITE_URL must use http or https.");
  }

  if (url.username || url.password) {
    throw new Error("SITE_URL must not contain credentials.");
  }

  if (url.pathname !== "/" || url.search || url.hash) {
    throw new Error("SITE_URL must contain only an origin without a path, query, or fragment.");
  }

  if (nodeEnvironment === "production" && url.protocol !== "https:") {
    throw new Error("SITE_URL must use https in production.");
  }

  return new URL(url.origin);
}

export function resolveSiteUrlFromEnvironment(environment = process.env) {
  const siteUrlValue = readEnvironmentValue(environment, "SITE_URL");
  const legacySiteUrlValue = readEnvironmentValue(
    environment,
    "NEXT_PUBLIC_SITE_URL",
  );
  const nodeEnvironment = environment.NODE_ENV ?? "production";

  if (siteUrlValue && legacySiteUrlValue) {
    const siteUrl = parseSiteUrl(siteUrlValue, nodeEnvironment);
    const legacySiteUrl = parseSiteUrl(legacySiteUrlValue, nodeEnvironment);

    if (siteUrl.origin !== legacySiteUrl.origin) {
      throw new Error(
        "SITE_URL and NEXT_PUBLIC_SITE_URL must not define different origins.",
      );
    }
  }

  return parseSiteUrl(
    siteUrlValue ?? legacySiteUrlValue ?? defaultSiteOrigin,
    nodeEnvironment,
  );
}
