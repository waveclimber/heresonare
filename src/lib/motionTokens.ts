import type { Transition, Variants } from "motion/react";

export const motionDuration = {
  immediate: 0,
  fast: 0.18,
  standard: 0.36,
  slow: 0.56,
} as const;

export const motionEasing = {
  standard: [0.22, 1, 0.36, 1],
  enter: [0.16, 1, 0.3, 1],
  exit: [0.4, 0, 1, 1],
} as const satisfies Record<
  string,
  readonly [number, number, number, number]
>;

export const motionStagger = {
  compact: 0.06,
  standard: 0.1,
  relaxed: 0.16,
} as const;

export const motionDistance = {
  none: 0,
  subtle: 12,
  standard: 24,
  prominent: 40,
} as const;

export const motionOpacity = {
  hidden: 0,
  softened: 0.48,
  visible: 1,
} as const;

export type MotionDistance = keyof typeof motionDistance;
export type MotionDuration = keyof typeof motionDuration;
export type MotionStagger = keyof typeof motionStagger;
export type RevealOrigin = "none" | "top" | "right" | "bottom" | "left";

const revealTransition = {
  duration: motionDuration.standard,
  ease: motionEasing.enter,
} satisfies Transition;

const hiddenTransition = {
  duration: motionDuration.immediate,
} satisfies Transition;

function getRevealOffset(
  origin: RevealOrigin,
  distance: MotionDistance,
) {
  const pixels = motionDistance[distance];

  switch (origin) {
    case "top":
      return { y: -pixels };
    case "right":
      return { x: pixels };
    case "bottom":
      return { y: pixels };
    case "left":
      return { x: -pixels };
    case "none":
      return {};
  }
}

export function createRevealVariants({
  distance = "standard",
  duration = "standard",
  origin = "bottom",
}: {
  distance?: MotionDistance;
  duration?: MotionDuration;
  origin?: RevealOrigin;
} = {}): Variants {
  const offset = getRevealOffset(origin, distance);

  return {
    hidden: {
      opacity: motionOpacity.hidden,
      ...offset,
      transition: hiddenTransition,
    },
    visible: {
      opacity: motionOpacity.visible,
      ...(origin === "none" ? {} : { x: 0, y: 0 }),
      transition: {
        ...revealTransition,
        duration: motionDuration[duration],
      },
    },
  };
}

export function createStaggerGroupVariants(
  stagger: MotionStagger = "standard",
): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: motionStagger[stagger],
      },
    },
  };
}
