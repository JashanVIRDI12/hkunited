"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Travel in EACH direction, as a percentage of the frame's height. The
   * plate runs from `-amount` to `+amount` across the frame's pass through
   * the viewport. 6–10 reads as depth; past ~14 it reads as a glitch,
   * because the plate visibly outruns the copy beside it.
   */
  amount?: number;
  /** CSS aspect-ratio for the frame. The frame must size itself: its child
   *  fills it absolutely, so it cannot inherit height from the content. */
  ratio?: string;
}

/**
 * Depth pass for full-bleed media.
 *
 * A plate that scrolls at exactly page speed is flat. Moving it slower than
 * the page — which is what translating it against the scroll amounts to —
 * puts it behind the surface of the page rather than on it.
 *
 * THE OVERSCALE IS NOT DECORATIVE. Translating a plate by ±`amount`% of the
 * frame exposes a strip of empty frame at whichever edge it pulls away from,
 * unless the plate is already larger than the frame by at least that much on
 * each side. A plate scaled by `s` overhangs by `(s-1)/2` per side, so
 * covering ±A% needs `s ≥ 1 + 2A/100`. Anything less and the section shows a
 * sliver of `bg-paper-sunk` at the top or bottom for part of the scroll.
 *
 * The trade is real and worth naming: the plate is permanently cropped by
 * that overscale. At `amount=8` that is 16% of the frame — which is why the
 * default is modest and why this belongs on establishing shots, where the
 * subject sits well inside the frame, and not on anything tightly composed.
 *
 * `yPercent` is measured against the element's UNSCALED height, and GSAP
 * writes `translate(...) scale(...)` in that order, so the translation is
 * not multiplied by the overscale. The arithmetic above holds as written.
 */
const cover = (amount: number) => 1 + (2 * amount) / 100 + 0.005;

export function Parallax({
  children,
  className,
  amount = 8,
  ratio,
}: ParallaxProps) {
  const frame = useRef<HTMLDivElement>(null);
  const plate = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = frame.current;
    const inner = plate.current;
    if (!el || !inner) return;

    registerGsap();

    // No parallax means no reason to carry the crop that pays for it.
    if (prefersReducedMotion()) {
      gsap.set(inner, { yPercent: 0, scale: 1 });
      return;
    }

    gsap.set(inner, { scale: cover(amount) });

    const tween = gsap.fromTo(
      inner,
      { yPercent: -amount },
      {
        yPercent: amount,
        // Linear: a scrubbed tween is driven by scroll position, and any
        // ease here would decouple the plate from the wheel.
        ease: "none",
        scrollTrigger: {
          trigger: el,
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
  }, [amount]);

  return (
    <div
      ref={frame}
      className={cn("relative overflow-hidden", className)}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      <div
        ref={plate}
        className="absolute inset-0 will-change-transform"
        // Painted state before JS runs. Holding the overscale here means the
        // only thing GSAP adds on mount is the offset, so there is no visible
        // resize of the plate on hydration.
        //
        // This MUST be `transform`, not the `scale` property. GSAP writes its
        // scale into `transform`; the CSS `scale` property is applied on top
        // of `transform` rather than replaced by it, so the two would compose
        // and the plate would mount at the square of the intended overscale.
        style={{ transform: `scale(${cover(amount)})` }}
      >
        {children}
      </div>
    </div>
  );
}
