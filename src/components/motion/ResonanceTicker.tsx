"use client";

import { useRef } from "react";
import {
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import * as m from "motion/react-m";

import { motionSpring } from "@/lib/motionTokens";

type ResonanceTickerProps = {
  primary: string;
  secondary: string;
};

const repetitions = [0, 1, 2, 3] as const;

export function ResonanceTicker({
  primary,
  secondary,
}: ResonanceTickerProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, motionSpring.scroll);
  const upperX = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const lowerX = useTransform(scrollYProgress, [0, 1], ["-18%", "0%"]);
  const skewX = useTransform(
    smoothVelocity,
    [-1600, 0, 1600],
    [-2.25, 0, 2.25],
  );

  return (
    <section
      ref={sectionRef}
      aria-hidden="true"
      className="resonance-ticker relative overflow-hidden border-y border-white/[0.08] bg-white/[0.015] py-7 sm:py-9"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,108,178,0.11),transparent_68%)]" />

      <m.div
        className="flex w-max items-center gap-8 whitespace-nowrap text-4xl font-bold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl"
        style={
          prefersReducedMotion ? undefined : { skewX, x: upperX }
        }
      >
        {repetitions.map((item) => (
          <span key={item} className="flex items-center gap-8">
            <span>{primary}</span>
            <span className="text-[var(--brand-pink)]">●</span>
          </span>
        ))}
      </m.div>

      <m.div
        className="mt-3 flex w-max items-center gap-8 whitespace-nowrap text-3xl font-bold tracking-[-0.04em] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.26)] sm:text-5xl lg:text-6xl"
        style={
          prefersReducedMotion ? undefined : { skewX, x: lowerX }
        }
      >
        {repetitions.map((item) => (
          <span key={item} className="flex items-center gap-8">
            <span>{secondary}</span>
            <span className="[-webkit-text-stroke:0] text-[var(--brand-teal)]">
              ●
            </span>
          </span>
        ))}
      </m.div>
    </section>
  );
}
