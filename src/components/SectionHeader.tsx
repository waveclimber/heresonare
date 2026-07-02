type SectionHeaderProps = {
  label: string;
  title: string;
  description?: string;
};

export default function SectionHeader({
  label,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="mb-14">
      <p className="text-xs uppercase tracking-[0.35em] text-[var(--brand-blue)]">
        {label}
      </p>

      <h2 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
          {description}
        </p>
      )}

      <div className="mt-8 h-px w-32 bg-white/10" />
    </div>
  );
}
