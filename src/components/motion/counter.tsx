"use client";

import { useEffect, useRef } from "react";
import {
  gsap,
  registerGsap,
  prefersReducedMotion,
  inViewport,
  EASE,
} from "@/lib/motion";

interface CounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  /** Seconds. Numerals should move faster than the page around them. */
  duration?: number;
  /**
   * Thousands separators. Turn OFF for years and other numerals that are
   * identifiers rather than quantities — a founding year rendered with
   * grouping reads "2,009", which is not a date.
   */
  grouping?: boolean;
  className?: string;
}

/**
 * Count-up numeral.
 *
 * THE FAILURE MODE IS INVERTED FROM THE USUAL BUILD, and that inversion is
 * the entire reason this component can be trusted on a stat row that sits ON
 * the fold — which is where stat rows always sit, and where this site
 * previously had to delete the effect outright to stop shipping four zeros.
 *
 * The ordinary implementation blanks the numeral to "0" on mount and counts
 * up when a trigger fires. Two unconditional characters, one conditional
 * reveal: anything that stops the trigger — an ambiguous start point on the
 * fold, a smooth-scroll library that has not reported a position yet, fonts
 * still swapping the layout underneath the measurement — leaves a credential
 * reading zero. A statistic that is sometimes wrong is worse than one that
 * never animated.
 *
 * `immediateRender: false` is what fixes it, and it is the whole trick. The
 * tween does not touch the DOM until its trigger fires, so the number on
 * screen is the SERVER-RENDERED FINAL VALUE until the exact moment something
 * is going to animate it. If the trigger never fires the figure is simply
 * correct — no watchdog, no restore path, nothing to get wrong. The count-up
 * became safe to use by making its absence indistinguishable from success.
 *
 * NUMERALS MOVE FAST WHILE THEIR LABELS STAY STILL. The count runs 1.6s
 * against reveals of 0.85s elsewhere on the page — quick enough to read as a
 * mechanism spinning up rather than as a value being dragged, and nothing
 * around it moves at all. A stat row where the labels also animate reads as
 * a page loading; one where only the numbers move reads as an instrument
 * taking a reading.
 *
 * `snap` holds it to whole units, so the roll never flickers through
 * fractional values on its way up. The final value is written by the tween's
 * own completion, so it can never come to rest a rounding error short.
 */
export function Counter({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 1.6,
  grouping = true,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    registerGsap();
    if (prefersReducedMotion()) return;

    const format = (n: number) =>
      `${prefix}${n.toLocaleString("en-CA", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: grouping,
      })}${suffix}`;

    const state = { n: 0 };

    const tween = gsap.fromTo(
      state,
      { n: 0 },
      {
        n: value,
        duration,
        ease: EASE.out,
        snap: { n: 10 ** -decimals },
        // The load-bearing line. Nothing is written to the DOM until this
        // tween actually runs — see the note above the component.
        immediateRender: false,
        onUpdate: () => {
          el.textContent = format(state.n);
        },
        /*
         * A row on the fold is frequently already in view at mount, where a
         * scroll trigger is both unnecessary and least reliable. Play it
         * outright in that case and only defer the ones genuinely below.
         */
        scrollTrigger: inViewport(el, -24)
          ? undefined
          : { trigger: el, start: "top 92%", once: true },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      // Whatever happened, the figure ends up correct.
      el.textContent = format(value);
    };
  }, [value, suffix, prefix, decimals, duration, grouping]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString("en-CA", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: grouping,
      })}
      {suffix}
    </span>
  );
}
