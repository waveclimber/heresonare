import { cookies } from "next/headers";
import { manage } from "@/platform/service";
import { getStore } from "@/platform/store";
import { readJson, sessionCookie } from "@/platform/security";
import { failure, json } from "@/platform/server";
export async function POST(request: Request) {
  try {
    const input = await readJson(request);
    return json(
      await manage(
        getStore(),
        (await cookies()).get(sessionCookie)?.value,
        input,
      ),
    );
  } catch (error) {
    return failure(error);
  }
}
