import Link from "next/link";

type ComingSoonBlockProps = {
  title: string;
  description: string;
  cta?: {
    label: string;
    href: string;
  };
};

function isExternalHref(href: string) {
  return href.startsWith("http") || href.startsWith("mailto:");
}

export default function ComingSoonBlock({
  title,
  description,
  cta,
}: ComingSoonBlockProps) {
  const ctaClassName =
    "mt-10 inline-flex rounded-full bg-[var(--brand-blue)] px-8 py-3 text-white shadow-[0_0_25px_rgba(14,108,178,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_32px_rgba(14,108,178,0.55)]";

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] px-8 py-14 text-center backdrop-blur-md">
      <div className="absolute left-1/2 top-[-120px] h-[260px] w-[260px] -translate-x-1/2 rounded-full bg-[var(--brand-teal)] opacity-15 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-2xl">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--brand-blue)]">
          Coming Soon
        </p>

        <h2 className="mt-5 text-4xl font-bold text-white">{title}</h2>

        <p className="mt-6 leading-8 text-gray-400">{description}</p>

        {cta &&
          (isExternalHref(cta.href) ? (
            <a
              href={cta.href}
              className={ctaClassName}
              target={cta.href.startsWith("http") ? "_blank" : undefined}
              rel={
                cta.href.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
            >
              {cta.label}
            </a>
          ) : (
            <Link href={cta.href} className={ctaClassName}>
              {cta.label}
            </Link>
          ))}
      </div>
    </section>
  );
}
