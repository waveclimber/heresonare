"use client";
import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import type { Entry, Locale } from "@/platform/domain";
import { money, recordPath } from "@/platform/domain";
import { platformContent } from "@/data/platformContent";
import SubmissionForm from "./SubmissionForm";

type Line = { id: string; quantity: number };
type BasketProduct = Pick<Entry, "id" | "slug" | "module" | "price" | "currency" | "available"> & { title: string };
const key = "heresonare-basket-v1";
let memory = "[]";
let storageFailed = false;
function snapshot() {
  if (storageFailed) return memory;
  try {
    return window.sessionStorage.getItem(key) ?? memory;
  } catch {
    return memory;
  }
}
function subscribe(listener: () => void) {
  window.addEventListener("heresonare-basket", listener);
  return () => window.removeEventListener("heresonare-basket", listener);
}
function parse(raw: string): Line[] {
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data)
      ? data
          .filter(
            (item) =>
              item &&
              typeof item.id === "string" &&
              /^[a-f0-9-]{36}$/u.test(item.id) &&
              Number.isInteger(item.quantity) &&
              item.quantity >= 1 &&
              item.quantity <= 10,
          )
          .slice(0, 20)
      : [];
  } catch {
    return [];
  }
}
function update(lines: Line[]) {
  memory = JSON.stringify(lines);
  try {
    window.sessionStorage.setItem(key, memory);
  } catch {
    storageFailed = true;
    /* The in-memory basket remains usable when browser storage is disabled. */
  }
  window.dispatchEvent(new Event("heresonare-basket"));
}
export function BasketButton({
  entry,
  locale,
}: {
  entry: Pick<Entry, "id" | "available">;
  locale: Locale;
}) {
  const [notice, setNotice] = useState("");
  const c = platformContent[locale];
  if (!entry.available) return <p>{c.unavailable}</p>;
  return (
    <div className="p-row">
      <button
        className="p-button p-primary"
        onClick={() => {
          const lines = parse(snapshot());
          const existing = lines.find((line) => line.id === entry.id);
          if (existing && existing.quantity < 10) existing.quantity++;
          else if (existing) { setNotice(c.basketLimit); return; }
          else if (lines.length < 20) lines.push({ id: entry.id, quantity: 1 });
          else {
            setNotice(c.basketLimit);
            return;
          }
          update(lines);
          setNotice(c.added);
        }}
      >
        {c.add}
      </button>
      <Link className="p-button" href={`/${locale}/bag`} prefetch={false}>
        {c.bag}
      </Link>
      <span role="status">{notice}</span>
    </div>
  );
}
export default function Basket({
  entries,
  locale,
  enabled,
}: {
  entries: BasketProduct[];
  locale: Locale;
  enabled: boolean;
}) {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "[]");
  const lines = parse(raw);
  const c = platformContent[locale];
  const [submitted, setSubmitted] = useState(false);
  const missing = lines.some(
    (line) => !entries.some((entry) => entry.id === line.id && entry.available),
  );
  const totals: Record<string, number> = {};
  for (const line of lines) {
    const entry = entries.find((entry) => entry.id === line.id);
    if (entry)
      totals[entry.currency] =
        (totals[entry.currency] ?? 0) + entry.price * line.quantity;
  }
  return (
    <>
      <p className="p-notice">{c.orderNote}</p>
      <a href={`/${locale}/catalog/store`}>{c.back}</a>
      {!lines.length && !submitted && <p>{c.bagEmpty}</p>}
      <div className="p-stack">
        {lines.map((line) => {
          const entry = entries.find((entry) => entry.id === line.id);
          return (
            <article className="p-card" key={line.id}>
              <h2>
                {entry ? (
                  <a href={recordPath(entry, locale)}>
                    {entry.title}
                  </a>
                ) : (
                  c.unavailable
                )}
              </h2>
              {entry && <p>{money(entry.price, entry.currency, locale)}</p>}
              <div className="p-row">
                <label className="p-field">
                  {c.quantity}
                  <select
                    value={line.quantity}
                    onChange={(event) =>
                      update(
                        lines.map((item) =>
                          item.id === line.id
                            ? { ...item, quantity: Number(event.target.value) }
                            : item,
                        ),
                      )
                    }
                  >
                    {Array.from({ length: 10 }, (_, index) => (
                      <option key={index + 1}>{index + 1}</option>
                    ))}
                  </select>
                </label>
                <button
                  className="p-button"
                  onClick={() =>
                    update(lines.filter((item) => item.id !== line.id))
                  }
                >
                  {c.remove}
                </button>
              </div>
            </article>
          );
        })}
      </div>
      {Object.entries(totals).map(([currency, total]) => (
        <p key={currency}>
          {c.total}: {money(total, currency, locale)}
        </p>
      ))}
      {missing && (
        <p role="alert" className="p-notice p-error">
          {c.removedProduct}
        </p>
      )}
      {(lines.length > 0 || submitted) && !missing && (
        <SubmissionForm
          locale={locale}
          kind="order"
          lines={lines}
          enabled={enabled}
          onSuccess={() => {
            setSubmitted(true);
            update([]);
          }}
        />
      )}
    </>
  );
}
