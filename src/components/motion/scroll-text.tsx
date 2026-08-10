"use client";

import { Fragment, useEffect, useRef } from "react";
import { gsap, registerGsap, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface ScrollTextProps {
  /** Plain text. Split on whitespace, so no markup inside. */
  children: string;
  className?: string;
  /** Resting opacity of a word not yet reached. */
  dim?: number;
}

/**
 * A paragraph that inks in, word by word, as it is read past.
 *
 * The whole passage is present in the DOM as real text from the server —
 * the words are wrapped in spans but never reordered, hidden or duplicated,
 * so screen readers, crawlers and no-JS agents get the paragraph intact.
 * `opacity` is the only thing that moves.
 *
 * WHY OPACITY AND NOT COLOUR: the obvious implementation animates each
 * word's `color` from grey to ink. That repaints text on every scroll
 * frame, for every word, which is the one thing a scrubbed effect cannot
 * afford. Opacity composites.
 *
 * THE DIM FLOOR IS A CONTRAST DECISION, NOT A TASTE ONE, and it is the
 * reason this effect looks gentler here than in the versions it is copied
 * from. A scrubbed tween holds its start state for as long as the trigger
 * is above range, so the resting value is what a reader sees if they land
 * on the section and stop — it has to pass on its own.
 *
 * Measured, `ink` over `paper-alt` (the surface this runs on):
 *
 *     0.25 → 1.76:1     0.50 → 3.58:1     0.58 → 4.69:1
 *     0.40 → 2.65:1     0.55 → 4.24:1     0.60 → 5.03:1
 *
 * The dramatic 0.15–0.25 floors these effects usually ship with fail AA
 * outright. 0.6 lands at 5.03:1 — essentially `ink-4`, the quietest tier
 * the design system's contrast contract already blesses (5.28:1 there).
 * Lowering it widens the effect and breaks that contract.
 */
export function ScrollText({ children, className, dim = 0.6 }: ScrollTextProps) {
  const root = useRef<HTMLParagraphElement>(null);
  const words = children.split(/\s+/).filter(Boolean);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    registerGsap();
    const targets = el.querySelectorAll<HTMLElement>("[data-word]");
    if (!targets.length) return;

    if (prefersReducedMotion()) {
      gsap.set(targets, { opacity: 1 });
      return;
    }

    const tween = gsap.fromTo(
      targets,
      { opacity: dim },
      {
        opacity: 1,
        duration: 1,
        stagger: 0.35,
        // Scrubbed: position is driven by the wheel, so an ease here would
        // decouple the ink from the reader's own pace.
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top 78%",
          end: "bottom 55%",
          // A small numeric scrub trails the scroll slightly, which reads
          // as ink soaking in rather than as a value snapping.
          scrub: 0.6,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [dim]);

  return (
    // No `text-balance` here: it is capped at a handful of lines in every
    // engine that ships it, and this runs long. The base stylesheet already
    // applies `text-wrap: pretty` to every paragraph.
    <p ref={root} className={cn(className)}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span data-word className="inline-block">
            {word}
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </p>
  );
}
