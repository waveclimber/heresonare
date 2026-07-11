import { NextResponse } from "next/server";

import { isLocale, localeCookieName } from "@/i18n/config";

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const locale =
    typeof body === "object" && body !== null && "locale" in body
      ? body.locale
      : undefined;

  if (typeof locale !== "string" || !isLocale(locale)) {
    return NextResponse.json({ error: "Unsupported locale" }, { status: 400 });
  }

  const response = new NextResponse(null, { status: 204 });
  response.cookies.set(localeCookieName, locale, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });

  return response;
}
