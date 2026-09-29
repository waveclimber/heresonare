import assert from "node:assert/strict";
import { mkdtemp, rm, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import sharp from "sharp";
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
  const fixture = await sharp({
    create: { width: 48, height: 32, channels: 3, background: "#115e59" },
  })
    .png()
    .withMetadata()
    .toBuffer();
  const upload = {
    name: "Test only",
    data: fixture.toString("base64"),
    rights: true,
  };
  await rejects(() => p.uploadMedia(store, undefined, upload), "unauthorized");
  await rejects(
    () => p.uploadMedia(store, token, { ...upload, rights: false }),
    "media-rights-required",
  );
  await rejects(
    () =>
      p.uploadMedia(store, token, {
        ...upload,
        data: Buffer.from(
          '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
        ).toString("base64"),
      }),
    "invalid-media",
  );
  const media = await p.uploadMedia(store, token, upload);
  const image = await p.readMedia(store, token, media.id);
  const metadata = await sharp(image).metadata();
  ok(
    metadata.format === "webp" && !metadata.exif && metadata.width === 48,
    "image normalized and metadata removed",
  );
  await rejects(() => p.readMedia(store, undefined, media.id), "not-found");
  const editorial = {
    ...entry("about", "editorial-test"),
    featured: true,
    cover: {
      id: media.id,
      alt: { en: "Test cover", ja: "テスト", "zh-cn": "测试封面" },
    },
  };
  const created = await p.manage(store, token, {
    action: "save",
    entry: editorial,
  });
  await rejects(
    () => p.manage(store, token, { action: "media-delete", id: media.id }),
    "media-referenced",
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
    (await p.readMedia(store, undefined, media.id)).equals(image),
    "published cover public",
  );
  const changed = structuredClone(editorial);
  changed.translations.en.title = "Changed draft";
  await p.manage(store, token, {
    action: "save",
    id: created.id,
    revision: 3,
    entry: changed,
  });
  await rejects(
    () =>
      p.manage(store, token, {
        action: "restore",
        id: created.id,
        revision: 3,
        previousRevision: 3,
      }),
    "conflict",
  );
  await p.manage(store, token, {
    action: "restore",
    id: created.id,
    revision: 4,
    previousRevision: 3,
  });
  let record = (await store.read()).records.find(
    (item) => item.draft.id === created.id,
  );
  ok(
    record.draft.status === "draft" &&
      record.draft.revision === 5 &&
      record.draft.translations.en.title === editorial.translations.en.title &&
      record.published.revision === 3,
    "history restores draft without changing publication",
  );
  await p.manage(store, token, {
    action: "import",
    entry: { ...changed, id: created.id },
    revision: 5,
  });
  record = (await store.read()).records.find(
    (item) => item.draft.id === created.id,
  );
  ok(
    record.draft.revision === 6 && record.published.revision === 3,
    "import is a new draft revision",
  );
  await rejects(
    () =>
      p.manage(store, token, {
        action: "import",
        entry: { ...changed, id: created.id },
        revision: 5,
      }),
    "conflict",
  );
  const recovered = {
    ...editorial,
    id: randomUUID(),
    slug: "recovered-test",
    cover: { ...editorial.cover, id: randomUUID() },
  };
  await p.manage(store, token, {
    action: "import",
    entry: recovered,
    revision: 0,
  });
  record = (await store.read()).records.find(
    (item) => item.draft.id === recovered.id,
  );
  ok(
    !record.draft.cover && !record.published,
    "missing backup media removed and imported content private",
  );
  await p.manage(store, token, {
    action: "unpublish",
    id: created.id,
    revision: 6,
  });
  await rejects(() => p.readMedia(store, undefined, media.id), "not-found");
  await rejects(
    () => p.manage(store, token, { action: "media-delete", id: media.id }),
    "media-referenced",
  );
  await p.manage(store, token, {
    action: "delete",
    id: created.id,
    revision: 7,
  });
  await p.manage(store, token, { action: "media-delete", id: media.id });
  ok(!(await store.readAsset(media.id)), "unreferenced media bytes deleted");
  const rollbackId = randomUUID();
  await assert.rejects(() =>
    store.change(async (_state, assets) => {
      await assets.put(rollbackId, image);
      throw new Error("rollback");
    }),
  );
  ok(!(await store.readAsset(rollbackId)), "media transaction rollback");
  const remaining = (await store.read()).submissions[0];
  await rejects(
    () =>
      p.manage(store, token, {
        action: "submission-batch",
        status: "closed",
        items: [
          { id: remaining.id, revision: remaining.revision },
          { id: randomUUID(), revision: 1 },
        ],
      }),
    "not-found",
  );
  ok(
    (await store.read()).submissions[0].status === remaining.status,
    "batch rollback on any invalid item",
  );
  await p.manage(store, token, {
    action: "submission-batch",
    status: "closed",
    items: [{ id: remaining.id, revision: remaining.revision }],
  });
  ok(
    (await store.read()).submissions[0].status === "closed",
    "batch updates inbox",
  );
  const untranslated = {
    ...editorial,
    cover: { ...editorial.cover, alt: { en: "", ja: "", "zh-cn": "" } },
  };
  assert.throws(
    () => p.assertPublishable(untranslated, []),
    (error) => error.code === "media-alt-required",
  );
  checks++;
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
    () => p.readJson(request("http://127.0.0.1:3000", "x".repeat(160001))),
    "too-large",
  );
  const multilingual = entry("about");
  for (const locale of p.locales)
    multilingual.translations[locale].body = "響".repeat(12000);
  const decoded = await p.readJson(
    request("http://127.0.0.1:3000", JSON.stringify(multilingual)),
  );
  ok(
    p.parseEntry(decoded).translations.ja.body.length === 12000,
    "maximum multibyte translations fit the request limit",
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
