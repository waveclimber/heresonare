import { cookies } from "next/headers";
import { getStore } from "@/platform/store";
import { readJson, sessionCookie, sessionValid } from "@/platform/security";
import { PlatformError } from "@/platform/domain";
import { uploadMedia } from "@/platform/media";
import { failure, json } from "@/platform/server";
export async function POST(request: Request) {
  try {
    const store = getStore(),
      token = (await cookies()).get(sessionCookie)?.value;
    if (!sessionValid(await store.read(), token))
      throw new PlatformError("unauthorized", 401);
    return json(
      await uploadMedia(store, token, await readJson(request, 2900000)),
      201,
    );
  } catch (error) {
    return failure(error);
  }
}
