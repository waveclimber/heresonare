import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { locales, modules } from "@/platform/domain";
import { manage } from "@/platform/service";
import { getStore } from "@/platform/store";
import { readJson, sessionCookie } from "@/platform/security";
import { failure, json } from "@/platform/server";
export async function POST(request: Request) {
  try {
    const input = await readJson(request);
    const result = await manage(
      getStore(),
      (await cookies()).get(sessionCookie)?.value,
      input,
    );
    const action = (input as { action?: string }).action;
    if (["publish", "unpublish", "delete"].includes(action ?? "")) {
      for (const locale of locales) {
        revalidatePath(`/${locale}`);
        for (const section of modules) revalidatePath(`/${locale}/${section}`);
      }
      revalidatePath("/sitemap.xml");
    }
    return json(result);
  } catch (error) {
    return failure(error);
  }
}
