import { visitorContent } from "@/data/visitorContent";
import type { ContentLanguage } from "@/i18n/config";

export default function VisitorQuestions({ language }: { language: ContentLanguage }) {
  const labels = visitorContent[language];
  return (
    <section id="questions" tabIndex={-1} aria-labelledby="questions-title" className="mt-24 focus:outline-none">
      <h2 id="questions-title" className="mb-8 text-3xl font-semibold">{labels.help}</h2>
      <div className="space-y-3">
        {labels.questions.map(({ id, question, answer }) => (
          <details key={id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <summary className="min-h-11 cursor-pointer rounded-xl py-2 font-medium leading-7">{question}</summary>
            <p className="mt-4 max-w-3xl leading-7 text-gray-300">{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
