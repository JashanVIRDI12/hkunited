"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * One card in a stacking deck.
 *
 * The deck is a column of siblings that each stick a little further down
 * than the last, so a card does not scroll away — it stays, and the next one
 * rides up over it, leaving a visible edge behind. What the reader ends up
 * with at the bottom is a physical pile of everything they have just read,
 * which is a far better closing image for three case studies than three
 * blocks that have left the building.
 *
 * THE STICKING IS PURE CSS. `position: sticky` on siblings inside a common
 * parent needs no JavaScript, no pinning and no spacer arithmetic, and it
 * cannot desynchronise from the scroll because it IS the scroll. GSAP is
 * asked for exactly one thing on top: the covered card recedes slightly as
 * it is covered, which is what separates a stack from a pile of coincidences.
 *
 * THE RECEDE IS ANCHORED AT THE TOP. `transformOrigin: 50% 0%` keeps the
 * card's top edge exactly where it stuck, so the stacked edges stay evenly
 * spaced as the deck builds. Scaling about the centre would drift every
 * visible edge downward by a different amount and the stack would go crooked.
 *
 * IT ASKS FOR HEIGHT, NOT JUST WIDTH. A sticking card has to fit between its
 * parked offset and the bottom of the viewport or its own foot is cut off for
 * the whole time it is stuck — and a 1440×700 window is wide enough for the
 * side-by-side card and nowhere near tall enough to hold it. So the deck is
 * gated on the `deck:` variant, which is width AND height; anything shorter
 * gets an ordinary column of cards, which is the honest form there anyway.
 */

interface StackCardProps {
  children: React.ReactNode;
  /**
   * How far below the header this card parks, in rem. Increment it per card:
   * the increment IS the visible edge each covered card leaves behind.
   */
  offset: number;
  /** The last card is never covered, so it must never recede. */
  last?: boolean;
  className?: string;
}

/** How far a covered card falls back. Past ~0.9 it reads as a card shrinking
 *  rather than as a card going behind the one in front of it. */
const RECEDE = 0.94;

/**
 * Must match the `deck:` custom variant in `globals.css`, which is what
 * actually turns the sticking on. A card that sticks without receding is
 * worse than one that does neither, so the two are kept deliberately
 * redundant rather than one being inferred from the other.
 */
const DECK_QUERY = "(min-width: 64rem) and (min-height: 52rem)";

export function StackCard({
  children,
  offset,
  last = false,
  className,
}: StackCardProps) {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el || last) return;

    registerGsap();
    if (prefersReducedMotion()) return;

    const mm = gsap.matchMedia();

    mm.add(DECK_QUERY, () => {
      const card = el.firstElementChild;
      if (!card) return;

      /*
       * The sticky offset is authored as a `calc()` against `--header-h`, so
       * it is read back off the element rather than recomputed here — one
       * definition, and it stays correct when the header height changes at
       * the `md` breakpoint.
       */
      const parked = parseFloat(getComputedStyle(el).top) || 0;

      gsap.to(card, {
        scale: RECEDE,
        transformOrigin: "50% 0%",
        ease: "none",
        scrollTrigger: {
          trigger: el,
          // Starts the moment the card parks…
          start: () => `top top+=${parked}`,
          // …and runs for one card's worth of scroll, which is how long the
          // next card takes to cover it. A function so it re-measures on
          // resize rather than baking in the first layout's height.
          end: () => `+=${el.offsetHeight}`,
          scrub: true,
        },
      });
    });

    return () => mm.revert();
  }, [last]);

  return (
    <div
      ref={wrap}
      className={cn("deck:sticky", className)}
      style={{ top: `calc(var(--header-h) + ${offset}rem)` }}
    >
      {children}
    </div>
  );
}
