import { getAdminState, failure } from "@/platform/server";
import { PlatformError } from "@/platform/domain";
export async function GET() {
  try {
    const { state } = await getAdminState();
    if (!state) throw new PlatformError("unauthorized", 401);
    return new Response(
      JSON.stringify(
        {
          version: 1,
          exportedAt: new Date().toISOString(),
          records: state.records,
        },
        null,
        2,
      ),
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Disposition": "attachment; filename=heresonare-content.json",
          "Cache-Control": "no-store",
          "X-Robots-Tag": "noindex",
        },
      },
    );
  } catch (error) {
    return failure(error);
  }
}
