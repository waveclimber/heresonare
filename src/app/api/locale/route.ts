import { NextResponse } from "next/server";

import { noStoreCacheControl } from "@/config/http.mjs";
import { isLocale, localeCookieName } from "@/i18n/config";

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return jsonError("Expected application/json", 415);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Malformed JSON", 400);
  }

  const locale =
    typeof body === "object" && body !== null && "locale" in body
      ? body.locale
      : undefined;

  if (typeof locale !== "string" || !isLocale(locale)) {
    return jsonError("Unsupported locale", 400);
  }

  const response = new NextResponse(null, {
    status: 204,
    headers: { "Cache-Control": noStoreCacheControl },
  });
  response.cookies.set(localeCookieName, locale, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}

function jsonError(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: { "Cache-Control": noStoreCacheControl },
    },
  );
}
