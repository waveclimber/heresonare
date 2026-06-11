export default function About({ content, language }: any) {
  return (
    <section id="about" className="relative overflow-hidden px-6 py-32">
      <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--brand-pink)] opacity-10 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-[var(--brand-blue)]">
            {content[language].aboutTag}
          </p>

          <h2 className="mt-4 text-5xl font-bold leading-tight md:text-6xl">
            {content[language].aboutTitle}
          </h2>

          <p className="mt-8 max-w-xl text-lg leading-8 text-gray-400">
            {content[language].aboutText1}
          </p>

          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-400">
            {content[language].aboutText2}
          </p>
        </div>

        <div className="grid gap-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-[var(--brand-blue)]/40 hover:bg-white/[0.07]">
          <div className="mb-6 h-1 w-14 rounded-full bg-[var(--brand-blue)]"></div>
            <div className="text-sm font-medium text-white/35">01</div>

            <h3 className="mt-4 text-2xl font-semibold text-white">
              {content[language].aboutStoryTitle}
            </h3>

            <p className="mt-5 leading-8 text-gray-400">
              {content[language].aboutStoryText}
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-[var(--brand-blue)]/40 hover:bg-white/[0.07]">
          <div className="mb-6 h-1 w-14 rounded-full bg-[var(--brand-pink)]"></div>
            <div className="text-sm font-medium text-white/35">02</div>

            <h3 className="mt-4 text-2xl font-semibold text-white">
              {content[language].aboutMissionTitle}
            </h3>

            <p className="mt-5 leading-8 text-gray-400">
              {content[language].aboutMissionText}
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-[var(--brand-blue)]/40 hover:bg-white/[0.07]">
          <div className="mb-6 h-1 w-14 rounded-full bg-[var(--brand-yellow)]"></div>
            <div className="text-sm font-medium text-white/35">03</div>

            <h3 className="mt-4 text-2xl font-semibold text-white">
              {content[language].aboutVisionTitle}
            </h3>

            <p className="mt-5 leading-8 text-gray-400">
              {content[language].aboutVisionText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}