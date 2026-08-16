"use client";

import { useEffect, useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  registerGsap,
  prefersReducedMotion,
  inViewport,
  hasEntered,
  markEntered,
  EASE,
  START,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * A checklist whose marks are DRAWN as the list is reached.
 *
 * The one piece of motion on this site that is an argument rather than a
 * flourish. A safety programme's claim is that things are verified rather
 * than asserted — re-proven, not assumed — and a tick that arrives already
 * printed is exactly the wrong image for that. Drawing it, one after the
 * next, is the page saying the checking happens.
 *
 * IT USES DrawSVG NOW, AND THE COMMENT THIS REPLACES WAS OUT OF DATE. The
 * previous build hand-rolled the effect — measure the path with
 * `getTotalLength()`, set `strokeDasharray` to that length, tween
 * `strokeDashoffset` to zero — on the stated grounds that "DrawSVG is a paid
 * plugin". That has not been true since GSAP 3.13: every plugin is free,
 * including for commercial use, and all of them ship in the public `gsap`
 * package. The workaround was costing a runtime measurement per mark and a
 * paragraph of explanation to do what `drawSVG: "0% 100%"` says outright.
 *
 * IT DEGRADES TO PRINTED TICKS, WHICH IS THE POINT, and that survived the
 * swap. `immediateRender: false` keeps the plugin off the DOM entirely until
 * its trigger actually fires, so without JavaScript — or before hydration, or
 * if the trigger never fires — every mark is simply drawn in full. Compare
 * the site's other motion, which parks content and relies on GSAP to release
 * it; that pattern has already shipped an invisible headline here twice. A
 * checklist that fails to nothing would be worse than one that never
 * animated.
 *
 * Under `prefers-reduced-motion` the marks are set complete and no trigger
 * is created.
 */

interface ChecklistProps {
  items: readonly string[];
  /** `dark` is for ink surfaces, where the mark and the label invert. */
  tone?: "light" | "dark";
  className?: string;
}

/** The mark itself, in a 16×16 box. A tick, drawn in one stroke. */
const MARK = "M2.5 8.5 L6.5 12.5 L13.5 3.5";

export function Checklist({ items, tone = "light", className }: ChecklistProps) {
  const root = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    registerGsap();

    const marks = Array.from(el.querySelectorAll<SVGPathElement>("[data-mark]"));
    if (!marks.length) return;

    if (prefersReducedMotion() || hasEntered(el)) return;

    const tween = gsap.fromTo(
      marks,
      { drawSVG: "0% 0%" },
      {
        drawSVG: "0% 100%",
        duration: 0.45,
        stagger: 0.09,
        ease: EASE.out,
        onStart: () => markEntered(el),
        // The load-bearing line: nothing is written to the marks until the
        // trigger fires, so an un-run effect leaves them fully drawn.
        immediateRender: false,
        scrollTrigger: { trigger: el, start: START, once: true },
      },
    );

    /*
     * The marks sit inside cards that can arrive already past the trigger
     * point on a deep link or a back-navigation restore. `once: true` fires
     * correctly in that case only if the trigger has been measured against
     * the real layout, which is what this forces.
     *
     * BUT IT IS A GLOBAL REFRESH, and this component renders four times on
     * /safety. Four unconditional recalculations of every ScrollTrigger on the
     * page — one per card — is both wasteful and, if one lands while a pinned
     * or scrubbed section is mid-flight, visible as a jump. It is taken only
     * while this list is still off screen: once it is in view the measurement
     * a refresh would correct is already the one in use, and the correction
     * costs more than the error. Same rule as the pinned track.
     */
    if (!inViewport(el)) ScrollTrigger.refresh();

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <ul ref={root} className={cn("grid gap-x-8 gap-y-3.5 sm:grid-cols-2", className)}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <svg
            viewBox="0 0 16 16"
            className={cn(
              "mt-0.5 size-4 shrink-0",
              tone === "dark" ? "text-white" : "text-brand",
            )}
            fill="none"
            aria-hidden="true"
          >
            <path
              data-mark
              d={MARK}
              stroke="currentColor"
              strokeWidth={2.25}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            className={cn(
              "text-[0.9375rem] leading-relaxed",
              tone === "dark" ? "text-white/80" : "text-ink",
            )}
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}
