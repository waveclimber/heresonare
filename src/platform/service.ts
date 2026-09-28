import { randomUUID } from "node:crypto";
import {
  assertPublishable,
  locales,
  object,
  oneOf,
  parseEntry,
  PlatformError,
  publicEntries,
  text,
  type Entry,
  type State,
  type Submission,
} from "./domain";
import { audit, hash, sessionValid, throttle } from "./security";
import type { Store } from "./store";

function admin(state: State, token: string | undefined) {
  if (!sessionValid(state, token)) throw new PlatformError("unauthorized", 401);
}
function revision(actual: number, expected: unknown) {
  if (actual !== expected) throw new PlatformError("conflict", 409);
}
export async function manage(
  store: Store,
  token: string | undefined,
  value: unknown,
) {
  const input = object(value);
  return store.change((state) => {
    admin(state, token);
    const now = new Date().toISOString();
    const id = typeof input.id === "string" ? input.id : "";
    if (input.action === "save") {
      const fields = parseEntry(input.entry);
      const current = state.records.find((record) => record.draft.id === id);
      if (id && !current) throw new PlatformError("not-found", 404);
      if (current) {
        revision(current.draft.revision, input.revision);
        if (
          current.draft.module !== fields.module ||
          current.draft.slug !== fields.slug
        )
          throw new PlatformError("identity-fixed");
      } else if (state.records.length >= 500)
        throw new PlatformError("capacity", 409);
      if (
        state.records.some(
          (record) =>
            record.draft.module === fields.module &&
            record.draft.slug === fields.slug &&
            record.draft.id !== id,
        )
      )
        throw new PlatformError("slug-used", 409);
      const draft: Entry = {
        ...fields,
        id: current?.draft.id ?? randomUUID(),
        revision: (current?.draft.revision ?? 0) + 1,
        status: "draft",
        updatedAt: now,
      };
      if (current) current.draft = draft;
      else state.records.unshift({ draft, published: null });
      audit(state, "save", draft.id);
      return { id: draft.id };
    }
    if (
      ["review", "publish", "unpublish", "delete"].includes(
        String(input.action),
      )
    ) {
      const record = state.records.find((item) => item.draft.id === id);
      if (!record) throw new PlatformError("not-found", 404);
      revision(record.draft.revision, input.revision);
      if (input.action === "publish") {
        if (record.draft.status !== "review")
          throw new PlatformError("review-required");
        assertPublishable(record.draft, state.records);
        record.draft.status = "published";
      } else if (input.action === "review") {
        assertPublishable(record.draft, state.records);
        record.draft.status = "review";
      } else {
        if (state.records.some((item) => item.published?.related.includes(id)))
          throw new PlatformError("referenced", 409);
        if (input.action === "delete") {
          if (record.published) throw new PlatformError("unpublish-required");
          state.records = state.records.filter((item) => item !== record);
        } else {
          record.published = null;
          record.draft.status = "archived";
        }
      }
      record.draft.revision++;
      record.draft.updatedAt = now;
      if (input.action === "publish")
        record.published = structuredClone(record.draft);
      audit(state, String(input.action), id);
      return { id };
    }
    if (
      input.action === "submission-status" ||
      input.action === "submission-delete"
    ) {
      const item = state.submissions.find((submission) => submission.id === id);
      if (!item) throw new PlatformError("not-found", 404);
      revision(item.revision, input.revision);
      if (input.action === "submission-delete")
        state.submissions = state.submissions.filter(
          (submission) => submission.id !== id,
        );
      else {
        item.status = oneOf(input.status, [
          "new",
          "in-progress",
          "resolved",
          "closed",
        ]);
        item.updatedAt = now;
        item.revision++;
      }
      audit(state, String(input.action), id);
      return { id };
    }
    throw new PlatformError("invalid");
  });
}
export async function submit(store: Store, value: unknown) {
  const input = object(value);
  const kind = oneOf(input.kind, ["inquiry", "order"]);
  const locale = oneOf(input.locale, locales);
  const name = text(input.name, 80, true),
    email = text(input.email, 254, true).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email))
    throw new PlatformError("invalid-email");
  const message = text(input.message, 3000, kind === "inquiry");
  const topic = oneOf(input.topic, [
    "general",
    "artists",
    "partners",
    "venues",
    "production",
  ]);
  if (input.consent !== true || input.website !== "")
    throw new PlatformError("invalid");
  const key = text(input.key, 64, true);
  if (!/^[a-f0-9-]{36}$/u.test(key)) throw new PlatformError("invalid");
  const rawLines = kind === "order" ? input.lines : [];
  if (
    !Array.isArray(rawLines) ||
    (kind === "order" && !rawLines.length) ||
    rawLines.length > 20
  )
    throw new PlatformError("invalid-order");
  const requested = rawLines.map((value) => {
    const line = object(value);
    if (
      !Number.isInteger(line.quantity) ||
      Number(line.quantity) < 1 ||
      Number(line.quantity) > 10
    )
      throw new PlatformError("invalid-order");
    return { id: text(line.id, 36, true), quantity: Number(line.quantity) };
  });
  if (new Set(requested.map((line) => line.id)).size !== requested.length)
    throw new PlatformError("invalid-order");
  const digest = hash(
    JSON.stringify({ kind, locale, name, email, message, topic, requested }),
  );
  // Limits are durable and shared by all application instances; no trusted IP assumptions.
  await throttle(store, "public-global", 120, 60 * 60 * 1000);
  return store.change((state) => {
    const existing = state.submissions.find((item) => item.key === key);
    if (existing) {
      if (existing.digest !== digest) throw new PlatformError("conflict", 409);
      return { reference: existing.id };
    }
    if (
      state.submissions.filter(
        (item) =>
          item.email === email &&
          Date.parse(item.createdAt) > Date.now() - 60 * 60 * 1000,
      ).length >= 5
    )
      throw new PlatformError("rate-limit", 429);
    if (state.submissions.length >= 2000)
      throw new PlatformError("capacity", 503);
    const entries = publicEntries(state);
    const lines = requested.map((line) => {
      const product = entries.find(
        (entry) =>
          entry.id === line.id &&
          entry.module === "store" &&
          entry.available &&
          entry.price > 0,
      );
      if (!product) throw new PlatformError("product-unavailable", 409);
      return {
        ...line,
        title: product.translations[locale].title,
        price: product.price,
        currency: product.currency,
      };
    });
    const now = new Date().toISOString();
    const item: Submission = {
      id: randomUUID(),
      kind,
      locale,
      name,
      email,
      topic,
      message,
      lines,
      createdAt: now,
      updatedAt: now,
      status: "new",
      revision: 1,
      key,
      digest,
    };
    state.submissions.unshift(item);
    audit(state, kind, item.id);
    return { reference: item.id };
  });
}
