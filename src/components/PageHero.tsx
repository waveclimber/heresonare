type PageHeroProps = {
  tag: string;
  title: string;
  description: string;
};

export default function PageHero({
  tag,
  title,
  description,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-32">
      <div className="absolute left-1/2 top-[-180px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[var(--brand-blue)] opacity-20 blur-3xl" />
      <div className="absolute right-[-120px] top-24 h-[300px] w-[300px] rounded-full bg-[var(--brand-pink)] opacity-10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--brand-blue)]">
          {tag}
        </p>

        <h1 className="mt-6 max-w-5xl text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
          {title}
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-400">
          {description}
        </p>
      </div>
    </section>
  );
}
