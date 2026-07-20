"use client";

import Link from "next/link";
import type { FocusEvent, PointerEvent, ReactNode } from "react";
import * as m from "motion/react-m";

import { usePointerGlow } from "@/components/motion/usePointerGlow";

type ResonanceLinkProps = {
  children: ReactNode;
  className?: string;
  external?: boolean;
  glow?: "blue" | "pink" | "teal";
  href: string;
  rel?: string;
  target?: string;
};

const glowClassNames = {
  blue:
    "bg-[radial-gradient(circle,rgba(255,255,255,0.92)_0%,rgba(14,108,178,0.62)_30%,rgba(14,108,178,0)_72%)]",
  pink:
    "bg-[radial-gradient(circle,rgba(255,255,255,0.9)_0%,rgba(233,43,139,0.6)_30%,rgba(233,43,139,0)_72%)]",
  teal:
    "bg-[radial-gradient(circle,rgba(255,255,255,0.9)_0%,rgba(76,186,175,0.58)_30%,rgba(76,186,175,0)_72%)]",
} as const;

function isInternalHref(href: string) {
  return href.startsWith("/") && !href.startsWith("//");
}

export function ResonanceLink({
  children,
  className,
  external = false,
  glow = "blue",
  href,
  rel,
  target,
}: ResonanceLinkProps) {
  const pointerGlow = usePointerGlow(112, 0.9);
  const sharedClassName = `group relative isolate overflow-hidden ${className ?? ""}`;
  const handleBlur = () => pointerGlow.hide();
  const handleFocus = (event: FocusEvent<HTMLAnchorElement>) =>
    pointerGlow.showAtCenter(event.currentTarget);
  const handlePointerEnter = (event: PointerEvent<HTMLAnchorElement>) =>
    pointerGlow.showAtPointer(
      event.currentTarget,
      event.clientX,
      event.clientY,
      event.pointerType,
    );
  const handlePointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (
      !pointerGlow.prefersReducedMotion &&
      event.pointerType === "mouse"
    ) {
      pointerGlow.move(event.currentTarget, event.clientX, event.clientY);
    }
  };
  const content = (
    <>
      <m.span
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 top-0 h-28 w-28 rounded-full blur-md mix-blend-screen ${glowClassNames[glow]}`}
        style={pointerGlow.glowStyle}
      />
      <span className="relative z-10">{children}</span>
    </>
  );
  const interactionProps = {
    onBlur: handleBlur,
    onFocus: handleFocus,
    onPointerEnter: handlePointerEnter,
    onPointerLeave: pointerGlow.hide,
    onPointerMove: handlePointerMove,
  };

  return isInternalHref(href) && !external ? (
    <Link href={href} className={sharedClassName} {...interactionProps}>
      {content}
    </Link>
  ) : (
    <a
      href={href}
      className={sharedClassName}
      rel={rel}
      target={target}
      {...interactionProps}
    >
      {content}
    </a>
  );
}
