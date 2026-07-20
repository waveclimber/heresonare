"use client";

import Image from "next/image";
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

import type { MediaSignalVariant } from "@/lib/mediaSignal";
import { motionDuration, motionEasing } from "@/lib/motionTokens";

type MediaSignalFrameProps = {
  alt: string;
  priority?: boolean;
  sizes: string;
  src?: string;
  variant: MediaSignalVariant;
};

const signalLayouts = {
  audio: {
    code: "01",
    background:
      "bg-[radial-gradient(circle_at_20%_24%,rgba(14,108,178,0.34),transparent_34%),radial-gradient(circle_at_82%_78%,rgba(76,186,175,0.2),transparent_38%),#080d12]",
    primary: "var(--brand-blue)",
    secondary: "var(--brand-teal)",
    paths: [
      "M-40 232 C72 116 158 322 278 202 C378 102 470 252 680 92",
      "M-30 278 C110 168 190 350 322 230 C430 132 520 242 690 148",
      "M-20 326 C130 238 228 382 366 274 C482 184 574 254 700 222",
    ],
    bars: [34, 58, 44, 76, 52, 88, 64, 96, 72, 54, 82, 46],
  },
  platform: {
    code: "02",
    background:
      "bg-[radial-gradient(circle_at_24%_18%,rgba(233,43,139,0.28),transparent_34%),radial-gradient(circle_at_78%_78%,rgba(14,108,178,0.26),transparent_40%),#100a10]",
    primary: "var(--brand-pink)",
    secondary: "var(--brand-blue)",
    paths: [
      "M-24 116 H154 C202 116 202 188 252 188 H420 C470 188 470 108 526 108 H672",
      "M-24 208 H108 C160 208 160 286 218 286 H382 C444 286 444 226 502 226 H672",
      "M-24 310 H170 C216 310 216 246 270 246 H442 C492 246 492 326 552 326 H672",
    ],
    bars: [66, 42, 84, 58, 92, 48, 74, 96, 52, 80, 62, 88],
  },
  live: {
    code: "03",
    background:
      "bg-[radial-gradient(circle_at_22%_24%,rgba(76,186,175,0.3),transparent_34%),radial-gradient(circle_at_80%_76%,rgba(255,207,23,0.14),transparent_38%),#07110f]",
    primary: "var(--brand-teal)",
    secondary: "var(--brand-yellow)",
    paths: [
      "M-40 244 C84 244 98 88 214 88 C338 88 342 298 462 298 C564 298 584 172 690 172",
      "M-40 292 C76 292 112 154 214 154 C324 154 360 346 470 346 C566 346 602 222 690 222",
      "M-40 344 C80 344 126 226 226 226 C332 226 378 386 488 386 C580 386 620 286 690 286",
    ],
    bars: [52, 78, 44, 88, 62, 96, 68, 84, 48, 74, 58, 90],
  },
} as const;

export function MediaSignalFrame({
  alt,
  priority = false,
  sizes,
  src,
  variant,
}: MediaSignalFrameProps) {
  const prefersReducedMotion = useReducedMotion();
  const layout = signalLayouts[variant];
  const revealInitial = prefersReducedMotion
    ? false
    : { clipPath: "inset(0 0 100% 0)", opacity: 0.35 };

  return (
    <div
      className={`absolute inset-0 isolate overflow-hidden ${layout.background}`}
      style={
        {
          "--signal-primary": layout.primary,
          "--signal-secondary": layout.secondary,
        } as React.CSSProperties
      }
    >
      {src ? (
        <m.div
          className="absolute inset-0"
          initial={revealInitial}
          transition={{
            duration: motionDuration.slow,
            ease: motionEasing.enter,
          }}
          viewport={{ amount: 0.28, once: true }}
          whileInView={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035] group-focus-within:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
        </m.div>
      ) : (
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.28)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.28)_1px,transparent_1px)] [background-size:48px_48px]" />
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 640 400"
            preserveAspectRatio="none"
          >
            {layout.paths.map((path, index) => (
              <m.path
                key={path}
                d={path}
                fill="none"
                initial={
                  prefersReducedMotion
                    ? false
                    : { opacity: 0, pathLength: 0 }
                }
                stroke={
                  index === 1
                    ? "var(--signal-secondary)"
                    : "var(--signal-primary)"
                }
                strokeLinecap="round"
                strokeWidth={index === 1 ? 1.6 : 1}
                transition={{
                  delay: prefersReducedMotion ? 0 : index * 0.1,
                  duration: motionDuration.slow + index * 0.12,
                  ease: motionEasing.enter,
                }}
                vectorEffect="non-scaling-stroke"
                viewport={{ amount: 0.25, once: true }}
                whileInView={{ opacity: index === 1 ? 0.74 : 0.34, pathLength: 1 }}
              />
            ))}
          </svg>

          <div className="absolute bottom-6 right-6 flex h-16 items-end gap-1.5 sm:bottom-8 sm:right-8">
            {layout.bars.map((height, index) => (
              <span
                key={`${height}-${index}`}
                className="media-signal-bar block w-1 rounded-full bg-[var(--signal-primary)] opacity-50 shadow-[0_0_10px_currentColor] sm:w-1.5"
                style={
                  {
                    "--signal-height": `${height}%`,
                    height: `${height}%`,
                    transitionDelay: `${index * 24}ms`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        </div>
      )}

      <div
        aria-hidden="true"
        className="media-signal-scan absolute -inset-y-1 left-0 w-1/4 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-xl"
      />

      <div
        aria-hidden="true"
        className="absolute left-6 top-6 flex items-center gap-3 text-[10px] tracking-[0.32em] text-white/42 sm:left-8 sm:top-8"
      >
        <span className="h-px w-10 bg-[var(--signal-primary)] shadow-[0_0_10px_var(--signal-primary)]" />
        <span>SIGNAL / {layout.code}</span>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-6 left-6 text-6xl font-semibold tracking-[-0.08em] text-white/[0.035] sm:bottom-8 sm:left-8 sm:text-7xl"
      >
        {layout.code}
      </div>
    </div>
  );
}
