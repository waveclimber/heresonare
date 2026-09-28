import { randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { loadPlatform } from "./platform-runtime.mjs";
const { passwordHash } = await loadPlatform();
const current = await readFile(".env.local", "utf8").catch((error) => {
  if (error.code === "ENOENT") return "";
  throw error;
});
if (/^PLATFORM_/mu.test(current))
  throw new Error(
    "Existing platform configuration found; refusing to overwrite it.",
  );
const password = randomBytes(24).toString("base64url");
const email = "admin@localhost.test";
await mkdir(".local-platform", { recursive: true, mode: 0o700 });
await writeFile(
  ".local-platform/admin-access.txt",
  `Local workspace only\nURL: http://127.0.0.1:3000/zh-cn/manage\nEmail: ${email}\nPassword: ${password}\n`,
  { mode: 0o600, flag: "wx" },
);
await writeFile(
  ".env.local",
  `${current.trim()}\nPLATFORM_STORAGE=local\nPLATFORM_ORIGIN=http://127.0.0.1:3000\nPLATFORM_ADMIN_EMAIL=${email}\nPLATFORM_ADMIN_PASSWORD_HASH=${await passwordHash(password)}\n`,
  { mode: 0o600 },
);
console.log(
  "Local platform configured. Access details: .local-platform/admin-access.txt (ignored by Git). Restart the app on 127.0.0.1:3000.",
);
