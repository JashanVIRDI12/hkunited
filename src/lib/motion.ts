/**
 * Motion foundation.
 *
 * Three rules enforced globally:
 *
 * 1. ONE EASE. `power4.out` everywhere. No bounce, elastic, spin or
 *    overshoot — motion should read as expensive, not playful.
 * 2. ONLY transform, opacity and clip-path are animated, so every
 *    timeline stays on the compositor and holds 60fps.
 * 3. `prefers-reduced-motion` RESOLVES timelines to their final state
 *    rather than disabling them. A disabled reveal strands content at
 *    opacity:0 — invisible, and a worse failure than the motion it
 *    was avoiding.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  gsap.defaults({ ease: "power4.out", duration: 1.1 });
  registered = true;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** The only ease used on this site. */
export const EASE = "power4.out" as const;

/** Durations sit in the 0.8–1.4s band — slow enough to feel deliberate. */
export const DUR = {
  quick: 0.8,
  base: 1.1,
  slow: 1.4,
} as const;

/** Standard scroll-in trigger point. */
export const START = "top 85%" as const;

/**
 * Fade-and-rise reveal. Returns a cleanup function — always call it
 * from the effect teardown.
 */
export function revealOnScroll(
  targets: gsap.DOMTarget,
  options: {
    trigger?: Element | null;
    y?: number;
    stagger?: number;
    start?: string;
    duration?: number;
    delay?: number;
  } = {},
): () => void {
  const {
    trigger,
    y = 32,
    stagger = 0.09,
    start = START,
    duration = DUR.base,
    delay = 0,
  } = options;

  const els = gsap.utils.toArray<HTMLElement>(targets);
  if (!els.length) return () => {};

  if (prefersReducedMotion()) {
    gsap.set(els, { opacity: 1, y: 0, clearProps: "transform" });
    return () => {};
  }

  const tween = gsap.fromTo(
    els,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      stagger,
      ease: EASE,
      scrollTrigger: { trigger: trigger ?? els[0], start, once: true },
    },
  );

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}

/**
 * Refresh ScrollTrigger once fonts settle, so pinned and sticky
 * sections never measure against pre-font layout.
 */
export function refreshWhenReady() {
  if (typeof window === "undefined") return;
  const refresh = () => ScrollTrigger.refresh();
  if (document.fonts?.status === "loaded") refresh();
  else document.fonts?.ready.then(refresh).catch(() => refresh());
}

export { gsap, ScrollTrigger };
