export default function Hero({ content, language }: any) {
  const spectrumBars = [
    32, 56, 40, 72, 48, 88, 60, 96, 64, 84, 52, 70, 44, 58, 36,
  ];

  return (
    <section className="relative overflow-hidden bg-[var(--brand-dark)] px-6 pb-24 pt-32">
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.25)_1px,transparent_1px)] [background-size:80px_80px]" />

      <div className="absolute left-1/2 top-[-160px] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[var(--brand-blue)] opacity-30 blur-3xl" />
      <div className="absolute left-1/4 top-1/3 h-[260px] w-[260px] rounded-full bg-[var(--brand-teal)] opacity-10 blur-3xl" />
      <div className="absolute right-1/4 top-1/3 h-[260px] w-[260px] rounded-full bg-[var(--brand-pink)] opacity-10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-xs font-medium tracking-[0.35em] text-[var(--brand-blue)]">
              Music • Emotion • Resonance
            </p>

            <p className="mt-5 text-xs tracking-[0.4em] text-gray-500">
              ENTERTAINMENT • LABEL • PRODUCTION
            </p>

            <h1 className="mt-10 text-5xl font-bold tracking-tight sm:text-6xl xl:text-[6rem]">
              {content[language].heroTitle}
            </h1>

            <h2 className="mt-8 text-3xl font-semibold text-white">
              {content[language].heroSubtitle}
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-400">
              {content[language].heroDescription}
            </p>

            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() =>
                  document.getElementById("featured")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="rounded-full bg-[var(--brand-blue)] px-10 py-4 text-white shadow-[0_0_25px_rgba(14,108,178,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_32px_rgba(14,108,178,0.6)]"
              >
                {content[language].discover}
              </button>

              <button
                onClick={() =>
                  document.getElementById("contact")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="rounded-full border border-white/20 px-10 py-4 text-gray-300 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
              >
                {content[language].contactButton}
              </button>
            </div>
          </div>

          <div>
            <div className="mx-auto max-w-lg rounded-[36px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md shadow-[0_0_50px_rgba(14,108,178,0.12)]">
              <p className="text-xs tracking-[0.35em] text-gray-500">
                LATEST RELEASE
              </p>

              <h3 className="mt-4 text-4xl font-bold text-white">
                Coming Soon
              </h3>

              <p className="mt-3 text-sm tracking-[0.25em] text-[var(--brand-blue)]">
                SINGLE · 2026
              </p>

              <p className="mt-4 text-gray-400">
                New sound experiences are on the way.
              </p>

              <div className="mt-10 flex h-40 items-end justify-center gap-2">
                {spectrumBars.map((height, index) => (
                  <div
                    key={index}
                    className="spectrum-bar w-4 rounded-full bg-[var(--brand-blue)] shadow-[0_0_24px_rgba(14,108,178,0.9)]"
                    style={{
                      height: `${height}px`,
                      animationDelay: `${index * 0.14}s`,
                      animationDuration: `${3.2 + (index % 5) * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}