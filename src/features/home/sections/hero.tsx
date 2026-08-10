"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { VIDEOS } from "@/content/imagery";
import { VideoMedia } from "@/components/ui/video-media";
import { Button } from "@/components/ui/button";
import { gsap, registerGsap, prefersReducedMotion, EASE } from "@/lib/motion";

/**
 * Runs before paint on the client, and degrades to `useEffect` during SSR
 * so React does not warn about `useLayoutEffect` on the server. This is
 * what lets the entrance set its own start state without a visible flash of
 * the final state — see the note on the headline below.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Hand-broken. Where a display headline breaks is a design decision. */
const LINES = ["Bulk haulage", "from Mississauga", "across Ontario"];

/**
 * Hero.
 *
 * A ROUNDED CARD, NOT A FULL-BLEED BAND. Inset on all four sides so the
 * page frame is visible around it from the first pixel — that single
 * decision is what tells the visitor the whole page is built from cards,
 * before they have scrolled at all.
 *
 * SIZED SO THE CARD AND THE STAT ROW TOGETHER ARE THE FIRST SCREEN. The
 * `8rem` subtracted from the viewport is the real furniture below the card:
 * the 12px gap, the ~88px stat row, and 12px of breathing room under it, so
 * the stats land ON the fold rather than half past it. Get this wrong in
 * either direction and the page opens badly — too short and the footage
 * reads as a banner, too tall and the stats are cut in half and look like
 * an accident.
 *
 * The viewport sizing starts at `md` only. Below that the stat row stacks
 * to one or two columns and is several hundred pixels tall, so subtracting
 * a fixed 8rem would leave a hero taller than the screen it is meant to
 * share. Small screens get a fixed height instead.
 *
 * `svh`, not `vh`: on mobile browsers `vh` measures the viewport with the
 * URL bar retracted, so a `vh`-sized hero is always taller than what you
 * can actually see on first paint.
 *
 * THE HEADLINE IS VISIBLE WITHOUT JAVASCRIPT, and that is a correction of
 * how the rest of the site works rather than an oversight.
 *
 * The site's convention is to PARK animated content in the markup — an
 * inline transform or `opacity-0` — and rely on GSAP to clear it. That buys
 * a flash-free entrance and accepts a brutal failure mode: if the tween
 * does not run, for any reason, the content is simply gone. Two successive
 * builds of this hero shipped an empty headline that way, first with a
 * hand-rolled park and then through `MaskLines`, which parks the same way.
 *
 * So the lines render in their FINAL position and the entrance is a
 * `gsap.from()`, which sets the start state at runtime. If the effect never
 * runs, never mind why, the headline is already correct. The flash that
 * parking exists to prevent is handled instead by running the effect before
 * paint — hence `useIsomorphicLayoutEffect`, which is also what GSAP's own
 * `useGSAP` hook does.
 *
 * On the LCP element of the homepage, "always legible, possibly a frame
 * late" beats "pixel-perfect or invisible".
 *
 * The footage is the LCP element, so it is `priority` and never lazy.
 * Everything animated here is `clip-path` or `transform`, so the opening
 * costs no layout.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    registerGsap();

    const meta = el.querySelectorAll<HTMLElement>("[data-meta]");

    if (prefersReducedMotion()) {
      // `meta` needs no restoring — it is not parked in the markup.
      gsap.set(frame.current, { clipPath: "inset(0% 0% 0% 0% round 1.25rem)" });
      gsap.set(image.current, { scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: EASE } });

      /*
       * The wipe opens from the card's own edges. Insetting a clip-path on
       * a rounded element keeps the radius — the reveal is the card growing
       * into itself, not a rectangle uncovering it.
       */
      tl.fromTo(
        frame.current,
        { clipPath: "inset(6% 4% 6% 4% round 1.25rem)" },
        { clipPath: "inset(0% 0% 0% 0% round 1.25rem)", duration: 1.4 },
      )
        .fromTo(image.current, { scale: 1.12 }, { scale: 1, duration: 1.8 }, 0)
        /*
         * `.from()`, not `.fromTo()` — the lines are already in place in the
         * DOM and this only borrows them backwards for the entrance.
         */
        .from(
          el.querySelectorAll<HTMLElement>("[data-line]"),
          { yPercent: 120, duration: 1.1, stagger: 0.07 },
          0.35,
        )
        .from(meta, { opacity: 0, y: 18, duration: 1 }, 0.85);

      gsap.to(image.current, {
        yPercent: 10,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="container-page pt-3" aria-labelledby="hero-heading">
      <div
        ref={frame}
        className="relative h-[30rem] overflow-hidden rounded-plate bg-ink sm:h-[34rem] md:h-[calc(100svh-8rem)] md:max-h-[56rem] md:min-h-[34rem]"
        style={{ clipPath: "inset(0% 0% 0% 0% round 1.25rem)" }}
      >
        <div ref={image} className="absolute inset-0 will-change-transform">
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

        {/* `pt-28` / `pt-36` is the fixed header's clearance, reserved so the
            headline can never rise under the nav on a short viewport. */}
        <div className="relative z-10 flex h-full flex-col justify-end p-6 pt-28 md:p-10 md:pt-36">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
            <h1
              id="hero-heading"
              className="font-display text-[clamp(2.25rem,4.4vw,3.75rem)] leading-[1.06] tracking-[-0.014em] text-white lg:col-span-7"
            >
              {LINES.map((line) => (
                /*
                  The mask needs relief below the line box or it shaves the
                  descenders off every "g" and "p" for the life of the page:
                  at `leading-[1.06]` the line box is shorter than the glyphs
                  Instrument Serif actually draws, and a serif's descenders
                  reach further than the geometric sans this replaced. The
                  negative margin gives the padding back, so the relief costs
                  no layout.
                */
                <span
                  key={line}
                  className="block overflow-hidden"
                  style={{ paddingBottom: "0.18em", marginBottom: "-0.18em" }}
                >
                  <span data-line className="block will-change-transform">
                    {line}
                  </span>
                </span>
              ))}
            </h1>

            <div data-meta className="lg:col-span-4 lg:col-start-9">
              <p className="max-w-sm text-[0.9375rem] leading-relaxed text-white/80">
                Aggregate, liquid asphalt, waste and open-deck freight —
                dispatched to your site cadence, sequenced so material arrives
                in the order the work needs it.
              </p>
              <Button href="/quote" size="lg" className="mt-7" arrow>
                Request a quote
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
