"use client";

import type { FocusEvent, PointerEvent, ReactNode } from "react";
import * as m from "motion/react-m";

import { usePointerGlow } from "@/components/motion/usePointerGlow";
import { motionSpring } from "@/lib/motionTokens";

type ResonanceSurfaceProps = {
  as?: "article" | "div";
  ariaLabelledby?: string;
  children: ReactNode;
  className?: string;
  glow?: "blue" | "pink" | "teal" | "yellow";
  interactive?: boolean;
};

const glowClassNames = {
  blue:
    "bg-[radial-gradient(circle,rgba(14,108,178,0.4)_0%,rgba(14,108,178,0.16)_38%,rgba(14,108,178,0)_72%)]",
  pink:
    "bg-[radial-gradient(circle,rgba(233,43,139,0.36)_0%,rgba(233,43,139,0.14)_38%,rgba(233,43,139,0)_72%)]",
  teal:
    "bg-[radial-gradient(circle,rgba(76,186,175,0.36)_0%,rgba(76,186,175,0.14)_38%,rgba(76,186,175,0)_72%)]",
  yellow:
    "bg-[radial-gradient(circle,rgba(255,207,23,0.3)_0%,rgba(255,207,23,0.1)_38%,rgba(255,207,23,0)_72%)]",
} as const;

export function ResonanceSurface({
  as = "div",
  ariaLabelledby,
  children,
  className,
  glow = "blue",
  interactive = false,
}: ResonanceSurfaceProps) {
  const pointerGlow = usePointerGlow(288, interactive ? 0.78 : 0.48);
  const Component = as === "article" ? m.article : m.div;
  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      pointerGlow.hide();
    }
  };
  const handleFocus = (event: FocusEvent<HTMLElement>) =>
    pointerGlow.showAtCenter(event.currentTarget);
  const handlePointerEnter = (event: PointerEvent<HTMLElement>) =>
    pointerGlow.showAtPointer(
      event.currentTarget,
      event.clientX,
      event.clientY,
      event.pointerType,
    );
  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (
      !pointerGlow.prefersReducedMotion &&
      event.pointerType === "mouse"
    ) {
      pointerGlow.move(event.currentTarget, event.clientX, event.clientY);
    }
  };

  return (
    <Component
      aria-labelledby={ariaLabelledby}
      className={`group relative isolate overflow-hidden ${className ?? ""}`}
      initial={false}
      tabIndex={interactive ? -1 : undefined}
      onBlurCapture={handleBlur}
      onFocusCapture={handleFocus}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={pointerGlow.hide}
      onPointerMove={handlePointerMove}
      transition={motionSpring.surface}
      whileHover={
        interactive && !pointerGlow.prefersReducedMotion
          ? { scale: 1.008, y: -6 }
          : undefined
      }
      whileTap={
        interactive && !pointerGlow.prefersReducedMotion
          ? { scale: 0.995 }
          : undefined
      }
    >
      <m.span
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 top-0 z-0 h-72 w-72 rounded-full blur-2xl mix-blend-screen ${glowClassNames[glow]}`}
        style={pointerGlow.glowStyle}
      />
      <div className="relative z-10 h-full">{children}</div>
    </Component>
  );
}
