export default function Contact({ content, language }: any) {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-32">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-12 text-center backdrop-blur-md">
        <p className="text-sm uppercase tracking-[0.35em] text-[var(--brand-blue)]">
          {content[language].contactTag}
        </p>

        <h2 className="mt-6 text-5xl font-bold">
          {content[language].contactTitle}
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-gray-400">
          {content[language].contactText}
        </p>

        <a
          href="mailto:contact@heresonare.com"
          className="mt-10 inline-flex rounded-full border border-[var(--brand-blue)] px-8 py-3 transition-all duration-300 hover:bg-[var(--brand-blue)]"
        >
          contact@heresonare.com
        </a>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:-translate-y-2 hover:border-[var(--brand-blue)] hover:bg-white/10 hover:shadow-[0_0_30px_rgba(14,108,178,0.25)]">
            <h3 className="font-semibold">Business</h3>

            <p className="mt-3 text-sm text-gray-400">Coming Soon</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:-translate-y-2 hover:border-[var(--brand-blue)] hover:bg-white/10 hover:shadow-[0_0_30px_rgba(14,108,178,0.25)]">
            <h3 className="font-semibold">Community</h3>

            <p className="mt-3 text-sm text-gray-400">Coming Soon</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:-translate-y-2 hover:border-[var(--brand-blue)] hover:bg-white/10 hover:shadow-[0_0_30px_rgba(14,108,178,0.25)]">
            <h3 className="font-semibold">Social Platforms</h3>

            <div className="mt-4">
              <a
                href="https://xhslink.com/m/2DWzE9YLlI2"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full border border-[var(--brand-blue)] px-4 py-2 text-sm transition-all duration-300 hover:bg-[var(--brand-blue)]/20"
              >
                小红书
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
