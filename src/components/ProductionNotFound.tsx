"use client";

import Link from "next/link";

import { useLanguage } from "@/context/LanguageContext";
import { interfaceContent } from "@/data/interfaceContent";
import { getLocalizedPath } from "@/i18n/config";

export default function ProductionNotFound() {
  const { language, locale } = useLanguage();
  const labels = interfaceContent[language].productionDetail;

  return (
    <main className="flex min-h-[70vh] items-center bg-black px-6 pb-24 pt-32 text-white">
      <div className="mx-auto w-full max-w-3xl rounded-[32px] border border-white/10 bg-white/[0.04] p-8 text-center sm:p-12">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--brand-blue)]">
          404
        </p>
        <h1 className="mt-5 text-4xl font-bold sm:text-5xl">
          {labels.notFoundTitle}
        </h1>
        <p className="mx-auto mt-5 max-w-xl leading-8 text-gray-400">
          {labels.notFoundDescription}
        </p>
        <Link
          href={getLocalizedPath("/productions", locale)}
          className="mt-8 inline-flex min-h-11 items-center rounded-full border border-[var(--brand-blue)]/60 px-5 py-2 text-sm font-medium text-[var(--brand-blue)] transition-colors hover:border-[var(--brand-blue)] hover:bg-[var(--brand-blue)] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-yellow)]"
        >
          {labels.backToProductions}
        </Link>
      </div>
    </main>
  );
}
