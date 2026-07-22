export const noStoreCacheControl = "no-store";

export function createContentSecurityPolicy(
  nodeEnvironment = "production",
) {
  const isDevelopment = nodeEnvironment === "development";
  const scriptSources = ["'self'", "'unsafe-inline'"];
  const connectSources = ["'self'"];

  if (isDevelopment) {
    scriptSources.push("'unsafe-eval'");
    connectSources.push("ws:", "wss:");
  }

  return [
    ["default-src", "'self'"],
    ["script-src", ...scriptSources],
    ["style-src", "'self'", "'unsafe-inline'"],
    ["img-src", "'self'", "blob:", "data:"],
    ["font-src", "'self'"],
    ["connect-src", ...connectSources],
    ["media-src", "'self'"],
    ["manifest-src", "'self'"],
    ["worker-src", "'self'", "blob:"],
    ["object-src", "'none'"],
    ["base-uri", "'self'"],
    ["form-action", "'self'"],
    ["frame-ancestors", "'none'"],
  ]
    .map(([directive, ...sources]) => `${directive} ${sources.join(" ")}`)
    .join("; ");
}

export function getSecurityHeaders(nodeEnvironment = "production") {
  return [
    {
      key: "Content-Security-Policy",
      value: createContentSecurityPolicy(nodeEnvironment),
    },
    {
      key: "Permissions-Policy",
      value:
        "browsing-topics=(), camera=(), geolocation=(), microphone=(), payment=(), usb=()",
    },
    {
      key: "Referrer-Policy",
      value: "strict-origin-when-cross-origin",
    },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  ];
}
