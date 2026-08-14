"use client";

import { useEffect, useRef } from "react";
import {
  gsap,
  registerGsap,
  motionMedia,
  prefersReducedMotion,
  EASE,
  DUR,
  START,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

interface ClipRevealProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Wipe direction — the edge the image grows FROM. `left` is the house
   * default and the one to reach for unless there is a reason not to.
   */
  from?: "left" | "right" | "bottom" | "top";
  delay?: number;
  duration?: number;
  /** Settle the image from a slight over-scale as the wipe uncovers it. */
  scale?: boolean;
  /**
   * Scroll parallax, as a percentage of the frame's height travelled in EACH
   * direction. 0 disables it. 6–8 reads as depth; past ~12 the plate visibly
   * outruns the copy beside it and reads as a glitch.
   *
   * REQUIRES the frame to have its own height — pass `ratio`, or size the
   * frame through `className`. The plate is absolutely positioned when
   * parallax is on, so it cannot inherit height from the content.
   */
  parallax?: number;
  /** CSS aspect-ratio for the frame. */
  ratio?: string;
}

/**
 * THE SIGNATURE IMAGE ENTRANCE.
 *
 * Three things happen at once on three separate nodes, and the separation is
 * the reason it works:
 *
 *     clip-path   the frame uncovers the image, edge to edge
 *     scale       the image settles from 1.08 to 1 underneath the wipe
 *     yPercent    the image drifts against the scroll for the whole pass
 *
 * ONE NODE PER CONCERN, NEVER FEWER. Put the wipe and the scale on the same
 * element and the mask edge drifts with the scale — the clip rectangle is
 * defined against the element's own box, so scaling the element scales the
 * mask. Put the settle and the parallax together and the entrance tween and
 * the scrubbed tween fight over one `transform`, with the scrub winning
 * whenever the reader moves during the reveal. Three nodes, three transforms,
 * no interaction.
 *
 * WHY LEFT-TO-RIGHT IS THE DEFAULT. A bottom wipe competes with the page's
 * own direction of travel: everything is already rising as you scroll, so an
 * image that also rises reads as one more thing scrolling rather than as a
 * frame opening. A lateral wipe cuts across the scroll and reads as a
 * deliberate cut — which is the editorial register this site is after, and
 * the reason it lands as film rather than as a web page.
 *
 * THE OVERSCALE UNDER PARALLAX IS NOT DECORATIVE. Translating a plate by
 * ±A% of its frame exposes a strip of empty frame at whichever edge it pulls
 * away from unless the plate already overhangs by A% on each side — so it is
 * scaled to `1 + 2A/100`. The trade is real and worth naming: the photograph
 * is permanently cropped by that much, which is why the default is modest
 * and why parallax belongs on establishing shots rather than tightly
 * composed ones.
 *
 * `clip-path`, `transform` and `opacity` only. A full-bleed plate entrance
 * costs no layout and no repaint.
 */

const HIDDEN: Record<NonNullable<ClipRevealProps["from"]>, string> = {
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
  bottom: "inset(100% 0% 0% 0%)",
  top: "inset(0% 0% 100% 0%)",
};

const OPEN = "inset(0% 0% 0% 0%)";

/** Overhang needed to cover ±`amount`% of travel, plus a rounding guard. */
const cover = (amount: number) => 1 + (2 * amount) / 100 + 0.005;

export function ClipReveal({
  children,
  className,
  from = "left",
  delay = 0,
  duration = DUR.cinematic,
  scale = true,
  parallax = 0,
  ratio,
}: ClipRevealProps) {
  const frame = useRef<HTMLDivElement>(null);
  const settle = useRef<HTMLDivElement>(null);
  const plate = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = frame.current;
    const inner = settle.current;
    const drift = plate.current;
    if (!el || !inner || !drift) return;

    registerGsap();

    if (prefersReducedMotion()) {
      // Final state, and no crop — the overscale only exists to pay for
      // parallax, and there is no parallax here to pay for.
      gsap.set(el, { clipPath: OPEN });
      gsap.set(inner, { scale: 1 });
      gsap.set(drift, { scale: 1, yPercent: 0 });
      return;
    }

    return motionMedia(el, (c) => {
      /*
       * THE WIPE RUNS AT EVERY WIDTH. It is the reveal itself, not an
       * enhancement of it — dropping it on mobile would leave the image with
       * no entrance at all. What mobile drops is the DEPTH work below, which
       * is what actually costs something on a phone.
       */
      const tl = gsap.timeline({
        delay,
        scrollTrigger: { trigger: el, start: START, once: true },
      });

      tl.fromTo(
        el,
        { clipPath: HIDDEN[from] },
        {
          clipPath: OPEN,
          // Mobile reveals are shorter: a phone scrolls faster than a wheel,
          // and a 1.25s wipe is still finishing when the image has left.
          duration: c.isMobile ? DUR.reveal : duration,
          ease: EASE.cine,
        },
      );

      if (scale) {
        tl.fromTo(
          inner,
          { scale: 1.08 },
          {
            scale: 1,
            duration: (c.isMobile ? DUR.reveal : duration) + 0.3,
            ease: EASE.cine,
          },
          0,
        );
      }

      /*
       * Parallax is desktop and tablet only, and tablet gets less of it. A
       * phone viewport is short enough that the plate's whole travel happens
       * in a fraction of a second of thumb-scroll — imperceptible as depth,
       * fully priced as compositing, and it carries the crop for nothing.
       */
      if (!parallax || c.isMobile) {
        gsap.set(drift, { scale: 1, yPercent: 0 });
        return;
      }

      const amount = c.isTablet ? parallax * 0.6 : parallax;
      gsap.set(drift, { scale: cover(amount) });

      gsap.fromTo(
        drift,
        { yPercent: -amount },
        {
          yPercent: amount,
          ease: EASE.none,
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });
  }, [from, delay, duration, scale, parallax]);

  return (
    <div
      ref={frame}
      className={cn("relative overflow-hidden", className)}
      style={{
        // Painted state before JS runs. The image is fully visible and
        // uncropped; every effect below is applied on top of a correct frame.
        clipPath: OPEN,
        ...(ratio ? { aspectRatio: ratio } : null),
      }}
    >
      <div ref={settle} className="h-full w-full">
        <div
          ref={plate}
          className={cn(
            parallax ? "absolute inset-0 will-change-transform" : "h-full w-full",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
