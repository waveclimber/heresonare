import "server-only";
import { cookies } from "next/headers";
import { getStore, storageConfigured } from "./store";
import { publicEntries, PlatformError } from "./domain";
import {
  administratorConfigured,
  sessionCookie,
  sessionValid,
} from "./security";

export async function getPublishedEntries() {
  if (!storageConfigured()) return [];
  return publicEntries(await getStore().read());
}
export async function getAdminState() {
  if (!storageConfigured() || !administratorConfigured())
    return { configured: false as const, state: null };
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) return { configured: true as const, state: null };
  const state = await getStore().read();
  return {
    configured: true as const,
    state: sessionValid(state, token)
      ? {
          records: state.records,
          submissions: state.submissions.map((item) => ({
            id: item.id,
            kind: item.kind,
            locale: item.locale,
            name: item.name,
            email: item.email,
            topic: item.topic,
            message: item.message,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            status: item.status,
            revision: item.revision,
            lines: item.lines,
          })),
          audit: state.audit,
        }
      : null,
  };
}
export function requestTime() {
  return Date.now();
}
export function json(value: unknown, status = 200) {
  return Response.json(value, {
    status,
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
  });
}
export function failure(error: unknown) {
  if (error instanceof PlatformError)
    return json({ error: error.code }, error.status);
  console.error("platform_operation_failed");
  return json({ error: "unavailable" }, 503);
}
