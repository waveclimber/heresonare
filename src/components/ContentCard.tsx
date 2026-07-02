import Link from "next/link";

type ContentCardProps = {
  title: string;
  description: string;
  subtitle?: string;
  status?: string;
  meta?: string;
  href?: string;
};

function isExternalHref(href: string) {
  return href.startsWith("http") || href.startsWith("mailto:");
}

export default function ContentCard({
  title,
  subtitle,
  status,
  description,
  meta,
  href,
}: ContentCardProps) {
  const label = subtitle ?? status;
  const linkClassName =
    "mt-10 inline-flex text-sm uppercase tracking-[0.25em] text-[var(--brand-blue)] transition-all duration-300 hover:translate-x-1";

  return (
    <article className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-[var(--brand-blue)]/60 hover:bg-white/[0.07] hover:shadow-[0_0_45px_rgba(14,108,178,0.14)]">
      {label && (
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--brand-blue)]">
          {label}
        </p>
      )}

      <h3 className="mt-5 text-2xl font-semibold text-white">
        {title}
      </h3>

      <p className="mt-5 leading-8 text-gray-400">{description}</p>

      {meta && (
        <p className="mt-6 text-sm uppercase tracking-[0.2em] text-gray-500">
          {meta}
        </p>
      )}

      {href &&
        (isExternalHref(href) ? (
          <a
            href={href}
            className={linkClassName}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            View
          </a>
        ) : (
          <Link href={href} className={linkClassName}>
            View
          </Link>
        ))}
    </article>
  );
}
