import type { Language, SiteContent } from "@/data/siteContent";

type ContentProps = {
  content: SiteContent;
  language: Language;
};

export default function Contact({ content, language }: ContentProps) {
  const contactItems = [
    {
      number: "01",
      title: "Artists",
      text: "Artist management, collaboration and creative opportunities.",
      color: "bg-[var(--brand-blue)]",
      border: "hover:border-[var(--brand-blue)]/50",
    },
    {
      number: "02",
      title: "Partners",
      text: "Business partnerships, brand collaborations and production projects.",
      color: "bg-[var(--brand-pink)]",
      border: "hover:border-[var(--brand-pink)]/50",
    },
    {
      number: "03",
      title: "Venues",
      text: "Live events, venues, performances and future stage experiences.",
      color: "bg-[var(--brand-teal)]",
      border: "hover:border-[var(--brand-teal)]/50",
    },
  ];

  return (
    <section id="contact" className="relative overflow-hidden px-6 py-32">
      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--brand-blue)] opacity-10 blur-3xl" />
      <div className="absolute left-[-160px] bottom-0 h-[420px] w-[420px] rounded-full bg-[var(--brand-pink)] opacity-10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--brand-blue)]">
              {content[language].contactTag}
            </p>

            <h2 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              {content[language].contactTitle}
            </h2>

            <div className="mt-8 h-px w-32 bg-white/10" />

            <p className="mt-8 max-w-xl text-lg leading-8 text-gray-400">
              {content[language].contactText}
            </p>

            <div className="mt-10">
              <a
                href="mailto:contact@heresonare.com"
                className="inline-flex rounded-full bg-[var(--brand-blue)] px-8 py-3 text-white shadow-[0_0_25px_rgba(14,108,178,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_32px_rgba(14,108,178,0.55)]"
              >
                contact@heresonare.com
              </a>
            </div>
          </div>

          <div className="grid gap-6">
            {contactItems.map((item) => (
              <div
                key={item.number}
                className={`group relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.07] hover:shadow-[0_0_45px_rgba(14,108,178,0.14)] ${item.border}`}
              >
                <div className="absolute right-8 top-8 text-6xl font-bold text-white/5 transition-all duration-500 group-hover:text-white/10">
                  {item.number}
                </div>

                <div className={`mb-8 h-1 w-16 rounded-full ${item.color}`} />

                <p className="text-xs tracking-[0.3em] text-gray-500">
                  CONTACT TYPE
                </p>

                <h3 className="mt-5 text-2xl font-semibold text-white">
                  {item.title}
                </h3>

                <p className="mt-5 max-w-2xl leading-8 text-gray-400">
                  {item.text}
                </p>
              </div>
            ))}

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="https://xhslink.com/m/2DWzE9YLlI2"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/10 px-5 py-2 text-sm text-gray-300 transition-all duration-300 hover:border-[var(--brand-pink)] hover:text-[var(--brand-pink)]"
              >
                小红书
              </a>

              <span className="rounded-full border border-white/10 px-5 py-2 text-sm text-gray-500">
                Instagram Coming Soon
              </span>

              <span className="rounded-full border border-white/10 px-5 py-2 text-sm text-gray-500">
                X Coming Soon
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
