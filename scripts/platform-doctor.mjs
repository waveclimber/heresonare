import { loadPlatform } from "./platform-runtime.mjs";
try {
  process.loadEnvFile(".env.local");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
const p = await loadPlatform();
const storage = process.env.PLATFORM_STORAGE ?? "disabled";
let failed = false;
function report(label, ok) {
  console.log(`${ok ? "OK" : "NEEDS SETUP"}: ${label}`);
  if (!ok) failed = true;
}
report("Storage adapter configured", p.storageConfigured());
report("Administrator configured", p.administratorConfigured());
let validOrigin = false;
try {
  const url = new URL(process.env.PLATFORM_ORIGIN);
  validOrigin =
    url.href === `${url.origin}/` &&
    (url.protocol === "https:" ||
      (storage === "local" && /^http:\/\/127\.0\.0\.1:\d+$/u.test(url.origin)));
} catch {}
report("Canonical origin configured", validOrigin);
if (p.storageConfigured()) {
  try {
    const store = p.getStore(),
      state = await store.read();
    // Also verifies the additive media table exists in PostgreSQL, without writing data.
    await store.readAsset("00000000-0000-0000-0000-000000000000");
    report("Content and media storage readable", true);
    console.log(
      `Content: ${state.records.length}; published: ${p.publicEntries(state).length}; images: ${state.media?.length ?? 0}`,
    );
    console.log(
      `Enquiries: ${state.submissions.length}; approximate document size: ${Math.ceil(Buffer.byteLength(JSON.stringify(state)) / 1024)} KiB / 32768 KiB`,
    );
    for (const asset of state.media ?? [])
      if (!(await store.readAsset(asset.id))) {
        report("A referenced image file is missing", false);
        break;
      }
  } catch {
    report("Storage connection, schema and media access", false);
  }
}
console.log(
  storage === "local"
    ? "LOCAL PREVIEW ONLY: production storage is still required."
    : "Confirm provider backups, retention and live HTTPS acceptance separately.",
);
console.log(
  "This read-only check does not send email, test payments or prove production deployment.",
);
process.exitCode = failed ? 1 : 0;
