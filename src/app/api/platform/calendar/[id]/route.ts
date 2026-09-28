import { calendar, locales, oneOf, PlatformError } from "@/platform/domain";
import { failure, getPublishedEntries } from "@/platform/server";
import { siteUrl } from "@/lib/siteUrl";
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const locale = oneOf(
      new URL(request.url).searchParams.get("locale") ?? "en",
      locales,
    );
    const entry = (await getPublishedEntries()).find((item) => item.id === id);
    if (!entry) throw new PlatformError("not-found", 404);
    return new Response(calendar(entry, locale, siteUrl.origin), {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${entry.slug}.ics"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return failure(error);
  }
}
