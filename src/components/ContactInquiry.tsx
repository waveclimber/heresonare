import { Suspense } from "react";
import InquiryComposer from "@/components/InquiryComposer";
import { getPageContent } from "@/content/repository";
import { inquiryContent } from "@/data/inquiryContent";
import type { ContentLanguage } from "@/i18n/config";
import { inquiryEmail } from "@/lib/inquiry.mjs";

export default async function ContactInquiry({ language }: { language: ContentLanguage }) {
  const labels = inquiryContent[language];
  const productions = await getPageContent(language, "productions");
  const concepts = productions?.sections.flatMap((section) => section.items ?? [])
    .map(({ slug, title }) => ({ slug, title })) ?? [];

  return (
    <section id="inquiry" tabIndex={-1} aria-labelledby="inquiry-title" className="mb-24 rounded-[32px] border border-[var(--brand-teal)]/25 bg-[var(--brand-teal)]/[0.04] p-6 focus:outline-none sm:p-10">
      <h2 id="inquiry-title" className="text-3xl font-semibold sm:text-4xl">{labels.title}</h2>
      <p className="mt-4 max-w-2xl leading-7 text-gray-300">{labels.description}</p>
      <p className="mt-3 text-sm leading-6 text-gray-400">{labels.fallback}{" "}
        <a href={`mailto:${inquiryEmail}`} className="break-all text-[var(--brand-teal)] underline underline-offset-4">{inquiryEmail}</a>
      </p>
      <Suspense fallback={null}>
        <InquiryComposer labels={labels} concepts={concepts} />
      </Suspense>
    </section>
  );
}
