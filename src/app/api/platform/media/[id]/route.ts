import { cookies } from "next/headers";
import { getStore } from "@/platform/store";
import { sessionCookie } from "@/platform/security";
import { readMedia } from "@/platform/media";
import { failure } from "@/platform/server";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const data = await readMedia(
      getStore(),
      (await cookies()).get(sessionCookie)?.value,
      (await params).id,
    );
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": "image/webp",
        "Content-Length": String(data.length),
        "Cache-Control": "private, no-store",
        Vary: "Cookie",
        "X-Robots-Tag": "noindex",
        "Content-Disposition": "inline; filename=cover.webp",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    return failure(error);
  }
}
