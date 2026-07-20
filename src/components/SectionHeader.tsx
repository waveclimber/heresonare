import {
  StaggerGroup,
  StaggerItem,
} from "@/components/motion/MotionPrimitives";

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
    <StaggerGroup className="mb-14" stagger="compact">
      <StaggerItem distance="subtle" duration="fast">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--brand-blue)]">
          {label}
        </p>
      </StaggerItem>

      <StaggerItem distance="subtle">
        <h2 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
          {title}
        </h2>
      </StaggerItem>

      {description && (
        <StaggerItem distance="subtle">
          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
            {description}
          </p>
        </StaggerItem>
      )}

      <StaggerItem distance="subtle" duration="fast">
        <div className="mt-8 h-px w-32 bg-gradient-to-r from-[var(--brand-blue)]/60 via-[var(--brand-teal)]/35 to-transparent" />
      </StaggerItem>
    </StaggerGroup>
  );
}
