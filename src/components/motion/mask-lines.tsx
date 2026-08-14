"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import {
  gsap,
  registerGsap,
  motionMedia,
  prefersReducedMotion,
  inViewport,
  EASE,
  DUR,
  STAGGER,
  START,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface MaskLinesProps {
  /**
   * Lines, broken by hand. Where a display headline breaks is a design
   * decision, not a measurement — and hand-splitting means the real string
   * can stay in the DOM for assistive tech instead of being shredded into
   * per-line spans.
   *
   * For headings that REFLOW with the viewport — anything at `type-h2` and
   * below — use `SplitHeading` instead. There the break genuinely is a
   * measurement, and only the browser can take it.
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
   * become separate elements, so the readable string has to live on a single
   * labelled ancestor instead. WITHOUT THIS the page announces the headline
   * once per line.
   */
  presentational?: boolean;
}

/**
 * Headline that rises out of a mask, line by line.
 *
 * NOTHING IS PARKED IN THE MARKUP ANY MORE, and that is the substantive
 * change from the previous build of this component.
 *
 * It used to render each line with an inline `translateY(135%)` and depend on
 * a tween to bring it back — with a `<noscript>` rule in the root layout as
 * the escape hatch. That pattern has shipped an invisible headline on this
 * site twice, because the hiding half is unconditional and the revealing half
 * is not: any bail-out between the two, any trigger that fails to fire, and
 * the page keeps a headline-shaped hole where its headline should be.
 *
 * Now the lines render in their final position and the start state is applied
 * by the same effect that animates it away, before paint. The failure mode
 * inverts completely: if this code does not run, for any reason at all, the
 * headline is simply a headline. A watchdog covers the remaining case where
 * the effect runs but a scroll trigger never does.
 *
 * OPACITY RIDES WITH THE TRAVEL, which the previous build did not do. A line
 * that only slides is a mechanical wipe; a line that also inks in over the
 * last third of its travel reads as a film title. The fade is deliberately
 * faster than the movement — it is finished while the line is still settling,
 * so what you notice is the settle rather than the fade.
 *
 * TWO NUMBERS ARE LOAD-BEARING, and they are coupled.
 *
 * The display tiers run at line-height 0.92–1.25, which can make the line box
 * SHORTER than the glyphs it contains — Instrument Serif's content area is a
 * little over 1.2em and its descenders reach further than the geometric sans
 * this system used before — so a plain `overflow-hidden` mask would shave the
 * tails off every "y", "g" and "p" for the whole life of the page, not just
 * during the animation. `RELIEF` with a matching negative margin buys the
 * space back without changing layout.
 *
 * That relief then has to be cleared by the travel, or the line peeks above
 * its mask before it animates. Clearing needs `TRAVEL × lineHeight > RELIEF`:
 * at the tightest tier in use, 1.35 × 0.92em = 1.24em against 0.22em of
 * relief, so there is ample margin. Raise the relief and the travel must rise
 * with it.
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

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    registerGsap();
    const targets = el.querySelectorAll<HTMLElement>("[data-line]");
    if (!targets.length) return;

    // Already correct in the markup — nothing to restore.
    if (prefersReducedMotion()) return;

    return motionMedia(el, (c) => {
      /*
       * `y: 0` is not belt and braces. GSAP does not read a percentage
       * translate as a percentage — it reads the COMPUTED MATRIX, where the
       * percentage has already been resolved against the line box, and caches
       * what it finds as a pixel `y`. `y` and `yPercent` then COMPOSE rather
       * than being exclusive, so a tween touching only `yPercent` animates
       * 135% → 0% on top of a retained pixel offset and the line comes to
       * rest exactly where it started. Passing `y: 0` hands the axis back.
       */
      const tween = gsap.fromTo(
        targets,
        { y: 0, yPercent: c.isMobile ? TRAVEL * 0.8 : TRAVEL, opacity: 0 },
        {
          y: 0,
          yPercent: 0,
          opacity: 1,
          duration: c.isMobile ? DUR.reveal + 0.15 : DUR.cinematic,
          stagger: STAGGER.lines,
          delay,
          ease: EASE.deep,
          scrollTrigger:
            onScroll && !inViewport(el, -40)
              ? { trigger: el, start: START, once: true }
              : undefined,
        },
      );

      /*
       * The watchdog, and it is scoped to exactly one failure.
       *
       * A line below the fold that has not revealed is CORRECT — it has not
       * been scrolled to. A line sitting in the viewport that has not
       * revealed is a trigger that mis-measured, against pre-swap font
       * metrics or a layout that moved underneath it, and from here the two
       * are indistinguishable except by that test. So the check is: three
       * seconds in, if this headline is on screen and still hidden, put it
       * on screen. Losing the animation is not a defect; losing the headline
       * is, and this component has lost one before.
       */
      const watchdog = window.setTimeout(() => {
        if (tween.isActive() || tween.progress() > 0) return;
        if (!inViewport(el)) return;
        gsap.set(targets, { y: 0, yPercent: 0, opacity: 1 });
      }, 3000);

      return () => window.clearTimeout(watchdog);
    });
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
              Rendered IN PLACE. The start state is applied by the effect
              above, before paint — see the note on the component for why
              this is no longer an inline `transform`.
            */}
            <span data-line className={cn("block")}>
              {line}
            </span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
