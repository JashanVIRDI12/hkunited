"use client";

import { useEffect, useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  registerGsap,
  prefersReducedMotion,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Scroll-reactive marquee.
 *
 * THE VELOCITY COUPLING IS THE WHOLE POINT. A strip that crawls at a fixed
 * rate is wallpaper — the eye files it as an animated GIF within a second
 * and stops reading it. Tying its speed and DIRECTION to the wheel makes it
 * an instrument the visitor is playing: scroll hard and the band tears past,
 * scroll back and it reverses, stop and it settles to its resting drift. It
 * reads as a physical belt reacting to the page rather than as a loop.
 *
 * The loop is exact rather than approximate: the caller's children are
 * rendered TWICE, side by side, and the track translates by exactly -50% of
 * its own width — one full copy — before repeating. Both copies are the same
 * markup, so they are the same width by construction and the seam can never
 * drift. The second copy is `aria-hidden`: it is the same text again, and a
 * screen reader announcing every material twice is a bug, not a feature.
 *
 * `xPercent` is a transform, so nothing here touches layout or paint.
 *
 * Under `prefers-reduced-motion` the belt simply does not start. The first
 * copy stays in the DOM as real text, so nothing is lost to assistive tech —
 * only the horizontal overflow is unreachable, which is inherent to the form.
 */

interface MarqueeProps {
  /** One copy of the strip. Rendered twice — keep it self-contained. */
  children: React.ReactNode;
  /** Seconds for one copy to pass. Larger is slower. */
  duration?: number;
  className?: string;
}

/**
 * Ceiling on the scroll boost, as a multiple of resting speed. Past about
 * 6x the type stops being legible and the band reads as a smear — which is
 * a different effect, and a cheaper one.
 */
const BOOST_CEILING = 5;

/** Wheel velocity (px/s) that buys one full multiple of resting speed. */
const VELOCITY_PER_MULTIPLE = 500;

/** Quiet time after the last scroll frame before the belt eases back. */
const SETTLE_DELAY_MS = 120;

export function Marquee({ children, duration = 38, className }: MarqueeProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    const frame = wrap.current;
    if (!el || !frame) return;

    registerGsap();
    if (prefersReducedMotion()) return;

    const loop = gsap.to(el, {
      xPercent: -50,
      duration,
      // Linear, always: any ease would make the belt surge and stall on its
      // own schedule, and the only thing allowed to modulate it is the wheel.
      ease: "none",
      repeat: -1,
    });

    let settle: number | undefined;

    const spy = ScrollTrigger.create({
      /*
       * Bound to the band's own pass through the viewport rather than to the
       * document. `getVelocity` reports the SCROLLER's velocity either way,
       * so nothing is lost — and the belt stops being ticked at all while it
       * is off screen, which on a page this long is most of the time.
       */
      trigger: frame,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
      onUpdate: (self) => {
        const boost = gsap.utils.clamp(
          0,
          BOOST_CEILING,
          Math.abs(self.getVelocity()) / VELOCITY_PER_MULTIPLE,
        );
        const direction = self.direction === -1 ? -1 : 1;

        // Set it, do not tween it: this runs on the scroll frame, so the
        // belt should already be at the new speed by the time it paints.
        // A tween here would lag the wheel by its own duration.
        gsap.killTweensOf(loop);
        loop.timeScale(direction * (1 + boost));

        window.clearTimeout(settle);
        settle = window.setTimeout(() => {
          gsap.to(loop, {
            timeScale: direction,
            duration: 1.1,
            ease: "power2.out",
            overwrite: true,
          });
        }, SETTLE_DELAY_MS);
      },
    });

    return () => {
      window.clearTimeout(settle);
      spy.kill();
      gsap.killTweensOf(loop);
      loop.kill();
    };
  }, [duration]);

  return (
    <div ref={wrap} className={cn("overflow-hidden", className)}>
      <div ref={track} className="flex w-max will-change-transform">
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
