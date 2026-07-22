import { noStoreCacheControl } from "@/config/http.mjs";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    { status: "ok" },
    {
      headers: {
        "Cache-Control": noStoreCacheControl,
      },
    },
  );
}
