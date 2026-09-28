import { noStoreCacheControl } from "@/config/http.mjs";
import { getSearchIndex } from "@/content/searchIndex";
import { isLocale } from "@/i18n/config";
import { storageConfigured } from "@/platform/store";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const locale = params.get("locale");
  if (!locale || !isLocale(locale) || params.getAll("locale").length !== 1) {
    return Response.json({ error: "Unsupported locale" }, { status: 400, headers: { "Cache-Control": noStoreCacheControl } });
  }

  // Only the public index is requested; visitors' search text stays in the browser.
  const entries = await getSearchIndex(locale);
  return Response.json({ locale, entries }, {
    headers: { "Cache-Control": storageConfigured() ? "no-store" : "public, max-age=300, s-maxage=300", "X-Robots-Tag": "noindex" },
  });
}
