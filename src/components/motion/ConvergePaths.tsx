"use client";

import { useId, useRef, type CSSProperties, type ReactNode } from "react";
import {
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import * as m from "motion/react-m";

import { motionSpring } from "@/lib/motionTokens";

type PathStyle = {
  opacity: number | MotionValue<number>;
  pathLength: number | MotionValue<number>;
};

function useConvergeProgress(
  offsetEnd: "end 0.32" | "end 0.4" | "end 0.72" = "end 0.32",
) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.88", offsetEnd],
  });
  const progress = useSpring(scrollYProgress, motionSpring.scroll);

  return { progress, ref };
}

function usePathStyle(
  progress: MotionValue<number>,
  start: number,
  end: number,
  reducedOpacity: number,
): PathStyle {
  const prefersReducedMotion = useReducedMotion();
  const pathLength = useTransform(progress, [start, end], [0, 1]);
  const opacity = useTransform(
    progress,
    [start, Math.min(start + 0.1, end), end],
    [0, reducedOpacity + 0.2, reducedOpacity],
  );

  return prefersReducedMotion
    ? { opacity: reducedOpacity, pathLength: 1 }
    : { opacity, pathLength };
}

function useGradientId(prefix: string) {
  return `${prefix}-${useId().replaceAll(":", "")}`;
}

export function StoryConvergePath({ className }: { className?: string }) {
  const { progress, ref } = useConvergeProgress();
  const gradientId = useGradientId("story-converge");
  const trunkStyle = usePathStyle(progress, 0, 0.72, 0.34);
  const firstBranchStyle = usePathStyle(progress, 0.08, 0.32, 0.5);
  const secondBranchStyle = usePathStyle(progress, 0.3, 0.58, 0.5);
  const thirdBranchStyle = usePathStyle(progress, 0.55, 0.88, 0.5);

  return (
    <div ref={ref} aria-hidden="true" className={className}>
      <svg
        className="h-full w-full overflow-visible"
        viewBox="0 0 80 600"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--brand-blue)" />
            <stop offset="0.5" stopColor="var(--brand-pink)" />
            <stop offset="1" stopColor="var(--brand-teal)" />
          </linearGradient>
        </defs>
        <m.path
          d="M10 0 C6 130 14 215 10 300 C6 390 14 475 10 600"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeLinecap="round"
          strokeWidth="1.5"
          style={trunkStyle}
          vectorEffect="non-scaling-stroke"
        />
        <m.path
          d="M10 100 C28 100 45 100 78 100"
          fill="none"
          stroke="var(--brand-blue)"
          strokeLinecap="round"
          strokeWidth="1.5"
          style={firstBranchStyle}
          vectorEffect="non-scaling-stroke"
        />
        <m.path
          d="M10 300 C28 300 45 300 78 300"
          fill="none"
          stroke="var(--brand-pink)"
          strokeLinecap="round"
          strokeWidth="1.5"
          style={secondBranchStyle}
          vectorEffect="non-scaling-stroke"
        />
        <m.path
          d="M10 500 C28 500 45 500 78 500"
          fill="none"
          stroke="var(--brand-teal)"
          strokeLinecap="round"
          strokeWidth="1.5"
          style={thirdBranchStyle}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

export function ContactConvergePath({ className }: { className?: string }) {
  const { progress, ref } = useConvergeProgress("end 0.4");
  const gradientId = useGradientId("contact-converge");
  const blueStyle = usePathStyle(progress, 0.04, 0.62, 0.3);
  const pinkStyle = usePathStyle(progress, 0.16, 0.72, 0.3);
  const tealStyle = usePathStyle(progress, 0.28, 0.82, 0.3);
  const targetOpacity = useTransform(progress, [0.55, 0.82], [0, 0.58]);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div ref={ref} aria-hidden="true" className={className}>
      <svg
        className="h-full w-full overflow-visible"
        viewBox="0 0 1200 760"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="1" y1="0" x2="0" y2="0.5">
            <stop offset="0" stopColor="var(--brand-teal)" />
            <stop offset="0.5" stopColor="var(--brand-blue)" />
            <stop offset="1" stopColor="var(--brand-pink)" />
          </linearGradient>
        </defs>
        <m.path
          d="M572 126 C500 126 455 338 225 426"
          fill="none"
          stroke="var(--brand-blue)"
          strokeLinecap="round"
          strokeWidth="1.3"
          style={blueStyle}
          vectorEffect="non-scaling-stroke"
        />
        <m.path
          d="M572 354 C490 354 430 404 225 426"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeLinecap="round"
          strokeWidth="1.3"
          style={pinkStyle}
          vectorEffect="non-scaling-stroke"
        />
        <m.path
          d="M572 582 C485 582 420 468 225 426"
          fill="none"
          stroke="var(--brand-teal)"
          strokeLinecap="round"
          strokeWidth="1.3"
          style={tealStyle}
          vectorEffect="non-scaling-stroke"
        />
        <m.circle
          cx="225"
          cy="426"
          fill="var(--brand-blue)"
          r="3"
          style={{ opacity: prefersReducedMotion ? 0.42 : targetOpacity }}
        />
      </svg>
    </div>
  );
}

export function FooterConvergePath({ className }: { className?: string }) {
  const { progress, ref } = useConvergeProgress("end 0.72");
  const gradientId = useGradientId("footer-converge");
  const leftStyle = usePathStyle(progress, 0, 0.48, 0.22);
  const centerStyle = usePathStyle(progress, 0.08, 0.54, 0.25);
  const rightStyle = usePathStyle(progress, 0.16, 0.62, 0.22);
  const exitStyle = usePathStyle(progress, 0.5, 0.92, 0.24);

  return (
    <div ref={ref} aria-hidden="true" className={className}>
      <svg
        className="h-full w-full"
        viewBox="0 0 1200 620"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--brand-pink)" />
            <stop offset="0.5" stopColor="white" />
            <stop offset="1" stopColor="var(--brand-blue)" />
          </linearGradient>
        </defs>
        <m.path
          d="M0 0 C245 28 400 88 600 116"
          fill="none"
          stroke="var(--brand-pink)"
          strokeLinecap="round"
          strokeWidth="1.1"
          style={leftStyle}
          vectorEffect="non-scaling-stroke"
        />
        <m.path
          d="M600 0 C600 36 600 72 600 116"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeLinecap="round"
          strokeWidth="1.1"
          style={centerStyle}
          vectorEffect="non-scaling-stroke"
        />
        <m.path
          d="M1200 0 C955 28 800 88 600 116"
          fill="none"
          stroke="var(--brand-blue)"
          strokeLinecap="round"
          strokeWidth="1.1"
          style={rightStyle}
          vectorEffect="non-scaling-stroke"
        />
        <m.path
          d="M600 116 C600 245 600 350 600 488"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeDasharray="2 10"
          strokeLinecap="round"
          strokeWidth="1"
          style={exitStyle}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

const targetColorClassNames = {
  blue: "border-[var(--brand-blue)] shadow-[0_0_28px_rgba(14,108,178,0.24)]",
  mixed:
    "border-[var(--brand-pink)] shadow-[0_0_30px_rgba(14,108,178,0.2)]",
} as const;

export function ConvergeTarget({
  children,
  className,
  color = "blue",
}: {
  children: ReactNode;
  className?: string;
  color?: keyof typeof targetColorClassNames;
}) {
  return (
    <div
      className={`converge-target relative isolate w-fit ${className ?? ""}`}
      style={{ "--converge-delay": "0.9s" } as CSSProperties}
    >
      <span
        aria-hidden="true"
        className={`converge-target-ring absolute inset-[-10px] -z-10 rounded-full border opacity-30 ${targetColorClassNames[color]}`}
      />
      <span
        aria-hidden="true"
        className={`converge-target-ring absolute inset-[-20px] -z-10 rounded-full border opacity-15 ${targetColorClassNames[color]}`}
        style={{ "--converge-delay": "2.1s" } as CSSProperties}
      />
      {children}
    </div>
  );
}
