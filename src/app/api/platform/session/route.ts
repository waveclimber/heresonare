import { cookies } from "next/headers";
import { object, text } from "@/platform/domain";
import {
  authenticate,
  hash,
  readJson,
  sessionCookie,
} from "@/platform/security";
import { getStore } from "@/platform/store";
import { failure, json } from "@/platform/server";
export async function POST(request: Request) {
  try {
    const input = object(await readJson(request));
    const jar = await cookies();
    const options = {
      httpOnly: true,
      sameSite: "strict" as const,
      secure: process.env.PLATFORM_ORIGIN?.startsWith("https:") ?? true,
      path: "/",
    };
    if (input.action === "logout") {
      const token = jar.get(sessionCookie)?.value;
      if (token)
        await getStore().change((state) => {
          state.sessions = state.sessions.filter(
            (item) => item.hash !== hash(token),
          );
        });
      jar.set(sessionCookie, "", { ...options, maxAge: 0 });
      return json({ ok: true });
    }
    const token = await authenticate(
      getStore(),
      text(input.email, 254, true),
      typeof input.password === "string" && input.password.length <= 256 ? input.password : "",
    );
    jar.set(sessionCookie, token, { ...options, maxAge: 8 * 60 * 60 });
    return json({ ok: true });
  } catch (error) {
    return failure(error);
  }
}
