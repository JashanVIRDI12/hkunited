"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap, prefersReducedMotion, EASE, START } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface MaskLinesProps {
  /**
   * Lines, broken by hand. Where a display headline breaks is a design
   * decision, not a measurement — and hand-splitting means the real string
   * can stay in the DOM for assistive tech instead of being shredded into
   * per-line spans.
   */
  lines: readonly string[];
  className?: string;
  /**
   * `span` exists for the case where the masked line is the label of an
   * interactive element — /safety sets each of its four display words as a
   * link into the pillar it names. A block-level tag inside an anchor is
   * legal HTML5 but it takes the line out of the link's own baseline
   * alignment, and the element being labelled is not a heading in its own
   * right; the heading contract is met by the `sr-only` `h1` above it.
   */
  as?: "h1" | "h2" | "p" | "span";
  id?: string;
  delay?: number;
  /** Reveal when scrolled to, rather than on mount. */
  onScroll?: boolean;
  /**
   * Drop the `sr-only` copy and hide the whole element from assistive tech.
   *
   * For compositions that place each line in its own grid cell: the lines
   * become separate elements, so the readable string has to live on a
   * single labelled ancestor instead. WITHOUT THIS the page announces the
   * headline once per line.
   */
  presentational?: boolean;
}

/**
 * Headline that rises out of a mask, line by line.
 *
 * DO NOT PARK THE LINE WITH A TAILWIND `translate-*` CLASS. In Tailwind v4
 * those compile to the individual `translate` PROPERTY, and the individual
 * transform properties are applied in addition to `transform`, not instead
 * of it. GSAP animates `yPercent` by writing `transform`, so a
 * `translate-y-full` class survives the whole tween: the line animates from
 * 225% to 100% and comes to rest still a full line-height below its mask.
 * What is left on screen is a sliver of the tops of the capitals — a bar
 * where the F crossbar is, a dot where the i is — which reads as a broken
 * font rather than as a transform bug. The parked state is therefore an
 * inline `transform`, which GSAP does replace.
 *
 * EVERY TWEEN HERE MUST ALSO PASS `y: 0`, AND THAT IS NOT BELT AND BRACES.
 * GSAP does not read the inline `translateY(135%)` as a percentage — it reads
 * the COMPUTED MATRIX, where percentages have already been resolved against
 * the line box, and caches what it finds as a pixel `y`. `y` and `yPercent`
 * are then composed, not exclusive. So a tween that touches only `yPercent`
 * animates 135% → 0% on top of a retained `y` of 86.4px, and the line comes
 * to rest exactly where it was parked. Measured on a 64px line: the tween
 * completes, the inline style reads `translate(0px, 86.4px)`, and the
 * headline is invisible — including on the reduced-motion path, which had
 * the same omission. Passing `y: 0` overrides the adopted pixel offset and
 * hands the axis back to `yPercent`.
 *
 * TWO NUMBERS ARE LOAD-BEARING, and they are coupled.
 *
 * The display tiers run at line-height 0.92–1.25, which can still make the
 * line box SHORTER than the glyphs it contains — Instrument Serif's content
 * area is a little over 1.2em, and its descenders reach further than the
 * geometric sans this system used before — so a plain `overflow-hidden`
 * mask would shave the tails off every "y", "g" and "p" for the whole life
 * of the page, not just during the animation. `pb-[0.22em]` with a matching
 * negative margin buys the relief without changing layout.
 *
 * That relief then has to be cleared by the travel, or the line peeks above
 * its mask before it animates. Clearing needs `travel × lineHeight >
 * relief`: at the tightest tier now in use, 1.35 × 0.92em = 1.24em against
 * 0.22em of relief, so there is ample margin. Raise the relief and the
 * travel has to rise with it.
 */
const TRAVEL = 135;
const RELIEF = "0.22em";

export function MaskLines({
  lines,
  className,
  as: Tag = "h2",
  id,
  delay = 0,
  onScroll = false,
  presentational = false,
}: MaskLinesProps) {
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    registerGsap();
    const targets = el.querySelectorAll<HTMLElement>("[data-line]");
    if (!targets.length) return;

    if (prefersReducedMotion()) {
      gsap.set(targets, { y: 0, yPercent: 0 });
      return;
    }

    const tween = gsap.fromTo(
      targets,
      { y: 0, yPercent: TRAVEL },
      {
        y: 0,
        yPercent: 0,
        duration: 1.2,
        stagger: 0.08,
        delay,
        ease: EASE,
        scrollTrigger: onScroll
          ? { trigger: el, start: START, once: true }
          : undefined,
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, onScroll]);

  return (
    <Tag className={className} id={id} aria-hidden={presentational || undefined}>
      {!presentational && <span className="sr-only">{lines.join(" ")}</span>}
      <span ref={root} aria-hidden="true" className="block">
        {lines.map((line) => (
          <span
            key={line}
            className="block overflow-hidden"
            style={{ paddingBottom: RELIEF, marginBottom: `-${RELIEF}` }}
          >
            {/*
              Parked below the mask before JS runs, so the line is never
              painted in place and then yanked down when GSAP takes over —
              `fromTo` renders its start state immediately, scroll-triggered
              or not, so that flash happens in both modes without this.

              An inline `transform`, NOT a `translate-y-*` class — see the
              note above the component; the class would not be replaced by
              the tween.

              `motion-parked` is the no-JS escape hatch: the root layout
              carries a <noscript> rule that clears the transform, exactly as
              it already does for the reveals that start at opacity 0.
              Without it, a no-JS visitor gets an empty headline.
            */}
            <span
              data-line
              className={cn("motion-parked block will-change-transform")}
              style={{ transform: `translateY(${TRAVEL}%)` }}
            >
              {line}
            </span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
