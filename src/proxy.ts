import { NextResponse, type NextRequest } from "next/server";
import { isNavigationKey } from "@/data/navigation";
import { isProductionSlug } from "@/data/productionRoutes";

import {
  getLocaleFromAcceptLanguage,
  getLocalizedPath,
  isLocale,
  localeCookieName,
} from "@/i18n/config";

export function proxy(request: NextRequest) {
  const parts = request.nextUrl.pathname.split("/").filter(Boolean);
  if (isLocale(parts[0])) {
    // Keep unknown static paths on the dynamic branded 404 route. This avoids
    // caching a missing page under the home/section ISR policy.
    const missingSection =
      parts.length === 2 &&
      !isNavigationKey(parts[1]) &&
      !["manage", "bag", "connect"].includes(parts[1]);
    const missingConcept =
      parts.length === 3 &&
      parts[1] === "productions" &&
      !isProductionSlug(parts[2]);
    if (missingSection || missingConcept) {
      const missing = request.nextUrl.clone();
      missing.pathname = `/${parts[0]}/__missing__/${parts.slice(1).join("/")}`;
      return NextResponse.rewrite(missing);
    }
    return NextResponse.next();
  }
  const cookieLocale = request.cookies.get(localeCookieName)?.value;
  const locale =
    cookieLocale && isLocale(cookieLocale)
      ? cookieLocale
      : getLocaleFromAcceptLanguage(request.headers.get("accept-language"));
  const redirectUrl = request.nextUrl.clone();

  redirectUrl.pathname = getLocalizedPath(request.nextUrl.pathname, locale);

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    "/en/:path*",
    "/ja/:path*",
    "/zh-cn/:path*",
    "/",
    "/tour",
    "/artists",
    "/productions",
    "/music",
    "/video",
    "/venues",
    "/store",
    "/about",
    "/contact",
  ],
};
