import { resolveSiteUrlFromEnvironment } from "@/config/site.mjs";

export const siteUrl = resolveSiteUrlFromEnvironment();

export function getAbsoluteSiteUrl(pathname: string) {
  if (!pathname.startsWith("/") || pathname.startsWith("//")) {
    throw new Error("Site URL paths must be root-relative.");
  }

  return new URL(pathname, siteUrl).toString();
}
