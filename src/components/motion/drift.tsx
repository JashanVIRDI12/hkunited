"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface DriftProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Horizontal travel in px, in each direction, across the trigger's pass
   * through the viewport. Negative starts right and moves left.
   */
  distance?: number;
  /** Element the scroll range is measured against. Defaults to this one. */
  triggerSelector?: string;
}

/**
 * Lateral drift on scroll.
 *
 * What makes stacked display lines read as a COLLISION rather than as a
 * left-aligned stack is that they do not move together: give each line a
 * different distance and sign and the block shears as it passes, opening
 * and closing the counters between lines. Static, the same layout is just
 * an indent pattern.
 *
 * DISTANCE IS IN PIXELS, NOT PERCENT, on purpose. These lines vary from a
 * few hundred to a few thousand pixels wide depending on the word and the
 * viewport; a percentage would make the short lines crawl and throw the
 * long ones across the page. Pixels keep the shear constant, which is the
 * only way the composition holds at every width.
 *
 * Safe against horizontal scrollbars: `body` is `overflow-x: hidden`.
 */
export function Drift({
  children,
  className,
  distance = 40,
  triggerSelector,
}: DriftProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    registerGsap();
    if (prefersReducedMotion()) {
      gsap.set(el, { x: 0 });
      return;
    }

    const trigger = triggerSelector
      ? (el.closest(triggerSelector) as HTMLElement | null) ?? el
      : el;

    const tween = gsap.fromTo(
      el,
      { x: -distance },
      {
        x: distance,
        ease: "none",
        scrollTrigger: {
          trigger,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [distance, triggerSelector]);

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}
