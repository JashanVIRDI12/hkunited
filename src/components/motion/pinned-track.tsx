"use client";

import { useEffect, useRef, useState } from "react";
import {
  gsap,
  registerGsap,
  motionMedia,
  refreshWhenReady,
  EASE,
  DUR,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

interface PinnedTrackProps {
  /** Stays on screen for the whole pinned pass. Keep it short. */
  header?: React.ReactNode;
  /**
   * The cards. Each must carry `data-track-item`, and may carry the optional
   * markers below on descendants — see the contract note on the component.
   */
  children: React.ReactNode;
  /** Number of items, for the readout and the active-index arithmetic. */
  count: number;
  className?: string;
  /** Grid classes for the STACKED layout. Pinned mode overrides them. */
  trackClassName?: string;
  /**
   * `id` of the heading that names this region. Preferred over `label` —
   * pointing at the real heading keeps one source for the section's name, so
   * the visible title and the announced one cannot drift apart.
   */
  labelledBy?: string;
  /** Fallback accessible name, when there is no heading to point at. */
  label?: string;
}

/**
 * PINNED HORIZONTAL STORYTELLING.
 *
 * The section parks, the track slides sideways under it, and one card at a
 * time holds focus while the others recede. It is the only pinned section on
 * the site and it is used once, which is what keeps it feeling like an event
 * rather than a device.
 *
 * THE MARKUP CONTRACT. This component owns the mechanism, not the content.
 * Cards are passed in as children and opt into the active-state treatment by
 * carrying data attributes, exactly as the services rail reads its entries:
 *
 *     [data-track-item]   the card itself      opacity + scale
 *     [data-track-media]  the photograph       brightness
 *     [data-track-title]  the heading          lifts 4px when active
 *     [data-track-rule]   accent indicator     scaleX 0 → 1 when active
 *
 * Only the first is required. A card missing the rest simply gets the card
 * treatment, which is the point of doing it with attributes rather than a
 * render prop — the layout stays in the feature file where it can be read.
 *
 * THE SCROLL DISTANCE IS CAPPED, AND THAT IS THE DESIGN DECISION HERE. The
 * naive build maps one pixel of horizontal travel to one pixel of vertical
 * scroll, which on six wide cards is four or five screens of wheel to get
 * through one section — the interaction stops being cinematic and becomes an
 * obstacle, and on a trackpad it feels broken. The pin is capped at two
 * viewport heights, so the whole track is understood within about a screen
 * and cleared within two. Read the cap as: nobody should have to WORK to get
 * past this.
 *
 * PINNING IS DESKTOP-ONLY AND HEIGHT-AWARE. `canPin` is width AND height:
 * a 1440×700 window is wide enough for the track and nowhere near tall
 * enough to hold a pinned viewport without clipping its own cards. Below
 * that — and under `prefers-reduced-motion` at any size — the section is
 * never pinned and never translated. It renders as an ordinary vertical
 * column of cards, all of them at full opacity, which is the honest form of
 * this content anyway and exactly what a phone should get. Mobile is not
 * given a shrunken version of the desktop interaction; it is given a
 * different one.
 *
 * THE LAYOUT SWITCH IS AN ATTRIBUTE, NOT A RE-RENDER. `data-mode` flips to
 * `pinned` from inside the matchMedia handler and the Tailwind
 * `group-data-` variants do the rest. Rendering two different trees would
 * mean a hydration mismatch on every load, and driving the layout from React
 * state would mean the server rendering a layout that is wrong for most
 * visitors. The server sends the stacked column — which is valid, complete
 * and legible everywhere — and the horizontal track is an enhancement
 * applied on top of it.
 */
export function PinnedTrack({
  header,
  children,
  count,
  className,
  trackClassName,
  labelledBy,
  label,
}: PinnedTrackProps) {
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const section = root.current;
    const frame = viewport.current;
    const rail = track.current;
    if (!section || !frame || !rail) return;

    registerGsap();

    return motionMedia(section, (c) => {
      if (!c.canPin || c.reduced) {
        setPinned(false);
        setActive(0);
        return;
      }

      /*
       * The mode flips BEFORE anything is measured, and the order is not
       * incidental: `scrollWidth` in stacked mode is the width of a grid,
       * which has nothing to do with the width of the flex row this is about
       * to become. Reading the property forces the style recalculation, so
       * the measurement below is taken against the layout that will actually
       * be pinned.
       */
      section.dataset.mode = "pinned";

      /*
       * Measured in a function so it re-runs on every refresh rather than
       * baking in the first layout — the display serif swaps after first
       * paint and changes every card's width, and a pin whose end was
       * measured before that runs long or short for the life of the page.
       */
      const distance = () => Math.max(0, rail.scrollWidth - frame.clientWidth);

      /*
       * NOTHING TO TRAVEL MEANS NOTHING TO PIN. On a wide enough display the
       * six cards fit the viewport outright, and pinning a section for zero
       * pixels of movement is strictly worse than not pinning it: the reader
       * gets a section that grabs the scroll, holds it for one frame and
       * releases, which reads as a stutter. The stacked grid is correct there
       * and this bails back to it.
       */
      if (distance() <= 0) {
        delete section.dataset.mode;
        setPinned(false);
        return;
      }

      setPinned(true);

      const tween = gsap.to(rail, {
        x: () => -distance(),
        // Linear, always. A scrubbed tween is driven by wheel position, and
        // any ease decouples the track from the reader's own hand.
        ease: EASE.none,
        scrollTrigger: {
          trigger: section,
          start: "top top",
          // The cap. See the note on the component.
          end: () => `+=${Math.min(distance(), window.innerHeight * 2)}`,
          /*
           * PIN THE INNER FRAME, NOT THE SECTION. The section is a
           * `container-page` element: `max-width` plus `margin-inline: auto`.
           * Pinning it means ScrollTrigger switching it to `position: fixed`,
           * where auto margins no longer centre anything — so the whole
           * section jumps sideways by half its dead margin on the frame the
           * pin engages, and jumps back when it releases. The frame inside it
           * is an ordinary full-width block with no margins to lose.
           */
          pin: frame,
          /*
           * `true`, NOT a number. This site runs Lenis, which is already
           * smoothing the scroll position that feeds ScrollTrigger. A numeric
           * scrub adds a SECOND smoothing pass on top of it, and the two
           * compound into a track that keeps sliding after the wheel has
           * stopped and lags behind it when it starts — which reads exactly
           * like the animation is broken rather than eased. With Lenis in the
           * stack, direct scrub is the smooth one.
           */
          scrub: true,
          /*
           * Pinning has to switch the element to `position: fixed` in a single
           * frame. At speed — a trackpad flick, or Lenis carrying momentum
           * into the section — the scroll can cross the start point and travel
           * some distance before that frame renders, which paints one frame of
           * the section in the wrong place. This tells ScrollTrigger to make
           * the switch slightly early based on velocity.
           */
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const i = gsap.utils.clamp(
              0,
              count - 1,
              Math.floor(self.progress * count),
            );
            // Only on change: this fires every scroll frame, and a setState
            // per frame would re-render the whole track sixty times a second.
            setActive((prev) => (prev === i ? prev : i));
          },
        },
      });

      // Cards are set in a webfont that changes their width on swap, and the
      // pin distance is derived from that width.
      refreshWhenReady();

      return () => {
        delete section.dataset.mode;
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(rail, { x: 0 });
      };
    });
  }, [count]);

  /*
   * THE ACTIVE STATE.
   *
   * NO `gsap.context()` HERE, AND THAT IS THE FIX FOR THE GLITCH THIS
   * COMPONENT SHIPPED WITH.
   *
   * The obvious React-and-GSAP shape is a context created in the effect and
   * reverted in its cleanup. It is the right shape for setup that runs once.
   * It is exactly wrong for an effect keyed on a value that changes DURING
   * the animation: `revert()` does not merely stop the tweens, it restores
   * every inline style the context ever wrote. So each time the active index
   * advanced, all six cards were yanked back to their untouched state and
   * then re-animated from there — a visible pop on every card, six times per
   * pass, which is what the horizontal track looked like it was doing wrong.
   *
   * `overwrite: "auto"` does the job properly: a new tween on a property
   * kills only the conflicting part of the tween already running on it, and
   * picks up from wherever that had got to. Cards in transition keep moving
   * rather than snapping. The only cleanup needed is on unmount.
   *
   * OPACITY DOES THE DIMMING, NOT `filter`. The first build brightened and
   * desaturated the recessed images with `filter`, which forces a repaint of
   * every affected image — six of them, mid-pin, while a scrubbed tween is
   * already running. Opacity composites, and stacking the media's own fade on
   * top of the card's gives the photograph a deeper recess than the text
   * beside it, which is the whole effect the filter was there for.
   */
  useEffect(() => {
    const rail = track.current;
    if (!rail) return;

    const cards = gsap.utils.toArray<HTMLElement>("[data-track-item]", rail);
    if (!cards.length) return;

    cards.forEach((card, i) => {
      const on = pinned ? i === active : true;

      const media = card.querySelector("[data-track-media]");
      const title = card.querySelector("[data-track-title]");
      const rule = card.querySelector("[data-track-rule]");

      // 0.62 is low enough to read as recessed and high enough that the card
      // is still legible — a neighbour you can read is what makes the track
      // feel continuous rather than like a slideshow.
      gsap.to(card, {
        opacity: on ? 1 : 0.62,
        scale: on ? 1 : 0.97,
        duration: DUR.micro + 0.1,
        ease: EASE.out,
        overwrite: "auto",
      });

      if (media) {
        gsap.to(media, {
          opacity: on ? 1 : 0.82,
          duration: DUR.micro + 0.1,
          ease: EASE.out,
          overwrite: "auto",
        });
      }

      if (title) {
        gsap.to(title, {
          y: on ? -4 : 0,
          duration: DUR.micro,
          ease: EASE.out,
          overwrite: "auto",
        });
      }

      if (rule) {
        gsap.to(rule, {
          scaleX: on ? 1 : 0,
          duration: DUR.micro + 0.15,
          ease: EASE.deep,
          overwrite: "auto",
        });
      }
    });
  }, [active, pinned]);

  /*
   * Unmount only. Separated from the effect above so it runs once, on
   * teardown, rather than between every index change.
   */
  useEffect(() => {
    const rail = track.current;
    return () => {
      if (rail) gsap.killTweensOf(rail.querySelectorAll("*"));
    };
  }, []);

  return (
    <section
      ref={root}
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : label}
      className={cn("group/track", className)}
    >
      <div
        ref={viewport}
        className={cn(
          "group-data-[mode=pinned]/track:flex",
          "group-data-[mode=pinned]/track:h-svh",
          "group-data-[mode=pinned]/track:flex-col",
          "group-data-[mode=pinned]/track:justify-center",
          "group-data-[mode=pinned]/track:overflow-hidden",
        )}
      >
        {header}

        <div
          ref={track}
          className={cn(
            "grid gap-3",
            trackClassName,
            // Pinned mode overrides the stacked grid wholesale. `w-max` is
            // what lets the track be wider than its frame — without it the
            // flex row shrinks to fit and there is nothing to translate.
            "group-data-[mode=pinned]/track:flex",
            "group-data-[mode=pinned]/track:w-max",
            "group-data-[mode=pinned]/track:grid-cols-none",
            "group-data-[mode=pinned]/track:gap-6",
            "group-data-[mode=pinned]/track:will-change-transform",
          )}
        >
          {children}
        </div>

        {/*
          The progress readout. It exists because a pinned section takes the
          scrollbar away — the one instrument that tells a reader how much is
          left — and replacing it is the difference between an interaction
          that feels controlled and one that feels like being held.

          `aria-hidden`: the cards are real content in the DOM either way, and
          a live region announcing "3 of 6" on every scroll frame would be
          intolerable. It is drawn only in pinned mode, since anywhere else
          the real scrollbar is doing this job.
        */}
        {pinned && (
          <div
            aria-hidden="true"
            className="mt-10 hidden items-center gap-4 group-data-[mode=pinned]/track:flex"
          >
            <span className="tnum text-[0.6875rem] tracking-[0.16em] text-ink-4">
              {String(active + 1).padStart(2, "0")}
            </span>
            <span className="relative h-px w-40 bg-line-strong">
              <span
                className="absolute inset-y-0 left-0 origin-left bg-brand transition-transform duration-500 ease-[var(--ease-brand)]"
                style={{
                  width: "100%",
                  transform: `scaleX(${(active + 1) / count})`,
                }}
              />
            </span>
            <span className="tnum text-[0.6875rem] tracking-[0.16em] text-ink-4">
              {String(count).padStart(2, "0")}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
