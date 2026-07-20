"use client";

import { useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import * as m from "motion/react-m";

import {
  createRevealVariants,
  createStaggerGroupVariants,
  type MotionDistance,
  type MotionDuration,
  type MotionStagger,
  type RevealOrigin,
} from "@/lib/motionTokens";

const semanticMotionElements = {
  article: m.article,
  aside: m.aside,
  div: m.div,
  footer: m.footer,
  h1: m.h1,
  h2: m.h2,
  h3: m.h3,
  header: m.header,
  li: m.li,
  main: m.main,
  nav: m.nav,
  ol: m.ol,
  p: m.p,
  section: m.section,
  span: m.span,
  ul: m.ul,
} as const;

export type MotionSemanticElement = keyof typeof semanticMotionElements;

type MotionPrimitiveProps = {
  as?: MotionSemanticElement;
  children: ReactNode;
  className?: string;
};

type RevealProps = MotionPrimitiveProps & {
  amount?: "some" | "all" | number;
  distance?: MotionDistance;
  duration?: MotionDuration;
  from?: RevealOrigin;
  once?: boolean;
};

type StaggerGroupProps = MotionPrimitiveProps & {
  amount?: "some" | "all" | number;
  once?: boolean;
  stagger?: MotionStagger;
};

type StaggerItemProps = MotionPrimitiveProps & {
  distance?: MotionDistance;
  duration?: MotionDuration;
  from?: RevealOrigin;
};

const subscribeToHydration = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function useHasHydrated() {
  return useSyncExternalStore(
    subscribeToHydration,
    getClientSnapshot,
    getServerSnapshot,
  );
}

export function Reveal({
  amount = "some",
  as = "div",
  children,
  className,
  distance = "standard",
  duration = "standard",
  from = "bottom",
  once = true,
}: RevealProps) {
  const hasHydrated = useHasHydrated();
  const Component = semanticMotionElements[as];

  return (
    <Component
      animate={hasHydrated ? "hidden" : "visible"}
      className={className}
      initial={false}
      variants={createRevealVariants({ distance, duration, origin: from })}
      viewport={{ amount, once }}
      whileInView="visible"
    >
      {children}
    </Component>
  );
}

export function StaggerGroup({
  amount = "some",
  as = "div",
  children,
  className,
  once = true,
  stagger = "standard",
}: StaggerGroupProps) {
  const hasHydrated = useHasHydrated();
  const Component = semanticMotionElements[as];

  return (
    <Component
      animate={hasHydrated ? "hidden" : "visible"}
      className={className}
      initial={false}
      variants={createStaggerGroupVariants(stagger)}
      viewport={{ amount, once }}
      whileInView="visible"
    >
      {children}
    </Component>
  );
}

export function StaggerItem({
  as = "div",
  children,
  className,
  distance = "standard",
  duration = "standard",
  from = "bottom",
}: StaggerItemProps) {
  const Component = semanticMotionElements[as];

  return (
    <Component
      className={className}
      variants={createRevealVariants({ distance, duration, origin: from })}
    >
      {children}
    </Component>
  );
}
