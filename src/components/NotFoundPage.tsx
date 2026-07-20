"use client";

import { ResonanceLink } from "@/components/motion/ResonanceLink";
import { useLanguage } from "@/context/LanguageContext";
import { interfaceContent } from "@/data/interfaceContent";

export default function NotFoundPage() {
  const { language, locale } = useLanguage();
  const content = interfaceContent[language].notFound;

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="relative flex min-h-screen items-center overflow-hidden bg-black px-6 pb-24 pt-32 text-white focus:outline-none"
    >
      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--brand-blue)] opacity-15 blur-3xl" />
      <div className="absolute right-[-120px] top-24 h-[320px] w-[320px] rounded-full bg-[var(--brand-pink)] opacity-10 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--brand-teal)]">
          {content.label}
        </p>
        <p
          aria-hidden="true"
          className="mt-6 text-[7rem] font-bold leading-none tracking-[-0.08em] text-white/[0.045] sm:text-[11rem]"
        >
          404
        </p>
        <h1 className="-mt-6 text-4xl font-bold leading-tight sm:-mt-10 sm:text-6xl">
          {content.title}
        </h1>
        <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-gray-400">
          {content.description}
        </p>
        <ResonanceLink
          href={`/${locale}`}
          glow="teal"
          className="mt-10 inline-flex min-h-11 items-center rounded-full border border-[var(--brand-teal)]/60 px-7 py-3 text-white transition-[border-color,box-shadow,transform] hover:-translate-y-1 hover:border-[var(--brand-teal)] hover:shadow-[0_0_28px_rgba(76,186,175,0.2)]"
        >
          {content.backHome}
        </ResonanceLink>
      </div>
    </main>
  );
}
