import {
  createHash,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { PlatformError, type State } from "./domain";
import type { Store } from "./store";
const scrypt = (password: string, salt: string) =>
  new Promise<Buffer>((resolve, reject) =>
    scryptCallback(
      password,
      salt,
      64,
      { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 },
      (error, key) => (error ? reject(error) : resolve(key)),
    ),
  );
export const sessionCookie = "heresonare-admin";
export const hash = (value: string) =>
  createHash("sha256").update(value).digest("hex");
export async function passwordHash(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = await scrypt(password, salt);
  return `scrypt:${salt}:${derived.toString("hex")}`;
}
export async function checkPassword(password: string, encoded: string) {
  if (
    !/^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/u.test(encoded) ||
    password.length > 256
  )
    return false;
  const [, salt, expected] = encoded.split(":");
  const actual = await scrypt(password, salt);
  return timingSafeEqual(actual, Buffer.from(expected, "hex"));
}
export function administratorConfigured() {
  return Boolean(
    process.env.PLATFORM_ADMIN_EMAIL &&
      /^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/u.test(
        process.env.PLATFORM_ADMIN_PASSWORD_HASH ?? "",
      ),
  );
}
export function credentialVersion() {
  return hash(
    `${process.env.PLATFORM_ADMIN_EMAIL}:${process.env.PLATFORM_ADMIN_PASSWORD_HASH}`,
  );
}
export function audit(state: State, action: string, target: string) {
  state.audit.unshift({ at: new Date().toISOString(), action, target });
  state.audit = state.audit.slice(0, 500);
}
export async function throttle(
  store: Store,
  key: string,
  limit: number,
  windowMs: number,
) {
  const allowed = await store.change((state) => {
    const now = Date.now();
    state.limits = Object.fromEntries(
      Object.entries(state.limits).filter(([, item]) => item.until > now),
    );
    const item = state.limits[key] ?? { count: 0, until: now + windowMs };
    item.count++;
    state.limits[key] = item;
    return item.count <= limit;
  });
  if (!allowed) throw new PlatformError("rate-limit", 429);
}
export async function authenticate(
  store: Store,
  email: string,
  password: string,
) {
  if (!administratorConfigured()) throw new PlatformError("unavailable", 503);
  // Account-wide rate limit cannot be bypassed with forged proxy headers.
  await throttle(store, "admin-login", 10, 15 * 60 * 1000);
  const correct = await checkPassword(
    password,
    process.env.PLATFORM_ADMIN_PASSWORD_HASH!,
  );
  if (
    !correct ||
    email.toLowerCase() !== process.env.PLATFORM_ADMIN_EMAIL!.toLowerCase()
  )
    throw new PlatformError("unauthorized", 401);
  const token = randomBytes(32).toString("hex");
  await store.change((state) => {
    state.sessions = state.sessions
      .filter((session) => session.expires > Date.now())
      .slice(-9);
    state.sessions.push({
      hash: hash(token),
      expires: Date.now() + 8 * 60 * 60 * 1000,
      credential: credentialVersion(),
    });
    audit(state, "login", "administrator");
  });
  return token;
}
export function sessionValid(state: State, token: string | undefined) {
  return Boolean(
    administratorConfigured() &&
      token &&
      /^[a-f0-9]{64}$/u.test(token) &&
      state.sessions.some(
        (session) =>
          session.hash === hash(token) &&
          session.expires > Date.now() &&
          session.credential === credentialVersion(),
      ),
  );
}
export function assertOrigin(request: Request) {
  const configured = process.env.PLATFORM_ORIGIN;
  if (!configured) throw new PlatformError("unavailable", 503);
  const origin = new URL(configured).origin;
  if (
    (new URL(origin).protocol !== "https:" &&
      !(
        process.env.PLATFORM_STORAGE === "local" &&
        /^http:\/\/127\.0\.0\.1:\d+$/u.test(origin)
      )) ||
    request.headers.get("origin") !== origin ||
    !request.headers.get("content-type")?.startsWith("application/json")
  )
    throw new PlatformError("forbidden", 403);
}
export async function readJson(request: Request) {
  assertOrigin(request);
  const reader = request.body?.getReader();
  if (!reader) throw new PlatformError("invalid");
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    for (;;) {
      const next = await reader.read();
      if (next.done) break;
      length += next.value.length;
      if (length > 100000) {
        await reader.cancel();
        throw new PlatformError("too-large", 413);
      }
      chunks.push(next.value);
    }
    return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
  } catch (error) {
    if (error instanceof PlatformError) throw error;
    throw new PlatformError("invalid");
  }
}
