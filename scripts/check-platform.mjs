import assert from "node:assert/strict";
import { mkdtemp, rm, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import { loadPlatform } from "./platform-runtime.mjs";
const p = await loadPlatform();
const directory = await mkdtemp(resolve(".next/platform-check-"));
const original = { ...process.env };
let checks = 0;
function ok(value, message) {
  assert.ok(value, message);
  checks++;
}
async function rejects(action, code) {
  await assert.rejects(action, (error) => error.code === code);
  checks++;
}
const password = "test-only-admin-password-long";
process.env.PLATFORM_ADMIN_EMAIL = "admin@example.test";
process.env.PLATFORM_ADMIN_PASSWORD_HASH = await p.passwordHash(password);
process.env.PLATFORM_STORAGE = "local";
process.env.PLATFORM_ORIGIN = "http://127.0.0.1:3000";
function entry(section, slug = `test-${section}`) {
  return {
    module: section,
    slug,
    translations: Object.fromEntries(
      p.locales.map((locale) => [
        locale,
        {
          title: `Test ${section} ${locale}`,
          summary: `Summary ${locale}`,
          body: `Body ${locale}\n<not-html>`,
        },
      ]),
    ),
    category: "Test",
    location: "Test venue",
    startsAt: section === "tour" ? "2026-12-01T19:00:00+09:00" : "",
    endsAt: section === "tour" ? "2026-12-01T21:00:00+09:00" : "",
    externalUrl: "https://example.com/official",
    price: 2500,
    currency: "JPY",
    available: true,
    related: [],
  };
}
async function exercise(store, label) {
  const token = await p.authenticate(store, "admin@example.test", password);
  ok(p.sessionValid(await store.read(), token), `${label}: login`);
  ok(!p.sessionValid(await store.read(), "forged"), "forged session rejected");
  await rejects(
    () =>
      p.manage(store, "forged", { action: "save", entry: entry("artists") }),
    "unauthorized",
  );
  const ids = {};
  for (const section of p.modules) {
    const created = await p.manage(store, token, {
      action: "save",
      entry: entry(section),
    });
    ids[section] = created.id;
    ok(
      !p
        .publicEntries(await store.read())
        .some((item) => item.id === created.id),
      "draft private",
    );
    await rejects(
      () =>
        p.manage(store, token, {
          action: "publish",
          id: created.id,
          revision: 1,
        }),
      "review-required",
    );
    await p.manage(store, token, {
      action: "review",
      id: created.id,
      revision: 1,
    });
    await p.manage(store, token, {
      action: "publish",
      id: created.id,
      revision: 2,
    });
    ok(
      p
        .publicEntries(await store.read())
        .some((item) => item.id === created.id),
      `${section} published`,
    );
  }
  const revised = entry("artists");
  revised.translations.en.title = "PRIVATE REVISION";
  await p.manage(store, token, {
    action: "save",
    id: ids.artists,
    revision: 3,
    entry: revised,
  });
  ok(
    p.publicEntries(await store.read()).find((item) => item.id === ids.artists)
      .translations.en.title !== "PRIVATE REVISION",
    "draft edit does not leak",
  );
  await rejects(
    () =>
      p.manage(store, token, {
        action: "save",
        id: ids.artists,
        revision: 3,
        entry: revised,
      }),
    "conflict",
  );
  await rejects(
    () => p.manage(store, token, { action: "save", entry: entry("artists") }),
    "slug-used",
  );
  const incomplete = entry("about", "incomplete");
  incomplete.translations.ja.body = "";
  const saved = await p.manage(store, token, {
    action: "save",
    entry: incomplete,
  });
  await rejects(
    () =>
      p.manage(store, token, { action: "review", id: saved.id, revision: 1 }),
    "translations-required",
  );
  const linked = entry("music");
  linked.related = [ids.artists];
  await p.manage(store, token, {
    action: "save",
    id: ids.music,
    revision: 3,
    entry: linked,
  });
  await p.manage(store, token, {
    action: "review",
    id: ids.music,
    revision: 4,
  });
  await p.manage(store, token, {
    action: "publish",
    id: ids.music,
    revision: 5,
  });
  await rejects(
    () =>
      p.manage(store, token, {
        action: "unpublish",
        id: ids.artists,
        revision: 4,
      }),
    "referenced",
  );
  const inquiry = {
    kind: "inquiry",
    locale: "zh-cn",
    name: "Test visitor",
    email: "visitor@example.test",
    topic: "artists",
    message: "Test only 中文 🎵",
    consent: true,
    website: "",
    key: randomUUID(),
  };
  const reference = await p.submit(store, inquiry);
  assert.deepEqual(await p.submit(store, inquiry), reference);
  checks++;
  await rejects(
    () => p.submit(store, { ...inquiry, message: "Changed with same key" }),
    "conflict",
  );
  await rejects(
    () => p.submit(store, { ...inquiry, key: randomUUID(), consent: false }),
    "invalid",
  );
  const order = {
    ...inquiry,
    kind: "order",
    key: randomUUID(),
    lines: [{ id: ids.store, quantity: 2, price: 1 }],
  };
  const result = await p.submit(store, order);
  ok(
    (await store.read()).submissions.find(
      (item) => item.id === result.reference,
    ).lines[0].price === 2500,
    "server price wins",
  );
  await rejects(
    () =>
      p.submit(store, {
        ...order,
        key: randomUUID(),
        lines: [{ id: ids.artists, quantity: 1 }],
      }),
    "product-unavailable",
  );
  await rejects(
    () =>
      p.submit(store, {
        ...order,
        key: randomUUID(),
        lines: [{ id: ids.store, quantity: 11 }],
      }),
    "invalid-order",
  );
  await p.manage(store, token, {
    action: "submission-status",
    id: reference.reference,
    revision: 1,
    status: "in-progress",
  });
  await rejects(
    () =>
      p.manage(store, token, {
        action: "submission-status",
        id: reference.reference,
        revision: 1,
        status: "closed",
      }),
    "conflict",
  );
  await p.manage(store, token, {
    action: "submission-delete",
    id: reference.reference,
    revision: 2,
  });
  ok(
    !(await store.read()).submissions.some(
      (item) => item.id === reference.reference,
    ),
    "PII deletion",
  );
  await p.manage(store, token, {
    action: "unpublish",
    id: ids.store,
    revision: 3,
  });
  await rejects(
    () => p.submit(store, { ...order, key: randomUUID() }),
    "product-unavailable",
  );
  await p.manage(store, token, {
    action: "delete",
    id: ids.store,
    revision: 4,
  });
  ok(
    !(await store.read()).records.some((item) => item.draft.id === ids.store),
    "unpublish/delete",
  );
  const event = p
    .publicEntries(await store.read())
    .find((item) => item.module === "tour");
  const ics = p.calendar(event, "zh-cn", "https://heresonare.com");
  ok(
    ics.includes("DTSTART:20261201T100000Z") && ics.includes("BEGIN:VEVENT"),
    "UTC calendar",
  );
  ok(
    ics.split("\r\n").every((line) => Buffer.byteLength(line) <= 75),
    "calendar octet folding",
  );
  ok(
    !(await store.read()).audit.some((item) =>
      JSON.stringify(item).includes("visitor@example.test"),
    ),
    "audit redacts content",
  );
  const before = (await store.read()).audit.length;
  await Promise.all(
    Array.from({ length: 12 }, (_, index) =>
      store.change((state) => p.audit(state, "concurrency", String(index))),
    ),
  );
  ok(
    (await store.read()).audit.length === before + 12,
    "concurrent writes preserved",
  );
  await assert.rejects(() =>
    store.change((state) => {
      state.records = [];
      throw new Error("rollback");
    }),
  );
  ok((await store.read()).records.length > 0, "failed transaction rolls back");
  process.env.PLATFORM_ADMIN_PASSWORD_HASH = await p.passwordHash(password);
  ok(
    !p.sessionValid(await store.read(), token),
    "credential rotation revokes sessions",
  );
  await p.throttle(store, "test-limit", 1, 60000);
  await rejects(() => p.throttle(store, "test-limit", 1, 60000), "rate-limit");
}
try {
  await exercise(p.localStore(directory), "local");
  const persisted = await p.localStore(directory).read();
  ok(persisted.records.length > 0, "restart persistence");
  for (const url of [
    "javascript:alert(1)",
    "http://example.com",
    "https://user:secret@example.com",
    "//example.com",
  ])
    assert.throws(() => p.safeUrl(url));
  checks += 4;
  const request = (origin, body = "{}") =>
    new Request("http://127.0.0.1:3000/api/platform/admin", {
      method: "POST",
      headers: { origin, "Content-Type": "application/json" },
      body,
    });
  await rejects(() => p.readJson(request("https://evil.example")), "forbidden");
  await rejects(
    () => p.readJson(request("http://127.0.0.1:3000", "x".repeat(100001))),
    "too-large",
  );
  ok(
    await p.checkPassword(password, process.env.PLATFORM_ADMIN_PASSWORD_HASH),
    "password verification",
  );
  ok(
    !(await p.checkPassword(
      "incorrect",
      process.env.PLATFORM_ADMIN_PASSWORD_HASH,
    )),
    "wrong password rejected",
  );
  if (process.env.TEST_DATABASE_URL) {
    const url = new URL(process.env.TEST_DATABASE_URL);
    assert.equal(
      url.pathname,
      "/heresonare_test",
      "Database integration tests only run against the explicitly named test database.",
    );
    const pool = new Pool({ connectionString: url.href, max: 3 });
    try {
      await pool.query(await readFile("src/platform/schema.sql", "utf8"));
      await pool.query(
        "UPDATE heresonare_platform SET document=$1::jsonb WHERE id=1",
        [JSON.stringify(p.emptyState())],
      );
      await exercise(p.postgresStore(pool), "postgres");
      console.log("PostgreSQL adapter integration passed.");
    } finally {
      await pool.end();
    }
  }
  console.log(
    `Platform checks passed (${checks} assertions): all modules, publishing isolation, auth, concurrency, validation, inbox, order integrity, calendar, rollback and persistence.`,
  );
} finally {
  process.env = original;
  await rm(directory, { recursive: true, force: true });
}
