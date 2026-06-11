export default function Contact({ content, language }: any) {
  return (
    <section id="contact" className="relative overflow-hidden px-6 py-32">
      <div className="absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--brand-blue)] opacity-10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[var(--brand-blue)]">
            {content[language].contactTag}
          </p>

          <h2 className="mt-6 text-5xl font-bold leading-tight md:text-6xl">
            {content[language].contactTitle}
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400">
            {content[language].contactText}
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="flex min-h-[300px] flex-col rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-[var(--brand-blue)]/40 hover:bg-white/[0.07]">
            <div className="mb-6 h-1 w-14 rounded-full bg-[var(--brand-blue)]" />

            <p className="text-sm font-medium text-white/35">01</p>

            <h3 className="mt-4 text-2xl font-semibold text-white">Email</h3>

            <p className="mt-4 text-gray-400">Business & Partnership</p>

            <div className="mt-auto pt-8">
              <a
                href="mailto:contact@heresonare.com"
                className="inline-flex rounded-full border border-[var(--brand-blue)] px-5 py-2 text-sm transition-all duration-300 hover:bg-[var(--brand-blue)]/20"
              >
                contact@heresonare.com
              </a>
            </div>
          </div>

          <div className="flex min-h-[300px] flex-col rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-[var(--brand-pink)]/40 hover:bg-white/[0.07]">
            <div className="mb-6 h-1 w-14 rounded-full bg-[var(--brand-pink)]" />

            <p className="text-sm font-medium text-white/35">02</p>

            <h3 className="mt-4 text-2xl font-semibold text-white">Social</h3>

            <p className="mt-4 text-gray-400">Follow our latest updates.</p>

            <div className="mt-auto flex flex-wrap gap-3 pt-8">
              <a
                href="https://xhslink.com/m/2DWzE9YLlI2"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[var(--brand-pink)] px-5 py-2 text-sm transition-all duration-300 hover:bg-[var(--brand-pink)]/20"
              >
                小红书
              </a>

              <span className="rounded-full border border-white/10 px-5 py-2 text-sm text-gray-500">
                Instagram
              </span>

              <span className="rounded-full border border-white/10 px-5 py-2 text-sm text-gray-500">
                X
              </span>
            </div>
          </div>

          <div className="flex min-h-[300px] flex-col rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-[var(--brand-yellow)]/40 hover:bg-white/[0.07]">
            <div className="mb-6 h-1 w-14 rounded-full bg-[var(--brand-yellow)]" />

            <p className="text-sm font-medium text-white/35">03</p>

            <h3 className="mt-4 text-2xl font-semibold text-white">Inquiry</h3>

            <p className="mt-4 text-gray-400">
              Start a conversation with us.
            </p>

            <div className="mt-auto pt-8">
              <a
                href="mailto:contact@heresonare.com"
                className="inline-flex rounded-full border border-[var(--brand-yellow)] px-5 py-2 text-sm transition-all duration-300 hover:bg-[var(--brand-yellow)]/20"
              >
                Send Message →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}