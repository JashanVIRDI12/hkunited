"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { COMPANY } from "@/content/company";
import { VIDEOS } from "@/content/imagery";
import { VideoMedia } from "@/components/ui/video-media";
import { Button } from "@/components/ui/button";
import {
  gsap,
  registerGsap,
  prefersReducedMotion,
  motionMedia,
  onPageEntrance,
  EASE,
  DUR,
  STAGGER,
} from "@/lib/motion";

/**
 * Runs before paint on the client, and degrades to `useEffect` during SSR so
 * React does not warn about `useLayoutEffect` on the server. This is what
 * lets the entrance set its own start state without a visible flash of the
 * final state.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Hand-broken. Where a display headline breaks is a design decision. */
const LINES = ["Bulk haulage", "from Mississauga", "across Ontario"];

/**
 * Relief below each line's box, so `clip-path: inset(0 ...)` — the FINAL,
 * permanent state — does not shave the descenders off "g" and "q" for the
 * life of the page. At `leading-[1.06]` the line box is shorter than the
 * glyphs Instrument Serif actually draws. The matching negative margin gives
 * the space back, so the relief costs no layout.
 */
const RELIEF = "0.2em";

/** Hidden: the clip region is collapsed against the line's bottom edge. */
const CLIPPED = "inset(100% 0% 0% 0%)";
/** Open: the full padded box, descenders included. */
const OPEN = "inset(0% 0% 0% 0%)";

/**
 * Hero.
 *
 * THE PAGE'S ONE CINEMATIC ENTRANCE, and the only place on the site where a
 * timeline is allowed to run on load rather than on scroll.
 *
 * THE ORDER IS THE MESSAGE. Six things arrive, and they arrive in the order
 * a reader needs them rather than all at once:
 *
 *     footage      the card opens and the shot settles      0.00
 *     eyebrow      where we are, how long we have been      0.30
 *     headline     line, line, line — the film title        0.45
 *     lead         what that actually means                 1.05
 *     controls     the way in                               1.25
 *
 * Nothing overlaps by accident. The headline starts before the eyebrow has
 * finished and the lead starts before the headline has, so the whole thing
 * reads as one continuous gesture with weight distributed through it — not
 * as five animations queued back to back. Play them simultaneously and the
 * hero reads as a page that faded in; play them strictly in sequence and it
 * reads as a slideshow.
 *
 * MASS DETERMINES SPEED. The headline lines run 1.25s, the lead and controls
 * 0.85s. The heaviest object on the page is the slowest, which is the single
 * relationship that makes the whole thing feel physical.
 *
 * THE HEADLINE IS CLIPPED, NOT FADED. Each line opens from a `clip-path`
 * inset collapsed against its own baseline while the text itself rises 40px
 * into the opening gap. Both properties composite, so a three-line display
 * headline costs no layout and no repaint. A fade would say "content
 * loaded"; a line lifting out of a mask says the words were placed.
 *
 * IT WAITS FOR THE CURTAIN. `onPageEntrance` holds the timeline until the
 * intro loader has lifted. Without it the most expensive animation on the
 * site plays underneath an opaque overlay and the visitor's first sight of
 * the page is its final frame.
 *
 * THE HEADLINE IS VISIBLE WITHOUT JAVASCRIPT, and that is a correction of
 * how the rest of this site works rather than an oversight. Every line
 * renders in its final position and the start state is applied by the same
 * code that will animate it away. If the effect never runs — for any reason,
 * including a bundle that failed — the headline is already correct. On the
 * LCP element of the homepage, "always legible, possibly a frame late" beats
 * "pixel-perfect or invisible".
 *
 * The footage is the LCP element, so it is `priority` and never lazy.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const zoom = useRef<HTMLDivElement>(null);
  const plate = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    registerGsap();

    const lines = el.querySelectorAll<HTMLElement>("[data-line]");
    const eyebrow = el.querySelector<HTMLElement>("[data-eyebrow]");
    const lead = el.querySelector<HTMLElement>("[data-lead]");
    const cta = el.querySelector<HTMLElement>("[data-cta]");

    /** Everything the entrance moves, as one flat list. */
    const staged = [...lines, eyebrow, lead, cta].filter(
      (node): node is HTMLElement => Boolean(node),
    );

    if (prefersReducedMotion()) {
      // Everything to its resting state, synchronously. Nothing to reveal.
      gsap.set(lines, { clipPath: OPEN, y: 0 });
      gsap.set([eyebrow, lead, cta], { opacity: 1, y: 0 });
      gsap.set(zoom.current, { scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {}, el);

    /*
     * NOTHING IS PARKED BEFORE THIS RUNS, and that is the whole design of the
     * effect rather than a detail of it.
     *
     * Every child below is a `fromTo`, which renders its start state the
     * instant the timeline is BUILT — and the timeline is built and started in
     * the same breath. So the window in which this hero is hidden-but-not-yet-
     * animating is zero frames wide, and there is no state the markup can be
     * left in if this code never runs at all. The page simply renders a
     * finished hero.
     *
     * That is the correction of a real failure: the site's convention had been
     * to park content in the markup and rely on a tween to release it, and
     * this hero shipped an empty headline that way twice.
     *
     * The two cases both land clean. With no curtain, `play` is called
     * synchronously from a layout effect, so the start states are in place
     * before first paint. With the curtain, the hero is sitting in its final
     * state behind an opaque overlay until the moment this fires.
     *
     * `ctx.add`, not a bare timeline: a context only records what is created
     * while it is open, and this runs a second or more after that. Created
     * outside it, the timeline would survive unmount and go on writing to
     * detached nodes after a route change.
     */
    const play = () =>
      ctx.add(() => {
        gsap.set(staged, { willChange: "transform, opacity" });

        gsap
          .timeline({
            defaults: { ease: EASE.deep },
            // The hint is only worth its compositor layer for as long as the
            // tween runs. Held permanently on a dozen nodes it costs more
            // than it buys.
            onComplete: () => gsap.set(staged, { willChange: "auto" }),
          })
          /*
           * The card opens from its own edges. Insetting a clip-path on a
           * rounded element keeps the radius, so this reads as the card
           * growing into itself rather than a rectangle uncovering it.
           */
          .fromTo(
            frame.current,
            { clipPath: "inset(6% 4% 6% 4% round 1.25rem)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 1.25rem)",
              duration: DUR.section,
              ease: EASE.cine,
            },
          )
          // 1.08 → 1. The shot settles rather than zooms; anything larger and
          // the footage is still visibly moving when the headline lands,
          // which pulls the eye off the words.
          .fromTo(
            zoom.current,
            { scale: 1.08 },
            { scale: 1, duration: 2, ease: EASE.cine },
            0,
          )
          .fromTo(
            eyebrow,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: DUR.reveal },
            0.3,
          )
          .fromTo(
            lines,
            { clipPath: CLIPPED, y: 40 },
            {
              clipPath: OPEN,
              y: 0,
              duration: DUR.cinematic,
              stagger: STAGGER.lines * 1.6,
            },
            0.45,
          )
          .fromTo(
            lead,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: DUR.reveal },
            1.05,
          )
          .fromTo(
            cta,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: DUR.reveal },
            1.25,
          );
      });

    const cancelEntrance = onPageEntrance(play);

    /*
     * Parallax, and ONLY where it earns its keep.
     *
     * The plate carries a permanent overscale so translating it never exposes
     * an empty strip at the frame's edge — a plate moved by ±A% has to
     * overhang by A% on each side, hence `1 + 2A/100`. Mobile gets neither:
     * the crop is a real cost, and a 6% drift on a phone is imperceptible
     * while the extra compositing very much is not.
     *
     * Kept OUTSIDE the context on purpose. `matchMedia` owns its own
     * contexts and reverts everything created in the handler when the query
     * stops matching; nesting the two means whichever reverts second is
     * writing to elements the first has already restored.
     */
    const revertMedia = motionMedia(el, (c) => {
      if (c.reduced || c.isMobile) {
        gsap.set(plate.current, { scale: 1, yPercent: 0 });
        return;
      }

      const amount = c.isTablet ? 4 : 6;
      gsap.set(plate.current, { scale: 1 + (2 * amount) / 100 + 0.005 });

      gsap.fromTo(
        plate.current,
        { yPercent: -amount },
        {
          yPercent: amount,
          ease: EASE.none,
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });

    return () => {
      cancelEntrance();
      revertMedia();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className="container-page pt-3" aria-labelledby="hero-heading">
      <div
        ref={frame}
        className="relative h-[30rem] overflow-hidden rounded-plate bg-ink sm:h-[34rem] md:h-[calc(100svh-8rem)] md:max-h-[56rem] md:min-h-[34rem]"
        style={{ clipPath: "inset(0% 0% 0% 0% round 1.25rem)" }}
      >
        {/* Two nodes, deliberately: the entrance settle and the scroll drift
            are separate concerns and would otherwise fight over one
            element's `transform`. */}
        <div ref={zoom} className="absolute inset-0 will-change-transform">
          <div ref={plate} className="absolute inset-0">
            <VideoMedia
              poster={VIDEOS.heroConvoy.poster}
              src={VIDEOS.heroConvoy.src}
              ratio="auto"
              radius="none"
              className="h-full w-full"
              priority
              sizes="100vw"
              scrim="bottom"
            />
          </div>
        </div>

        {/* `pt-28` / `pt-36` is the fixed header's clearance, reserved so the
            headline can never rise under the nav on a short viewport. */}
        <div className="relative z-10 flex h-full flex-col justify-end p-6 pt-28 md:p-10 md:pt-36">
          <p
            data-eyebrow
            className="eyebrow mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-white/60"
          >
            <span>
              {COMPANY.address.city}, {COMPANY.address.regionName}
            </span>
            <span aria-hidden="true" className="h-px w-6 bg-white/30" />
            <span>{COMPANY.yearsInOperation}+ years on the road</span>
          </p>

          <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
            <h1
              id="hero-heading"
              className="font-display text-[clamp(2.25rem,4.4vw,3.75rem)] leading-[1.06] tracking-[-0.014em] text-white lg:col-span-7"
            >
              {LINES.map((line) => (
                <span
                  key={line}
                  data-line
                  className="block"
                  style={{ paddingBottom: RELIEF, marginBottom: `-${RELIEF}` }}
                >
                  {line}
                </span>
              ))}
            </h1>

            <div className="lg:col-span-4 lg:col-start-9">
              <p
                data-lead
                className="max-w-sm text-[0.9375rem] leading-relaxed text-white/80"
              >
                Aggregate, liquid asphalt, waste and open-deck freight —
                dispatched to your site cadence, sequenced so material arrives
                in the order the work needs it.
              </p>
              <div data-cta className="mt-7 flex flex-wrap items-center gap-3">
                <Button href="/quote" size="lg" arrow>
                  Request a quote
                </Button>
                <Button href="/fleet" size="lg" variant="onImageOutline">
                  See the fleet
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
