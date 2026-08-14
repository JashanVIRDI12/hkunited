"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { revealOnScroll, revealCards } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Before paint on the client, so the start state is never painted and then
 * corrected. Degrades to `useEffect` during SSR so React does not warn.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Stagger direct children instead of revealing the wrapper as one unit.
   *
   * A number overrides the per-item gap in seconds. Reach for it when the
   * list is long: the default gap is tuned for four to six cards, and on ten
   * or more the same value puts a full second between the first item landing
   * and the last, which stops reading as one gesture.
   */
  stagger?: boolean | number;
  /**
   * `cards` is for grids of surfaces — panels, tiles, photo cards. It rises
   * further, settles from slightly under size, and staggers wider.
   * `content` is for prose and controls. See the note below.
   */
  variant?: "content" | "cards";
  /**
   * `ul` / `ol` exist because staggering a list means staggering its `<li>`
   * elements, and a `<div>` between the list and its items is invalid markup
   * that also costs the enumeration a screen reader would otherwise announce
   * ("list, 10 items"). The wrapper has to BE the list.
   */
  as?: "div" | "ul" | "ol";
  y?: number;
  delay?: number;
  start?: string;
}

/**
 * Scroll reveal wrapper.
 *
 * TWO VARIANTS, BECAUSE A PARAGRAPH AND A CARD ARE NOT THE SAME OBJECT.
 *
 * `content` rises 28px and fades. Nothing else. A block of prose that also
 * grew as it arrived would read as a zoom, and text rendered at a fractional
 * scale for the length of a tween is visibly soft — worst on a high-contrast
 * serif, which is what every heading on this site is set in.
 *
 * `cards` rises 60px and settles from `scale: 0.97`. Three percent is far too
 * little to read as a zoom; what it reads as is the card coming to REST,
 * because a real object decelerating toward you resolves its size at the same
 * moment it resolves its position. Take the scale out and the identical
 * movement reads as a slide. Push it past about 0.94 and it starts reading as
 * a card shrinking rather than arriving.
 *
 * THE STAGGER IS 0.1s AND THAT IS A CEILING, not a starting point. Past
 * roughly 0.15s per card the group stops reading as one gesture and becomes a
 * queue — you start watching the sequence rather than the content, and on a
 * six-card grid the last card lands nearly a second after the first.
 *
 * NOTHING IS PARKED IN THE MARKUP. This component used to render its wrapper
 * with `opacity-0` and depend on a tween to clear it, with a `<noscript>`
 * rule as the safety net. The start state is now applied by the same call
 * that schedules the reveal, before paint, and `safeReveal` underneath adds
 * two guarantees the old arrangement could not: content already in the
 * viewport plays immediately rather than waiting for a scroll that has
 * already happened, and anything still hidden when the page has certainly
 * settled is resolved outright. See `lib/motion.ts`.
 */
export function Reveal({
  children,
  className,
  stagger = false,
  variant = "content",
  as: Tag = "div",
  y,
  delay = 0,
  start = "top 82%",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = stagger ? (Array.from(el.children) as HTMLElement[]) : [el];
    if (!targets.length) return;

    const reveal = variant === "cards" ? revealCards : revealOnScroll;

    return reveal(targets, {
      trigger: el,
      y,
      delay,
      start,
      // A single element has nothing to stagger against; `true` takes the
      // variant's default gap; a number overrides it.
      stagger: typeof stagger === "number" ? stagger : stagger ? undefined : 0,
    });
  }, [stagger, variant, y, delay, start]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement & HTMLUListElement & HTMLOListElement>}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}
