"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { InquiryLabels } from "@/data/inquiryContent";
import {
  buildInquiryDraft,
  buildInquiryTextDownload,
  inquiryLimits,
  inquiryTopics,
  isInquiryTopic,
  resolveInquiryContext,
  validateInquiry,
  type InquiryConcept,
  type InquiryFields,
} from "@/lib/inquiry.mjs";

type InquiryComposerProps = {
  labels: InquiryLabels;
  concepts: InquiryConcept[];
};

export default function InquiryComposer(props: InquiryComposerProps) {
  const params = useSearchParams();
  const initial = resolveInquiryContext(params.get("topic"), params.get("concept"), props.concepts);
  return <InquiryForm key={`${props.labels.subjectPrefix}:${initial.topic}:${initial.concept}`} {...props} initial={initial} />;
}

function InquiryForm({ labels, concepts, initial }: InquiryComposerProps & {
  initial: ReturnType<typeof resolveInquiryContext>;
}) {
  const [fields, setFields] = useState<InquiryFields>({ ...initial, name: "", email: "", message: "" });
  const [errors, setErrors] = useState<ReturnType<typeof validateInquiry>>({});
  const [draft, setDraft] = useState<ReturnType<typeof buildInquiryDraft> | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copying" | "copied" | "failed">("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const revision = useRef(0);
  const previewHeading = useRef<HTMLHeadingElement>(null);
  const previewText = useRef<HTMLTextAreaElement>(null);
  const download = draft ? buildInquiryTextDownload(draft) : null;
  const hasChanges = fields.topic !== initial.topic || fields.concept !== initial.concept || Boolean(fields.name || fields.email || fields.message);
  const canReset = hasChanges || Boolean(draft) || Object.keys(errors).length > 0;

  useEffect(() => () => { revision.current += 1; }, []);
  useEffect(() => {
    if (draft) previewHeading.current?.focus();
  }, [draft]);

  function invalidateDraft() {
    revision.current += 1;
    setDraft(null);
    setCopyStatus("idle");
    setErrors({});
  }

  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const nextErrors = validateInquiry(fields, concepts);
    setErrors(nextErrors);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      const input = form.elements.namedItem(firstError);
      if (input instanceof HTMLElement) input.focus();
      return;
    }
    revision.current += 1;
    setCopyStatus("idle");
    setDraft(buildInquiryDraft(fields, labels, concepts));
  }

  function updateField(field: keyof InquiryFields, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
    invalidateDraft();
  }

  function resetForm() {
    if (hasChanges && !window.confirm(labels.resetConfirm)) return;
    setFields({ ...initial, name: "", email: "", message: "" });
    invalidateDraft();
    const firstField = formRef.current?.elements.namedItem("topic");
    if (firstField instanceof HTMLElement) firstField.focus();
  }

  async function copyDraft() {
    if (!draft) return;
    const currentRevision = revision.current;
    setCopyStatus("copying");
    try {
      await navigator.clipboard.writeText(draft.text);
      if (revision.current === currentRevision) setCopyStatus("copied");
    } catch {
      if (revision.current !== currentRevision) return;
      setCopyStatus("failed");
      previewText.current?.focus();
      previewText.current?.select();
    }
  }

  function errorText(field: keyof InquiryFields) {
    const error = errors[field];
    return error ? <p id={`inquiry-${field}-error`} className="mt-2 text-sm text-rose-300">{labels.errors[error]}</p> : null;
  }

  return (
    <div className="mt-8 grid min-w-0 gap-8 lg:grid-cols-2 lg:gap-12">
      <form ref={formRef} noValidate onSubmit={prepare} aria-label={labels.title} className="min-w-0 space-y-6">
        <div>
          <label className="inquiry-label" htmlFor="inquiry-topic">{labels.topic}</label>
          <select id="inquiry-topic" name="topic" value={fields.topic} onChange={(event) => {
            if (isInquiryTopic(event.target.value)) updateField("topic", event.target.value);
          }} className="inquiry-field">
            {inquiryTopics.map((value) => <option key={value} value={value}>{labels.topics[value]}</option>)}
          </select>
        </div>
        {fields.topic === "production" && (
          <div>
            <label className="inquiry-label" htmlFor="inquiry-concept">{labels.concept} <span className="text-gray-400">({labels.optional})</span></label>
            <select id="inquiry-concept" name="concept" value={fields.concept} onChange={(event) => updateField("concept", event.target.value)} className="inquiry-field" aria-invalid={Boolean(errors.concept)} aria-describedby={errors.concept ? "inquiry-concept-error" : undefined}>
              <option value="">{labels.anyConcept}</option>
              {concepts.map((concept) => <option key={concept.slug} value={concept.slug}>{concept.title}</option>)}
            </select>
            {errorText("concept")}
          </div>
        )}
        {(["name", "email"] as const).map((field) => (
          <div key={field}>
            <label className="inquiry-label" htmlFor={`inquiry-${field}`}>{labels[field]} <span className="text-gray-400">({labels.optional})</span></label>
            <p id={`inquiry-${field}-hint`} className="mb-3 text-xs text-gray-400">{labels.limitHint.replace("{limit}", String(inquiryLimits[field]))}</p>
            <input id={`inquiry-${field}`} name={field} value={fields[field]} onChange={(event) => updateField(field, event.target.value)} type={field === "email" ? "email" : "text"} autoComplete={field === "email" ? "email" : "name"} maxLength={inquiryLimits[field]} className="inquiry-field" aria-invalid={Boolean(errors[field])} aria-describedby={`inquiry-${field}-hint${errors[field] ? ` inquiry-${field}-error` : ""}`} />
            {errorText(field)}
          </div>
        ))}
        <div>
          <label className="inquiry-label" htmlFor="inquiry-message">{labels.message} <span className="text-[var(--brand-teal)]">({labels.required})</span></label>
          <p id="inquiry-message-hint" className="mb-3 text-sm leading-6 text-gray-400">{labels.messageHint}</p>
          <textarea ref={messageRef} id="inquiry-message" name="message" value={fields.message} required maxLength={inquiryLimits.message} rows={7} className="inquiry-field resize-y" onChange={(event) => updateField("message", event.target.value)} aria-invalid={Boolean(errors.message)} aria-describedby={`inquiry-message-hint${errors.message ? " inquiry-message-error" : ""}`} />
          <p aria-hidden="true" className="mt-2 text-right text-xs tabular-nums text-gray-400">{fields.message.length} / {inquiryLimits.message}</p>
          {errorText("message")}
        </div>
        <p className="text-sm leading-6 text-gray-400">{labels.privacy}</p>
        <div className="flex flex-wrap gap-3">
          <button type="submit" className="inquiry-primary">{labels.prepare}</button>
          <button type="button" disabled={!canReset} onClick={resetForm} className="email-copy-button">{labels.reset}</button>
        </div>
      </form>

      <aside aria-labelledby="inquiry-preview-title" className="min-w-0 self-start rounded-3xl border border-white/10 bg-black/30 p-6 sm:p-8 lg:sticky lg:top-28">
        <h3 id="inquiry-preview-title" tabIndex={-1} ref={previewHeading} className="text-xl font-semibold focus:outline-none">{labels.previewTitle}</h3>
        <p className="mt-3 text-sm leading-6 text-gray-400">{draft ? labels.previewHint : labels.previewEmpty}</p>
        {draft && (
          <>
            <div className="mt-6 flex flex-wrap gap-3">
              {draft.href && <a href={draft.href} className="inquiry-primary">{labels.openEmail}</a>}
              <button type="button" disabled={copyStatus === "copying"} onClick={copyDraft} className="email-copy-button">
                {copyStatus === "copying" ? labels.copying : copyStatus === "copied" ? labels.copied : labels.copy}
              </button>
              {download && <a href={download.href} download={download.filename} className="email-copy-button">{labels.download}</a>}
              <button type="button" onClick={() => messageRef.current?.focus()} className="email-copy-button">{labels.edit}</button>
            </div>
            {!draft.href && <p className="mt-4 text-sm leading-6 text-[var(--brand-teal)]">{labels.longMessage}</p>}
            <p role="status" aria-atomic="true" className={copyStatus === "failed" ? "mt-4 text-sm leading-6 text-rose-300" : "sr-only"}>
              {copyStatus === "copied" ? labels.copied : copyStatus === "failed" ? labels.copyFailed : ""}
            </p>
            <textarea readOnly ref={previewText} value={draft.text} rows={14} aria-label={labels.previewTitle} className="inquiry-field mt-6 resize-y text-sm leading-6" />
          </>
        )}
      </aside>
    </div>
  );
}
