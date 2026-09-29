"use client";
import { useRef } from "react";
import { editorialContent } from "@/data/editorialContent";
import type { Locale } from "@/platform/domain";
import RichText from "./RichText";
export default function BodyEditor({
  value,
  onChange,
  locale,
  label,
}: {
  value: string;
  onChange(value: string): void;
  locale: Locale;
  label: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null),
    c = editorialContent[locale];
  function insert(before: string, after = "") {
    const field = ref.current;
    if (!field) return;
    const start = field.selectionStart,
      end = field.selectionEnd;
    const next =
      value.slice(0, start) +
      before +
      value.slice(start, end) +
      after +
      value.slice(end);
    if (next.length > 12000) return;
    onChange(next);
    setTimeout(() => {
      field.focus();
      field.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  }
  return (
    <div className="p-stack">
      <div className="p-row" role="group" aria-label={c.preview}>
        <button
          type="button"
          className="p-button"
          onClick={() => insert("**", "**")}
        >
          {c.bold}
        </button>
        <button
          type="button"
          className="p-button"
          onClick={() => insert("\n## ")}
        >
          {c.heading}
        </button>
        <button
          type="button"
          className="p-button"
          onClick={() => insert("\n- ")}
        >
          {c.list}
        </button>
      </div>
      <label className="p-field">
        {label}
        <textarea
          ref={ref}
          value={value}
          maxLength={12000}
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
      <p className="p-muted">{c.formatHelp}</p>
      <details>
        <summary className="p-button">{c.preview}</summary>
        <RichText text={value} />
      </details>
    </div>
  );
}
