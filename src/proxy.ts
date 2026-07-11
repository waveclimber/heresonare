import { NextResponse, type NextRequest } from "next/server";

import {
  getLocaleFromAcceptLanguage,
  getLocalizedPath,
  isLocale,
  localeCookieName,
} from "@/i18n/config";

export function proxy(request: NextRequest) {
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
