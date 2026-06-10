export default function About({ content, language }: any) {
  return (
    <section id="about" className="relative overflow-hidden px-6 py-32">
      <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--brand-pink)] opacity-10 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-[var(--brand-blue)]">
            {content[language].aboutTag}
          </p>

          <h2 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
            {content[language].aboutTitle}
          </h2>

          <p className="mt-8 text-lg leading-8 text-gray-400">
            {content[language].aboutText1}
          </p>

          <p className="mt-6 text-lg leading-8 text-gray-400">
            {content[language].aboutText2}
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-md">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-[var(--brand-blue)]/20 p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_36px_rgba(14,108,178,0.45)]">
              <div className="text-sm font-medium text-white/35">01</div>
              <p className="mt-3 text-lg font-semibold text-white">Sound Experience</p>
            </div>

            <div className="rounded-2xl bg-[var(--brand-pink)]/20 p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_36px_rgba(233,43,139,0.45)]">
              <div className="text-sm font-medium text-white/35">02</div>
              <p className="mt-3 text-lg font-semibold text-white">Creative Design</p>
            </div>

            <div className="rounded-2xl bg-[var(--brand-yellow)]/20 p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_36px_rgba(255,207,23,0.45)]">
              <div className="text-sm font-medium text-white/35">03</div>
              <p className="mt-3 text-lg font-semibold text-white">Live Culture</p>
            </div>

            <div className="rounded-2xl bg-[var(--brand-teal)]/20 p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_36px_rgba(76,186,175,0.45)]">
              <div className="text-sm font-medium text-white/35">04</div>
              <p className="mt-3 text-lg font-semibold text-white">Future Technology</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
