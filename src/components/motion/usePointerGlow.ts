"use client";

import { useMotionValue, useReducedMotion, useSpring } from "motion/react";

import { motionSpring } from "@/lib/motionTokens";

export function usePointerGlow(size: number, maximumOpacity: number) {
  const prefersReducedMotion = useReducedMotion();
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const glowOpacity = useMotionValue(0);
  const springX = useSpring(glowX, motionSpring.pointer);
  const springY = useSpring(glowY, motionSpring.pointer);

  const move = (element: HTMLElement, clientX: number, clientY: number) => {
    const bounds = element.getBoundingClientRect();

    glowX.set(clientX - bounds.left - size / 2);
    glowY.set(clientY - bounds.top - size / 2);
  };

  const showAtPointer = (
    element: HTMLElement,
    clientX: number,
    clientY: number,
    pointerType: string,
  ) => {
    if (prefersReducedMotion || pointerType !== "mouse") return;

    move(element, clientX, clientY);
    glowOpacity.set(maximumOpacity);
  };

  const showAtCenter = (element: HTMLElement) => {
    if (prefersReducedMotion) return;

    const bounds = element.getBoundingClientRect();
    move(
      element,
      bounds.left + bounds.width / 2,
      bounds.top + bounds.height / 2,
    );
    glowOpacity.set(maximumOpacity * 0.9);
  };

  return {
    glowStyle: {
      opacity: glowOpacity,
      x: springX,
      y: springY,
    },
    hide: () => glowOpacity.set(0),
    move,
    prefersReducedMotion,
    showAtCenter,
    showAtPointer,
  };
}
