export default function Products({ content, language }: any) {
  const featuredItems = [
    {
      title: content[language].featuredArtistsTitle,
      text: content[language].featuredArtistsText,
      href: "/artists",
      number: "01",
    },
    {
      title: content[language].featuredMusicTitle,
      text: content[language].featuredMusicText,
      href: "/music",
      number: "02",
    },
    {
      title: content[language].featuredProductionsTitle,
      text: content[language].featuredProductionsText,
      href: "/productions",
      number: "03",
    },
  ];

  return (
    <section
      id="featured"
      className="relative mx-auto max-w-7xl px-6 py-32"
    >
      <div className="mb-16">
        <p className="text-xs tracking-[0.35em] text-[var(--brand-blue)]">
          FEATURED
        </p>

        <h2 className="mt-5 text-5xl font-bold">
          {content[language].featuredTitle}
        </h2>

        <div className="mt-6 h-px w-32 bg-white/10" />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {featuredItems.map((item) => (
          <a
            key={item.title}
            href={item.href}
            className="group relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.03] p-10 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-[var(--brand-blue)] hover:shadow-[0_0_50px_rgba(14,108,178,0.18)]"
          >
            <div className="absolute right-8 top-8 text-6xl font-bold text-white/5 transition-all duration-500 group-hover:text-white/10">
              {item.number}
            </div>

            <p className="text-xs tracking-[0.35em] text-gray-500">
              CATEGORY
            </p>

            <h3 className="mt-8 text-3xl font-bold">
              {item.title}
            </h3>

            <p className="mt-6 leading-8 text-gray-400">
              {item.text}
            </p>

            <div className="mt-12 flex items-center gap-3 text-sm tracking-[0.25em] text-[var(--brand-blue)]">
              DISCOVER
              <span className="transition-all duration-500 group-hover:translate-x-2">
                →
              </span>
            </div>

            <div className="absolute bottom-0 left-0 h-1 w-0 bg-[var(--brand-blue)] transition-all duration-500 group-hover:w-full" />
          </a>
        ))}
      </div>
    </section>
  );
}