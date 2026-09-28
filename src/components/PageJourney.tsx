import Link from "next/link";
import type { StaticPageContent } from "@/data/pageContent";
import type { PageJourneyLabels } from "@/data/visitorContent";
import { getLocalizedPath, type Locale } from "@/i18n/config";

export function PageContents({ content, labels }: { content: StaticPageContent; labels: PageJourneyLabels }) {
  const entries = [
    ...(content.slug === "contact" ? [{ id: "inquiry", title: labels.inquiry }] : []),
    ...content.sections.map(({ id, title }) => ({ id: `section-${id}`, title })),
    content.slug === "contact" ? { id: "questions", title: labels.help } : { id: "next-step", title: labels.contactAction },
  ];
  return (
    <nav aria-label={labels.onThisPage} className="mb-10 border-b border-white/10 pb-8">
      <p className="mb-3 text-sm text-gray-400">{labels.onThisPage}</p>
      <ul className="flex flex-wrap gap-3">
        {entries.map(({ id, title }) => <li key={id}><a className="email-copy-button" href={`#${id}`}>{title}</a></li>)}
      </ul>
    </nav>
  );
}

export function PageNextStep({ labels, locale }: { labels: PageJourneyLabels; locale: Locale }) {
  const contact = getLocalizedPath("/contact", locale);
  return (
    <section id="next-step" tabIndex={-1} aria-labelledby="next-step-title" className="page-next-step">
      <h2 id="next-step-title" className="text-3xl font-semibold">{labels.nextStep}</h2>
      <p className="mt-4 max-w-2xl leading-7 text-gray-300">{labels.description}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link className="inquiry-primary" href={`${contact}?topic=${labels.topic}#inquiry`}>{labels.contactAction}</Link>
        <Link className="email-copy-button" href={`${contact}#questions`}>{labels.help}</Link>
      </div>
    </section>
  );
}

