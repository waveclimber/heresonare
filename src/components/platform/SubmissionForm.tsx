"use client";
import { useRef, useState } from "react";
import { platformContent } from "@/data/platformContent";
import type { Locale } from "@/platform/domain";
import { inquiryEmail } from "@/lib/inquiry.mjs";
import { usePlatformRequest } from "./usePlatformRequest";
export default function SubmissionForm({
  locale,
  kind = "inquiry",
  lines = [],
  enabled,
  onSuccess,
}: {
  locale: Locale;
  kind?: "inquiry" | "order";
  lines?: { id: string; quantity: number }[];
  enabled: boolean;
  onSuccess?: () => void;
}) {
  const c = platformContent[locale];
  const api = usePlatformRequest(c);
  const [reference, setReference] = useState("");
  const previous = useRef({ body: "", key: "" });
  const received = useRef<HTMLDivElement>(null);
  if (!enabled)
    return (
      <div className="p-notice">
        <p>{c.offline}</p>
        <a href={`mailto:${inquiryEmail}`}>
          {c.mail}: {inquiryEmail}
        </a>
      </div>
    );
  if (reference)
    return (
      <div className="p-notice" role="status" ref={received} tabIndex={-1}>
        <p>{c.sent}</p>
        <p>{reference}</p>
        <a
          href={`mailto:${inquiryEmail}?subject=${encodeURIComponent(`héReSonare ${reference}`)}`}
        >
          {c.mail}
        </a>
        {kind === "inquiry" && (
          <p>
            <button
              className="p-button"
              onClick={() => {
                setReference("");
                previous.current = { body: "", key: "" };
              }}
            >
              {c.another}
            </button>
          </p>
        )}
      </div>
    );
  return (
    <form
      method="post"
      className="p-form"
      onSubmit={async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const body = {
          kind,
          locale,
          lines,
          name: data.get("name"),
          email: data.get("email"),
          topic: data.get("topic") ?? "general",
          message: data.get("message"),
          consent: data.get("consent") === "on",
          website: data.get("website"),
        };
        const serial = JSON.stringify(body);
        if (previous.current.body !== serial)
          previous.current = { body: serial, key: crypto.randomUUID() };
        const result = await api.request("/api/platform/submissions", {
          ...body,
          key: previous.current.key,
        });
        if (result?.reference) {
          setReference(result.reference);
          onSuccess?.();
          setTimeout(() => received.current?.focus(), 0);
        }
      }}
    >
      <p>{c.inquiryNote}</p>
      <label className="p-field">
        {c.name}
        <input name="name" required maxLength={80} autoComplete="name" />
      </label>
      <label className="p-field">
        {c.email}
        <input
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
        />
      </label>
      {kind === "inquiry" && (
        <label className="p-field">
          {c.topic}
          <select name="topic">
            {Object.entries(c.topics).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      )}
      <label className="p-field">
        {c.message}
        <textarea
          name="message"
          required={kind === "inquiry"}
          maxLength={3000}
        />
      </label>
      <label className="p-trap" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <p className="p-muted">
        {c.privacy} {c.retained}
      </p>
      <label className="p-check">
        <input name="consent" type="checkbox" required />
        {c.consent}
      </label>
      {api.error && (
        <p role="alert" className="p-notice p-error">
          {api.error}
        </p>
      )}
      <button className="p-button p-primary" disabled={!api.ready || api.busy}>
        {api.busy ? c.working : kind === "order" ? c.checkout : c.send}
      </button>
      <a href={`mailto:${inquiryEmail}`}>
        {c.mail}: {inquiryEmail}
      </a>
    </form>
  );
}
