"use client";

import { useEffect, useRef } from "react";
import { revealOnScroll } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger direct children instead of revealing the wrapper as one unit. */
  stagger?: boolean;
  y?: number;
  delay?: number;
  start?: string;
}

/**
 * Scroll reveal wrapper. Elements start at opacity:0 in the DOM, so
 * `revealOnScroll` is responsible for restoring them — including under
 * reduced motion, where it sets the final state synchronously.
 */
export function Reveal({
  children,
  className,
  stagger = false,
  y = 28,
  delay = 0,
  start = "top 82%",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = stagger
      ? (Array.from(el.children) as HTMLElement[])
      : [el];

    return revealOnScroll(targets, {
      trigger: el,
      y,
      delay,
      start,
      stagger: stagger ? 0.08 : 0,
    });
  }, [stagger, y, delay, start]);

  return (
    <div ref={ref} className={cn(stagger ? "" : "opacity-0", className)}>
      {children}
    </div>
  );
}
