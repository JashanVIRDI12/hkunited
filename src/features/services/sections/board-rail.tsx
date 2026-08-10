"use client";

import { useEffect, useState } from "react";
import {
  gsap,
  ScrollTrigger,
  registerGsap,
  refreshWhenReady,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The board rail — the one client island on this page.
 *
 * It is a READOUT, not a menu. Ten entries scroll past on the right; this
 * column stays put and reports which one you are inside, the way a dispatch
 * board reports the load currently on the road. That framing is what earns
 * the numeral its size: it is not a decorative index, it is the instrument's
 * value, and an instrument whose value never moves is not worth drawing.
 *
 * WHY THE SPY LIVES HERE AND THE CONTENT DOES NOT. The ten entries are
 * server-rendered by `board.tsx` — they are static prose and have no reason
 * to ship as JavaScript. This component finds them in the DOM by their
 * `data-service-entry` marker rather than owning them, so the page keeps a
 * single small island and the rail can never fall out of sync with the list
 * it is reporting on: there is only one list.
 *
 * The rail is desktop-only. Below `lg` there is no column to park it in, and
 * a sticky readout over a single-column read is just a thing in the way —
 * `board.tsx` ships a plain contents strip at that width instead.
 */

export interface RailItem {
  slug: string;
  name: string;
  index: string;
}

/**
 * The line the readout switches on, as a fraction of the viewport from the
 * top. 45% sits just above centre: high enough that the entry you are
 * reading is the one being reported, low enough that the numeral does not
 * flip while the previous entry is still the one under your eye.
 */
const SWITCH_LINE = "45%";

export function BoardRail({ items }: { items: readonly RailItem[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    registerGsap();

    /*
     * Scoped to the width at which the rail actually exists. Below `lg` it
     * is `display: none`, and ten ScrollTriggers reporting into a state
     * nothing renders is pure cost on the device least able to afford it.
     * `matchMedia` also re-runs the setup across a resize past the
     * breakpoint, which a bare effect would not.
     */
    const mm = gsap.matchMedia();

    mm.add("(min-width: 64rem)", () => {
      const entries = gsap.utils.toArray<HTMLElement>("[data-service-entry]");
      if (!entries.length) return;

      /*
       * One trigger per entry, each active for exactly the scroll in which
       * that entry straddles the switch line. The entries are contiguous, so
       * as one deactivates the next activates on the same frame — there is
       * no gap where nothing is reported and no overlap where two are.
       *
       * `matchMedia` owns these: everything created inside the callback is
       * killed when the query stops matching, so there is no manual cleanup.
       */
      entries.forEach((el, i) =>
        ScrollTrigger.create({
          trigger: el,
          start: `top ${SWITCH_LINE}`,
          end: `bottom ${SWITCH_LINE}`,
          onToggle: (self) => {
            if (self.isActive) setActive(i);
          },
        }),
      );

      // The entries are set in a webfont that changes their height on swap.
      // Without this the trigger points are measured against fallback metrics
      // and the readout runs an entry behind for the life of the page.
      refreshWhenReady();
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="hidden lg:col-span-4 lg:block">
      <div className="sticky top-32">
        <Odometer labels={items.map((item) => item.index)} active={active} />

        <div className="mt-6 flex items-center gap-4">
          <span className="eyebrow">Now showing</span>
          <span className="h-px flex-1 bg-line" aria-hidden="true" />
          <span className="tnum text-[0.6875rem] tracking-[0.16em] text-ink-4">
            of {items.length}
          </span>
        </div>

        <nav aria-label="Service lines" className="mt-8 border-t border-line">
          <ul>
            {items.map((item, i) => (
              <li key={item.slug}>
                <a
                  href={`#${item.slug}`}
                  aria-current={i === active ? "true" : undefined}
                  className={cn(
                    "group/rail flex items-baseline gap-4 border-b border-line py-2.5 text-[0.9375rem] transition-colors duration-500",
                    i === active ? "text-ink" : "text-ink-4 hover:text-ink-2",
                  )}
                >
                  <span className="tnum text-[0.625rem] tracking-[0.16em]">
                    {item.index}
                  </span>
                  <span className="relative">
                    {item.name}
                    {/*
                      The rule is the only brand mark in the rail, and it
                      belongs to the active entry rather than to hover — the
                      colour is reporting state, not inviting a click.
                    */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-brand transition-transform duration-700 ease-[var(--ease-brand)]",
                        i === active ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

/**
 * The readout itself: a reel of every label, translated to the active one.
 *
 * WHY A REEL AND NOT JUST SWAPPING THE TEXT. A number that changes instantly
 * is a value; a number that ROLLS is a machine. The whole conceit of this
 * page is a dispatch board, and the roll is what sells it — it costs one
 * transform on a stack that is already in the DOM.
 *
 * WHOLE LABELS, NOT PER-DIGIT REELS. Split-flap digits are the obvious
 * build, and they need a fixed width per digit to line up. Instrument Serif
 * is not a tabular face — its `1` is materially narrower than its `0` — so
 * fixed digit cells would either clip the wide glyphs or leave the narrow
 * ones rattling. Rolling the two-character label as one unit sidesteps the
 * question entirely.
 *
 * The invisible `00` is the width gauge: it reserves the widest label this
 * reel can hold, so the window never resizes as the value changes. It has to
 * be `invisible` rather than `hidden` — visibility keeps the box, display
 * does not.
 *
 * `aria-hidden` throughout: the value it reports is already carried by the
 * `aria-current` link in the list below, and an odometer announcing itself
 * on every scroll would be intolerable.
 */
function Odometer({
  labels,
  active,
}: {
  labels: readonly string[];
  active: number;
}) {
  return (
    <div
      aria-hidden="true"
      className="relative inline-block h-[1.15em] overflow-hidden font-display text-[clamp(3.5rem,6vw,7rem)] leading-none text-ink"
    >
      <span className="invisible">00</span>
      <span
        className="absolute inset-x-0 top-0 transition-transform duration-[900ms] ease-[var(--ease-brand)]"
        // Percentages translate against the STACK's own height, so one step
        // is 100/labels.length — not 100.
        style={{ transform: `translateY(-${(active * 100) / labels.length}%)` }}
      >
        {labels.map((label) => (
          <span
            key={label}
            className="flex h-[1.15em] items-center justify-center"
          >
            {label}
          </span>
        ))}
      </span>
    </div>
  );
}
