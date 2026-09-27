export const inquiryEmail = "contact@heresonare.com";
export const inquiryTopics = /** @type {const} */ ([
  "general", "artists", "partners", "venues", "production",
]);
export const inquiryLimits = { name: 80, email: 254, message: 3000, mailto: 1800 };

/** @typedef {typeof inquiryTopics[number]} InquiryTopic */
/** @typedef {{slug: string, title: string}} InquiryConcept */
/** @typedef {{topic: string, concept: string, name: string, email: string, message: string}} InquiryFields */
/** @typedef {"required" | "tooLong" | "invalidEmail" | "invalidChoice"} InquiryError */
/** @typedef {{topics: Record<InquiryTopic, string>, subjectPrefix: string, name: string, email: string, concept: string, message: string, recipient: string, subject: string}} InquiryDraftLabels */

/** @param {string | null} value @returns {value is InquiryTopic} */
export function isInquiryTopic(value) {
  return inquiryTopics.some((topic) => topic === value);
}

/** @param {string | null} topic @param {string | null} concept @param {InquiryConcept[]} concepts */
export function resolveInquiryContext(topic, concept, concepts) {
  const selected = concepts.find((item) => item.slug === concept);
  return {
    topic: selected ? "production" : isInquiryTopic(topic) ? topic : "general",
    concept: selected?.slug ?? "",
  };
}

/** @param {InquiryFields} fields @param {InquiryConcept[]} concepts */
export function validateInquiry(fields, concepts) {
  /** @type {Partial<Record<keyof InquiryFields, InquiryError>>} */
  const errors = {};
  if (!isInquiryTopic(fields.topic)) errors.topic = "invalidChoice";
  if (fields.topic === "production" && fields.concept && !concepts.some((item) => item.slug === fields.concept)) {
    errors.concept = "invalidChoice";
  }
  for (const field of /** @type {const} */ (["name", "email", "message"])) {
    if (fields[field].length > inquiryLimits[field]) errors[field] = "tooLong";
  }
  if (!fields.message.trim()) errors.message = "required";
  if (fields.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(fields.email.trim())) {
    errors.email = "invalidEmail";
  }
  return errors;
}

/** @param {InquiryFields} fields @param {InquiryDraftLabels} labels @param {InquiryConcept[]} concepts */
export function buildInquiryDraft(fields, labels, concepts) {
  if (Object.keys(validateInquiry(fields, concepts)).length || !isInquiryTopic(fields.topic)) {
    throw new Error("Invalid inquiry fields");
  }
  const concept = fields.topic === "production"
    ? concepts.find((item) => item.slug === fields.concept)
    : undefined;
  const subject = `${labels.subjectPrefix}: ${concept?.title ?? labels.topics[fields.topic]}`;
  const lines = [
    fields.name.trim() ? `${labels.name}: ${fields.name.trim()}` : "",
    fields.email.trim() ? `${labels.email}: ${fields.email.trim()}` : "",
    concept ? `${labels.concept}: ${concept.title}` : "",
  ].filter(Boolean);
  const message = fields.message.trim().replace(/\r\n|\r|\n/gu, "\r\n");
  const body = [...lines, ...(lines.length ? [""] : []), `${labels.message}:`, message].join("\r\n");
  const href = `mailto:${inquiryEmail}?subject=${encodeURIComponent(subject.toWellFormed())}&body=${encodeURIComponent(body.toWellFormed())}`;
  return {
    subject,
    body,
    text: `${labels.recipient}: ${inquiryEmail}\n${labels.subject}: ${subject}\n\n${body}`,
    // Long URLs are handled by copying; never truncate a visitor's message.
    href: href.length <= inquiryLimits.mailto ? href : null,
  };
}

/** @param {ReturnType<typeof buildInquiryDraft>} draft */
export function buildInquiryTextDownload(draft) {
  const text = draft.text.toWellFormed().replace(/\r\n|\r|\n/gu, "\r\n");
  return {
    filename: "heresonare-inquiry.txt",
    // A UTF-8 BOM keeps Chinese/Japanese readable in older desktop text editors.
    href: `data:text/plain;charset=utf-8,${encodeURIComponent(`\uFEFF${text}\r\n`)}`,
  };
}
