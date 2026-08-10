"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap, prefersReducedMotion, EASE, DUR, START } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface ClipRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Wipe direction. */
  from?: "bottom" | "top" | "left" | "right";
  delay?: number;
  duration?: number;
  /** Counter-scale the inner content so the image settles as it uncovers. */
  scale?: boolean;
}

const INSET: Record<NonNullable<ClipRevealProps["from"]>, string> = {
  bottom: "inset(100% 0% 0% 0%)",
  top: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

/**
 * The signature image entrance: a clip-path wipe with the content
 * settling from a slight over-scale underneath it.
 *
 * `clip-path` and `transform` are both compositor properties, so this
 * costs no layout or paint. The scale lives on an inner element so the
 * clip rectangle itself stays still — animating both on one node makes
 * the mask edge drift.
 */
export function ClipReveal({
  children,
  className,
  from = "bottom",
  delay = 0,
  duration = DUR.slow,
  scale = true,
}: ClipRevealProps) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = outer.current;
    const content = inner.current;
    if (!el || !content) return;

    registerGsap();

    if (prefersReducedMotion()) {
      gsap.set(el, { clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(content, { scale: 1 });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: START, once: true },
      delay,
    });

    tl.fromTo(
      el,
      { clipPath: INSET[from] },
      { clipPath: "inset(0% 0% 0% 0%)", duration, ease: EASE },
    );

    if (scale) {
      tl.fromTo(
        content,
        { scale: 1.06 },
        { scale: 1, duration: duration + 0.2, ease: EASE },
        0,
      );
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [from, delay, duration, scale]);

  return (
    <div
      ref={outer}
      className={cn("overflow-hidden", className)}
      // Painted state before JS runs; GSAP overrides on mount.
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <div ref={inner} className="h-full w-full will-change-transform">
        {children}
      </div>
    </div>
  );
}
