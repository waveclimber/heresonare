"use client";

import type { RuntimeErrorContent } from "@/data/interfaceContent";

type RuntimeErrorPageProps = {
  content: RuntimeErrorContent;
  homeHref: string;
  onRetry: () => void;
};

export function RuntimeErrorPage({
  content,
  homeHref,
  onRetry,
}: RuntimeErrorPageProps) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      aria-labelledby="runtime-error-title"
      className="relative flex min-h-screen items-center overflow-hidden bg-black px-6 pb-24 pt-32 text-white focus:outline-none"
    >
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--brand-blue)] opacity-15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute right-[-8rem] top-24 h-80 w-80 rounded-full bg-[var(--brand-pink)] opacity-10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-[-10rem] left-[-6rem] h-80 w-80 rounded-full bg-[var(--brand-teal)] opacity-10 blur-3xl"
      />

      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--brand-teal)]">
          {content.label}
        </p>
        <div
          aria-hidden="true"
          className="relative mx-auto mt-10 h-24 w-24"
        >
          <span className="absolute inset-0 rounded-full border border-[var(--brand-teal)]/20" />
          <span className="absolute inset-4 rounded-full border border-[var(--brand-blue)]/30" />
          <span className="absolute inset-9 rounded-full bg-white shadow-[0_0_28px_rgba(255,255,255,0.55)]" />
        </div>
        <h1
          id="runtime-error-title"
          className="mt-9 text-4xl font-bold leading-tight sm:text-6xl"
        >
          {content.title}
        </h1>
        <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-gray-400">
          {content.description}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={onRetry}
            className="resonance-control inline-flex min-h-11 min-w-36 items-center justify-center rounded-full border border-[var(--brand-teal)]/60 bg-transparent px-7 py-3 text-white transition-[border-color,box-shadow,transform] hover:-translate-y-1 hover:border-[var(--brand-teal)] hover:shadow-[0_0_28px_rgba(76,186,175,0.2)]"
          >
            {content.retry}
          </button>
          <a
            href={homeHref}
            className="resonance-control inline-flex min-h-11 min-w-36 items-center justify-center rounded-full border border-white/25 px-7 py-3 text-white transition-[border-color,box-shadow,transform] hover:-translate-y-1 hover:border-white/60 hover:shadow-[0_0_28px_rgba(255,255,255,0.12)]"
          >
            {content.backHome}
          </a>
        </div>
      </div>
    </main>
  );
}
