import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { mkdtemp, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { loadPlatform } from "./platform-runtime.mjs";
const p = await loadPlatform();
const directory = await mkdtemp(resolve(".next/platform-http-"));
const socket = createServer();
await new Promise((done) => socket.listen(0, "127.0.0.1", done));
const port = socket.address().port;
await new Promise((done) => socket.close(done));
const origin = `http://127.0.0.1:${port}`;
const password = randomUUID() + randomUUID();
const child = spawn(
  process.execPath,
  [
    resolve("node_modules/next/dist/bin/next"),
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    String(port),
  ],
  {
    env: {
      ...process.env,
      NODE_ENV: "production",
      PLATFORM_STORAGE: "local",
      PLATFORM_ORIGIN: origin,
      PLATFORM_LOCAL_DIRECTORY: directory,
      PLATFORM_ADMIN_EMAIL: "http-test@example.test",
      PLATFORM_ADMIN_PASSWORD_HASH: await p.passwordHash(password),
    },
    stdio: "ignore",
  },
);
const exited = new Promise((done) => child.once("exit", done));
let cookie = "";
async function post(path, value, authenticated = true, requestOrigin = origin) {
  return fetch(`${origin}/api/platform/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: requestOrigin,
      ...(authenticated ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify(value),
  });
}
try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      if ((await fetch(`${origin}/api/health`)).ok) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((done) => setTimeout(done, 250));
  }
  assert.ok(ready, "Production server must start");
  assert.equal((await fetch(`${origin}/api/platform/export`)).status, 401);
  assert.equal((await post("admin", { action: "save" }, false)).status, 401);
  assert.equal(
    (await post("session", {}, false, "https://other.example")).status,
    403,
  );
  const login = await post(
    "session",
    { email: "http-test@example.test", password },
    false,
  );
  assert.equal(login.status, 200);
  const session = login.headers.get("set-cookie");
  assert.match(session, /httponly/iu);
  assert.match(session, /samesite=strict/iu);
  cookie = session.split(";")[0];
  const imageData = await sharp({
    create: { width: 40, height: 30, channels: 3, background: "#115e59" },
  })
    .png()
    .toBuffer();
  const uploadBody = {
    name: "HTTP cover",
    data: imageData.toString("base64"),
    rights: true,
  };
  assert.equal((await post("media", uploadBody, false)).status, 401);
  assert.equal(
    (await post("media", uploadBody, true, "https://other.example")).status,
    403,
  );
  const upload = await post("media", uploadBody);
  assert.equal(upload.status, 201);
  const media = await upload.json();
  const imageUrl = `${origin}/api/platform/media/${media.id}`;
  assert.equal(
    (await fetch(imageUrl)).status,
    404,
    "unpublished media private",
  );
  const privateImage = await fetch(imageUrl, { headers: { Cookie: cookie } });
  assert.equal(privateImage.status, 200);
  assert.match(privateImage.headers.get("cache-control"), /no-store/u);
  const input = {
    module: "tour",
    slug: "http-test-event",
    translations: Object.fromEntries(
      p.locales.map((locale) => [
        locale,
        {
          title: `HTTP fixture ${locale}`,
          summary: `Calendar summary ${locale}`,
          body: `## Test heading ${locale}\n\n**Bold text**\n- One\n- Two\n\n<script>alert(1)</script>`,
        },
      ]),
    ),
    category: "Test",
    location: "Test place",
    startsAt: "2026-12-01T19:00:00+09:00",
    endsAt: "2026-12-01T21:00:00+09:00",
    externalUrl: "https://example.com/",
    price: 0,
    currency: "JPY",
    available: false,
    related: [],
    featured: true,
    cover: {
      id: media.id,
      alt: { en: "Test image", ja: "テスト画像", "zh-cn": "测试图片" },
    },
  };
  const create = await post("admin", { action: "save", entry: input });
  assert.equal(create.status, 200);
  const { id } = await create.json();
  assert.equal(
    (await fetch(`${origin}/en/catalog/tour/http-test-event`)).status,
    404,
    "draft cannot be read anonymously",
  );
  assert.equal(
    (await post("admin", { action: "review", id, revision: 1 })).status,
    200,
  );
  assert.equal(
    (await post("admin", { action: "publish", id, revision: 2 })).status,
    200,
  );
  for (const locale of p.locales) {
    const response = await fetch(
      `${origin}/${locale}/catalog/tour/http-test-event`,
    );
    assert.equal(response.status, 200);
    assert.match(
      await response.text(),
      new RegExp(`HTTP fixture ${locale}`, "u"),
    );
    const search = await fetch(`${origin}/api/search?locale=${locale}`);
    assert.equal(search.headers.get("cache-control"), "no-store");
    assert.ok(
      (await search.json()).entries.some(
        (entry) => entry.href === `/${locale}/catalog/tour/http-test-event`,
      ),
    );
  }
  assert.equal(
    (await fetch(imageUrl)).headers.get("content-type"),
    "image/webp",
  );
  const detail = await (
    await fetch(`${origin}/en/catalog/tour/http-test-event`)
  ).text();
  assert.match(detail, /<strong>Bold text<\/strong>/u);
  assert.match(detail, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/u);
  for (const path of ["/en", "/en/tour"]) {
    const highlighted = await fetch(`${origin}${path}`);
    assert.equal(highlighted.status, 200, `${path}: highlights page available`);
    assert.ok((await highlighted.text()).includes("HTTP fixture en"), `${path}: published content reaches home/section`);
  }
  const changed = structuredClone(input);
  changed.translations.en.title = "PRIVATE EDITORIAL DRAFT";
  assert.equal(
    (await post("admin", { action: "save", id, revision: 3, entry: changed }))
      .status,
    200,
  );
  assert.doesNotMatch(
    await (await fetch(`${origin}/en`)).text(),
    /PRIVATE EDITORIAL DRAFT/u,
  );
  assert.equal(
    (
      await post("admin", {
        action: "restore",
        id,
        revision: 4,
        previousRevision: 3,
      })
    ).status,
    200,
  );
  assert.equal(
    (
      await post("admin", {
        action: "import",
        entry: { ...changed, id },
        revision: 5,
      })
    ).status,
    200,
  );
  assert.doesNotMatch(
    await (await fetch(`${origin}/en/catalog/tour/http-test-event`)).text(),
    /PRIVATE EDITORIAL DRAFT/u,
  );
  const filtered = await fetch(`${origin}/en/catalog/tour?q=absent`);
  for (const [locale, titles] of Object.entries({
    en: ["Website workspace", "Enquiry basket", "Send an enquiry"],
    ja: ["ウェブサイト管理", "商品問い合わせリスト", "お問い合わせを送る"],
    "zh-cn": ["官网工作台", "商品意向单", "在线咨询"],
  })) {
    for (const [index, path] of ["manage", "bag", "connect"].entries()) {
      const page = await (await fetch(`${origin}/${locale}/${path}`)).text();
      assert.ok(
        page.includes(`<title>${titles[index]}`),
        `${locale}/${path} has a localized document title`,
      );
      assert.match(page, /<meta name="robots" content="noindex/u);
    }
  }
  assert.match(await filtered.text(), /No matching items/u);
  const calendar = await fetch(
    `${origin}/api/platform/calendar/${id}?locale=ja`,
  );
  assert.match(calendar.headers.get("content-type"), /text\/calendar/u);
  assert.match(await calendar.text(), /DTSTART:20261201T100000Z/u);
  const inquiry = {
    kind: "inquiry",
    locale: "ja",
    name: "HTTP visitor",
    email: "http-visitor@example.test",
    message: "Private message",
    topic: "general",
    consent: true,
    website: "",
    key: randomUUID(),
  };
  const submitted = await post("submissions", inquiry, false);
  assert.equal(submitted.status, 201);
  const receipt = await submitted.json();
  assert.deepEqual(
    await (await post("submissions", inquiry, false)).json(),
    receipt,
  );
  const admin = await fetch(`${origin}/zh-cn/manage`, {
    headers: { Cookie: cookie },
  });
  assert.match(await admin.text(), /http-visitor@example.test/u);
  assert.match(admin.headers.get("cache-control"), /no-store/u);
  const anonymous = await fetch(`${origin}/zh-cn/manage`);
  assert.doesNotMatch(
    await anonymous.text(),
    /http-visitor@example.test|Private message/u,
  );
  const backup = await fetch(`${origin}/api/platform/export`, {
    headers: { Cookie: cookie },
  });
  assert.match(backup.headers.get("content-disposition"), /attachment/u);
  assert.doesNotMatch(
    await backup.text(),
    /http-visitor@example.test|sessions|password/u,
  );
  assert.equal(
    (await post("admin", { action: "unpublish", id, revision: 6 })).status,
    200,
  );
  assert.equal(
    (await fetch(`${origin}/en/catalog/tour/http-test-event`)).status,
    404,
  );
  assert.equal(
    (await fetch(`${origin}/api/platform/calendar/${id}`)).status,
    404,
  );
  assert.equal(
    (await fetch(imageUrl)).status,
    404,
    "unpublishing withdraws image access",
  );
  for (const path of ["/en", "/en/tour"])
    assert.doesNotMatch(
      await (await fetch(`${origin}${path}`)).text(),
      /HTTP fixture en/u,
      "highlights removed on unpublish",
    );
  assert.equal((await post("session", { action: "logout" })).status, 200);
  assert.equal(
    (
      await fetch(`${origin}/api/platform/export`, {
        headers: { Cookie: cookie },
      })
    ).status,
    401,
    "logout revokes server session",
  );
  console.log(
    "Platform HTTP checks passed: production authentication, CSRF, publish/unpublish, multilingual detail/search, calendar, inbox isolation, backup and logout.",
  );
} finally {
  child.kill();
  await exited;
  await rm(directory, { recursive: true, force: true });
}
