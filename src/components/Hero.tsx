export default function Hero({ content, language }: any) {
  return (
    <section className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-6 pt-24 text-center lg:min-h-screen">
      <div className="absolute inset-0 bg-[var(--brand-dark)]" />
      <div className="absolute top-[-160px] h-[560px] w-[560px] rounded-full bg-[var(--brand-blue)] opacity-35 blur-3xl" />

      <div className="absolute bottom-10 h-[360px] w-[720px] rounded-full bg-[var(--brand-blue)] opacity-20 blur-3xl" />

      <div className="absolute left-1/4 top-1/3 h-[280px] w-[280px] rounded-full bg-[var(--brand-teal)] opacity-10 blur-3xl" />

      <div className="absolute right-1/4 top-1/3 h-[240px] w-[240px] rounded-full bg-[var(--brand-pink)] opacity-10 blur-3xl" />

      <div className="relative z-10">
        <p className="mb-6 text-xs font-medium tracking-[0.35em] text-[var(--brand-blue)] sm:text-sm">
          Sound • Emotion • Resonance
        </p>

        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl xl:text-8xl">
          {content[language].heroTitle}
        </h1>

        <p className="mt-6 text-lg text-gray-300 sm:text-xl md:text-2xl xl:text-3xl">
          {content[language].heroSubtitle}
        </p>

        <p className="mt-4 text-gray-400">
          {content[language].heroDescription}
        </p>

        <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <button
            onClick={() =>
              document.getElementById("products")?.scrollIntoView({
                behavior: "smooth",
              })
            }
            className="w-52 rounded-full bg-[var(--brand-blue)] px-7 py-2.5 text-white shadow-[0_0_20px_rgba(14,108,178,0.4)] transition-all duration-300 hover:shadow-[0_0_28px_rgba(14,108,178,0.6)]"
          >
            {content[language].explore}
          </button>

          <button
            onClick={() =>
              document.getElementById("contact")?.scrollIntoView({
                behavior: "smooth",
              })
            }
            className="w-52 rounded-full border border-white/20 px-8 py-3 text-gray-300 transition-all duration-300 hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
          >
            {content[language].navContact}
          </button>
        </div>

        <div className="mt-16 flex h-24 items-end justify-center gap-2">
          {[32, 56, 40, 72, 48, 88, 60, 96, 64, 84, 52, 70, 44, 58, 36].map(
            (height, index) => (
              <div
                key={index}
                className="spectrum-bar w-3 rounded-full bg-[var(--brand-blue)] opacity-90 shadow-[0_0_24px_rgba(14,108,178,0.9)]"
                style={{
                  height: `${height}px`,
                  animationDelay: `${index * 0.14}s`,
                  animationDuration: `${3.2 + (index % 5) * 0.2}s`,
                }}
              />
            ),
          )}
        </div>
      </div>
    </section>
  );
}
