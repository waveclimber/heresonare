"use client";

import type { HTMLMotionProps } from "motion/react";
import * as m from "motion/react-m";

import { usePointerGlow } from "@/components/motion/usePointerGlow";
import { motionSpring } from "@/lib/motionTokens";

type ResonanceButtonProps = Omit<
  HTMLMotionProps<"button">,
  "children" | "onPointerEnter" | "onPointerLeave" | "onPointerMove"
> & {
  children: React.ReactNode;
  glow?: "blue" | "teal";
};

const glowClassNames = {
  blue:
    "bg-[radial-gradient(circle,rgba(255,255,255,0.92)_0%,rgba(76,186,175,0.62)_26%,rgba(14,108,178,0)_72%)]",
  teal:
    "bg-[radial-gradient(circle,rgba(255,255,255,0.88)_0%,rgba(76,186,175,0.58)_28%,rgba(76,186,175,0)_72%)]",
} as const;

export function ResonanceButton({
  children,
  className,
  glow = "blue",
  onBlur,
  onFocus,
  ...buttonProps
}: ResonanceButtonProps) {
  const pointerGlow = usePointerGlow(112, 0.9);

  return (
    <m.button
      {...buttonProps}
      className={`group relative isolate overflow-hidden ${className ?? ""}`}
      initial={false}
      onBlur={(event) => {
        pointerGlow.hide();
        onBlur?.(event);
      }}
      onFocus={(event) => {
        pointerGlow.showAtCenter(event.currentTarget);
        onFocus?.(event);
      }}
      onPointerEnter={(event) => {
        pointerGlow.showAtPointer(
          event.currentTarget,
          event.clientX,
          event.clientY,
          event.pointerType,
        );
      }}
      onPointerLeave={pointerGlow.hide}
      onPointerMove={(event) => {
        if (
          !pointerGlow.prefersReducedMotion &&
          event.pointerType === "mouse"
        ) {
          pointerGlow.move(event.currentTarget, event.clientX, event.clientY);
        }
      }}
      transition={motionSpring.pointer}
      whileHover={
        pointerGlow.prefersReducedMotion ? undefined : { y: -4 }
      }
      whileTap={
        pointerGlow.prefersReducedMotion ? undefined : { scale: 0.98 }
      }
    >
      <m.span
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 top-0 h-28 w-28 rounded-full blur-md mix-blend-screen ${glowClassNames[glow]}`}
        style={pointerGlow.glowStyle}
      />
      <span className="relative z-10">{children}</span>
    </m.button>
  );
}
